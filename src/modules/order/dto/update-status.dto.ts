// src/modules/order/dto/update-status.dto.ts
import { IsEnum } from 'class-validator';
import { OrderStatus } from './create-order.dto';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
