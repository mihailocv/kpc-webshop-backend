import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'Korisničko ime mora biti tekst.' })
  @IsNotEmpty({ message: 'Korisničko ime ne sme biti prazno.' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Lozinka ne sme biti prazna.' })
  @MinLength(8, { message: 'Lozinka mora imati najmanje 8 karaktera.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Broj telefona ne sme biti prazan.' })
  phoneNumber: string;
}
