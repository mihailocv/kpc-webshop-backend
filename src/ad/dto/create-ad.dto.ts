import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { AdCategory } from '../enum/ad-category.enum';
import { Type } from 'class-transformer';

export class CreateAdDto {
  @IsString({ message: 'Naziv oglasa mora biti tekst.' })
  @IsNotEmpty({ message: 'Naziv oglasa ne sme biti prazan.' })
  @MinLength(3, { message: 'Naziv oglasa mora imati bar 3 karaktera.' })
  title: string;

  @IsString({ message: 'Opis oglasa mora biti tekst.' })
  @IsNotEmpty({ message: 'Opis oglasa ne sme biti prazan.' })
  description: string;

  @IsNumber({}, { message: 'Cena mora biti broj.' })
  @IsPositive({ message: 'Cena mora biti pozitivan broj.' })
  @IsNotEmpty({ message: 'Cena ne sme biti prazna.' })
  @Type(() => Number)
  price: number;

  @IsEnum(AdCategory, { message: 'Izaberite validnu kategoriju.' })
  @IsNotEmpty({ message: 'Kategorija ne sme biti prazna.' })
  category: AdCategory;

  @IsString({ message: 'Grad mora biti tekst.' })
  @IsNotEmpty({ message: 'Grad ne sme biti prazan.' })
  city: string;
}
