import { IsInt, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
