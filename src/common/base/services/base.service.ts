import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model, Types, Document, FilterQuery } from 'mongoose';

export abstract class BaseService<TDocument extends Document> {
  constructor(protected readonly model: Model<TDocument>) { }

  /**
     * Create a new document or return existing if unique fields already exist
     * @param dto Data to create
     * @param uniqueFields Optional field(s) to check existence. Can be string or string[]
     * @param throwIfExist Optional flag to throw error if document exists
     */
  async create(
    dto: any,
    uniqueFields?: string | string[],
    throwIfExist = false,
  ): Promise<TDocument> {
    if (uniqueFields) {
      const fieldsArray = Array.isArray(uniqueFields) ? uniqueFields : [uniqueFields];

      // Build query to check existence
      const query = fieldsArray.reduce((acc, field) => {
        if (dto[field] !== undefined) acc[field] = dto[field];
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(query).length > 0) {
        const existing = await this.model.findOne(query).exec();
        if (existing) {
          if (throwIfExist) {
            throw new BadRequestException(
              `Document with ${fieldsArray.join(', ')} already exists.`,
            );
          }
          return existing;
        }
      }
    }

    // Create new document
    return new this.model(dto).save();
  }
  async findAll(populate?: any): Promise<TDocument[]> {
    const query = this.model.find();
    if (populate) query.populate(populate);
    return query.exec();
  }

  /**
 * Find multiple documents by filter, throw if none found
 */
  async findAllByOrThrow<T = TDocument>(
    filter: FilterQuery<TDocument>,
    options?: {
      populate?: any;
      lean?: boolean;
      message?: string;
      sort?: any;
    },
  ): Promise<T[]> {
    let query = this.model.find(filter);

    if (options?.populate) query = query.populate(options.populate);
    if (options?.sort) query = query.sort(options.sort);

    const docs = options?.lean ? await query.lean<T>().exec() : await query.exec();

    if (!docs || (Array.isArray(docs) && docs.length === 0)) {
      throw new NotFoundException(options?.message || 'No resources found');
    }

    return docs as T[];
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

  async findOneByOrThrow<T = TDocument>(
    filter: FilterQuery<TDocument>,
    options?: {
      populate?: any;
      lean?: boolean;
      message?: string;
    },
  ): Promise<T> {
    let query = this.model.findOne(filter);

    if (options?.populate) {
      query = query.populate(options.populate);
    }

    const entity = options?.lean
      ? await query.lean<T>().exec()
      : await query.exec();

    if (!entity) {
      throw new NotFoundException(
        options?.message || 'Resource not found',
      );
    }

    return entity as T;
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
  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}
