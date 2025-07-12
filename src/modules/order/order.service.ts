import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './dto/create-order.dto';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private messagingService: MessagingService,
  ) {
    this.messagingService.subscribe('pedido_criado', (data) => {
      console.log('📦 Pedido criado recebido no OrderService:', data);
    });

    this.messagingService.subscribe('status_alterado', (data) => {
      console.log('🔄 Status alterado:', data);
    });

    this.messagingService.subscribe('pedido_cancelado', (data) => {
      console.log('❌ Pedido cancelado:', data);
    });
  }

  async create(userId: number, data: CreateOrderDto) {
    const { productIds } = data;

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new BadRequestException(`User with id ${userId} does not exist.`);
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException(`One or more products do not exist.`);
    }

    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        address: data.address,
        orderToProduct: {
          create: productIds.map((productId) => ({
            product: { connect: { id: productId } },
          })),
        },
      },
      include: {
        user: true,
        orderToProduct: { include: { product: true } },
      },
    });

    await this.messagingService.publish('pedido_criado', {
      pedidoId: order.id,
      userId: userId,
      status: order.status,
    });

    return order;
  }

  findAll() {
    return this.prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderToProduct: {
          select: {
            productId: true,
            orderId: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderToProduct: {
          select: {
            productId: true,
            orderId: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  findByStatus(status: OrderStatus) {
    return this.prisma.order.findMany({
      where: { status },
      select: {
        id: true,
        createdAt: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderToProduct: {
          select: {
            productId: true,
            orderId: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateOrderDto) {
    const { productIds, status } = data;

    if (productIds) {
      const products = await this.prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException(`One or more products do not exist.`);
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        address: data.address,
        status: status || undefined,
        orderToProduct: productIds
          ? {
              deleteMany: {}, // remove os produtos antigos
              create: productIds.map((productId) => ({
                product: { connect: { id: productId } },
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderToProduct: {
          select: {
            productId: true,
            orderId: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: number, status: OrderStatus) {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
    });

    if (status === OrderStatus.CANCELADO) {
      await this.messagingService.publish('pedido_cancelado', {
        pedidoId: updated.id,
        userId: updated.userId,
        status: updated.status,
      });
    } else {
      await this.messagingService.publish('status_alterado', {
        pedidoId: updated.id,
        userId: updated.userId,
        status: updated.status,
      });
    }

    return updated;
  }

  remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
