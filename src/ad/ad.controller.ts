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

@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('image', {
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
          return cb(
            new BadRequestException(
              'Dozvoljeni formati slike su JPG, PNG i GIF.',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createAdDto: CreateAdDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
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

    const imageUrl = `http://localhost:3000/uploads/${image.filename}`;

    return this.adService.create(createAdDto, user, imageUrl);
  }

  @Get()
  findAll() {
    return this.adService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateAdDto: UpdateAdDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.adService.update(id, updateAdDto, userId, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.adService.remove(id);
  }
}
