import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  stripePriceId: string;

  @IsString()
  type: string; // monthly / yearly

  @IsInt()
  maxPosts: number;

  @IsNumber()
  priceUsd: number;

  @IsOptional()
  @IsString()
  description?: string;
}
