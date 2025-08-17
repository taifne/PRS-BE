import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
import { Resume, ResumeDocument } from './resume.schema';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
  ) {}

  async create(userId: Types.ObjectId, createResumeDto: CreateResumeDto): Promise<Resume> {
    const created = new this.resumeModel({
      ...createResumeDto,
      user: userId,
    });
    return created.save();
  }

async findAllByUser(userId: string) {
  return this.resumeModel.find({ user: userId }).exec();
}


  async findById(userId: Types.ObjectId, id: string): Promise<Resume> {
    const resume = await this.resumeModel
      .findOne({ _id: id, user: userId })
      .exec();

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async update(
    userId: Types.ObjectId,
    id: string,
    updateResumeDto: UpdateResumeDto,
  ): Promise<Resume> {
    const updated = await this.resumeModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        updateResumeDto,
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Resume not found');
    }

    return updated;
  }

  async delete(userId: Types.ObjectId, id: string): Promise<void> {
    const result = await this.resumeModel
      .deleteOne({ _id: id, user: userId })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Resume not found');
    }
  }
}
