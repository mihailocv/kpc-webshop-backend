import { PartialType } from '@nestjs/mapped-types';
import { CreateAdDto } from './create-ad.dto';
import { AdCategory } from '../enum/ad-category.enum';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdDto extends PartialType(CreateAdDto) {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  title: string;

  description: string;

  price: number;

  category: AdCategory;

  city: string;
}
