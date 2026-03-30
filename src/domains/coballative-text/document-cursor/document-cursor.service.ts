import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';

import { BaseService } from 'src/common/base';
import { DocumentCursorDocument, DocumentCursor } from './document-cursor.schema';
import { CreateDocumentCursorDto } from './dto/request/create-document-cursor.dto';
import { GetDocumentCursorDto } from './dto/request/get-document-cursor.dto';
import { DocumentCursorResponseDto } from './dto/response/document-cursor.response.dto';

@Injectable()
export class DocumentCursorService extends BaseService<DocumentCursorDocument> {
  constructor(
    @InjectModel(DocumentCursor.name)
    private readonly cursorModel: Model<DocumentCursorDocument>,
  ) {
    super(cursorModel);
  }

  /**
   * Get one cursor by ID
   */
  async findOneById(id: string): Promise<DocumentCursorResponseDto> {
    const cursor = await this.findOneByOrThrow(
      { _id: id },
      { message: 'Document cursor not found' },
    );

    return plainToInstance(DocumentCursorResponseDto, cursor, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Create or return existing (documentId + userId)
   */
  async createCursor(
    dto: CreateDocumentCursorDto,
  ): Promise<DocumentCursorResponseDto> {
    const created = await this.create(
      {
        ...dto,
        documentId: new Types.ObjectId(dto.documentId),
        userId: new Types.ObjectId(dto.userId),
      },
      ['documentId', 'userId'],
      false,
    );

    return plainToInstance(DocumentCursorResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all cursors (with optional filters)
   */
  async findCursors(
    query: GetDocumentCursorDto,
  ): Promise<DocumentCursorResponseDto[]> {
    const filter: any = {};

    if (query.documentId) {
      filter.documentId = new Types.ObjectId(query.documentId);
    }

    if (query.userId) {
      filter.userId = new Types.ObjectId(query.userId);
    }

    const cursors = await this.cursorModel.find(filter).exec();

    return plainToInstance(DocumentCursorResponseDto, cursors, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Delete cursor
   */
  async deleteCursor(id: string): Promise<void> {
    await this.delete(id);
  }
}