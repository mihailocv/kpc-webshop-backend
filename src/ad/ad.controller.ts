// src/ad/ad.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateAdDto } from './dto/update-ad.dto';

@Controller('ads') // URL će biti /ads
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('image', {
      // polje u formi se zove 'image'
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
          // Ako fajl NIJE odgovarajućeg tipa, odbaci ga sa greškom
          return cb(
            new BadRequestException(
              'Dozvoljeni formati slike su JPG, PNG i GIF.',
            ),
            false,
          );
        }
        // Ako je sve u redu, prihvati fajl
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createAdDto: CreateAdDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
        ],
      }),
    )
    image: Express.Multer.File,
    @Request() req,
  ) {
    console.log(
      'Primljeni DTO:',
      createAdDto,
      'Tip cene:',
      typeof createAdDto.price,
    );
    const user = req.user;

    // VAŽNO: U produkciji, ovde treba da bude pravi domen aplikacije
    const imageUrl = `http://localhost:3000/uploads/${image.filename}`;

    return this.adService.create(createAdDto, user, imageUrl);
  }

  @Get()
  findAll() {
    return this.adService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Ova linija je ispravna, id je string
    return this.adService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // Dodaj zaštitu i na update
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    // Prosleđujemo 'id' kao string, bez '+'
    return this.adService.update(id, updateAdDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // Dodaj zaštitu i na delete
  remove(@Param('id') id: string) {
    // Prosleđujemo 'id' kao string, bez '+'
    return this.adService.remove(id);
  }
}
