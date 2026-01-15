import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types, Document } from 'mongoose';

export abstract class BaseService<TDocument extends Document> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create(dto: any): Promise<TDocument> {
    return new this.model(dto).save();
  }

  async findAll(populate?: any): Promise<TDocument[]> {
    const query = this.model.find();
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findOne(id: string): Promise<TDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const entity = await this.model.findById(id).exec();
    if (!entity) {
      throw new NotFoundException('Not found');
    }

    return entity;
  }

  async update(id: string, dto: any): Promise<TDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const entity = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!entity) {
      throw new NotFoundException('Not found');
    }

    return entity;
  }

  async delete(id: string): Promise<TDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const entity = await this.model.findByIdAndDelete(id).exec();
    if (!entity) {
      throw new NotFoundException('Not found');
    }

    return entity;
  }
}
