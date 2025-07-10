import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  productIds: number[];
}
