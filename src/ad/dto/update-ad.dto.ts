import { PartialType } from '@nestjs/mapped-types';
import { CreateAdDto } from './create-ad.dto';
import { AdCategory } from '../enum/ad-category.enum';

export class UpdateAdDto extends PartialType(CreateAdDto) {
  imageUrl?: string;

  title: string;

  description: string;

  price: number;

  category: AdCategory;

  city: string;
}
