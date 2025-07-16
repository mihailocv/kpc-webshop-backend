import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ad } from './entities/ad.entity';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdService {
  constructor(@InjectModel(Ad.name) private adModel: Model<Ad>) {}

  create(createAdDto: CreateAdDto, user: User, imageUrl: string) {
    const data = {
      ...createAdDto,
      user: user,
      imageUrl: imageUrl,
    };

    const createAd = new this.adModel(data);
    return createAd.save();
  }

  findAll() {
    return this.adModel.find().populate('user', 'username phoneNumber').exec();
  }

  findOne(id: string) {
    return this.adModel
      .findById(id)
      .populate('user', 'username phoneNumber')
      .exec();
  }

  async update(
    id: string,
    updateAdDto: UpdateAdDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<Ad> {
    const existingAd = await this.adModel.findById(id).exec();

    if (!existingAd) {
      throw new NotFoundException(`Oglas sa ID-jem "${id}" nije pronađen.`);
    }

    if (existingAd.user.toString() !== userId) {
      throw new ForbiddenException('Nemate dozvolu da mijenjate ovaj oglas.');
    }

    if (file) {
      updateAdDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    } else {
      delete updateAdDto.imageUrl;
    }

    if (updateAdDto.price) {
      updateAdDto.price = Number(updateAdDto.price);
    }

    const updatedAd = await this.adModel
      .findByIdAndUpdate(id, updateAdDto, { new: true })
      .exec();

    if (!updatedAd) {
      throw new NotFoundException(
        `Oglas sa ID-jem "${id}" nije mogao biti ažuriran.`,
      );
    }

    return updatedAd;
  }

  remove(id: string) {
    return this.adModel.findByIdAndDelete(id);
  }
}
