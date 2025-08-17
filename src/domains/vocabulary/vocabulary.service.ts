import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Vocabulary, VocabularyDocument } from './vocabulary.schema';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<VocabularyDocument>,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<Vocabulary> {
    const createdWord = new this.vocabularyModel(createVocabularyDto);
    return createdWord.save();
  }

  async findAll(
    filters?: {
      topics?: string[];
      level?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: Vocabulary[]; total: number }> {
    const query: any = {};
    if (filters?.topics?.length) query.topics = { $in: filters.topics };
    if (filters?.level) query.level = filters.level;
    if (filters?.search) {
      query.word = { $regex: filters.search, $options: 'i' };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.vocabularyModel.find(query).skip(skip).limit(limit).exec(),
      this.vocabularyModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Vocabulary> {
    const word = await this.vocabularyModel.findById(id).exec();
    if (!word) throw new NotFoundException(`Vocabulary with id ${id} not found`);
    return word;
  }

  async update(id: string, updateDto: UpdateVocabularyDto): Promise<Vocabulary> {
    const updatedWord = await this.vocabularyModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updatedWord) throw new NotFoundException(`Vocabulary with id ${id} not found`);
    return updatedWord;
  }

  async remove(id: string): Promise<void> {
    const res = await this.vocabularyModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Vocabulary with id ${id} not found`);
  }
}
