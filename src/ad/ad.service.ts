import { Injectable } from '@nestjs/common';
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

  // Očekuje string, što je ispravno
  findOne(id: string) {
    return this.adModel
      .findById(id)
      .populate('user', 'username phoneNumber')
      .exec();
  }

  // Proveri da update metoda takođe prima string
  update(id: string, updateAdDto: UpdateAdDto) {
    return this.adModel.findByIdAndUpdate(id, updateAdDto, { new: true });
  }

  // Proveri da remove metoda takođe prima string
  remove(id: string) {
    return this.adModel.findByIdAndDelete(id);
  }
}
