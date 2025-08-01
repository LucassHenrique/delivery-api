import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';

export enum OrderStatus {
  PENDENTE = 'PENDENTE',
  EM_PREPARACAO = 'EM_PREPARACAO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  productIds: number[];

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  address?: string;
}
