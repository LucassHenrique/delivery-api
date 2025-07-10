import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

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

  async update(id: number, data: UpdateOrderDto) {
    const { productIds } = data;

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
        orderToProduct: productIds
          ? {
              deleteMany: {},
              create: productIds.map((productId) => ({
                product: { connect: { id: productId } },
              })),
            }
          : undefined,
      },
      include: {
        user: true,
        orderToProduct: { include: { product: true } },
      },
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
