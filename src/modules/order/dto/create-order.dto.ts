import {
  IsInt,
  Min,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  productIds: number[];
}
