import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { Request } from 'express';
import { Types } from 'mongoose';

import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto';
import { ResumeService } from './resume.service';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    const userId = req.user['userId'] as Types.ObjectId;
    return this.resumeService.create(userId, createResumeDto);
  }

@Get()
async findAll(@Query('userId') userId: string) {
  if (!userId) throw new BadRequestException('Missing userId');
  return this.resumeService.findAllByUser(userId);
}


  @Get(':id')
  async findById(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const userId = req.user['userId'] as Types.ObjectId;
    return this.resumeService.findById(userId, id);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    const userId = req.user['userId'] as Types.ObjectId;
    return this.resumeService.update(userId, id, updateResumeDto);
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const userId = req.user['userId'] as Types.ObjectId;
    return this.resumeService.delete(userId, id);
  }
}
