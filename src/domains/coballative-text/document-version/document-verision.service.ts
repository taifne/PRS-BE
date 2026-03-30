import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';

import { BaseService } from 'src/common/base';
import { DocumentVersion, DocumentVersionDocument } from './document-version.schema';
import { DocumentVersionResponseDto } from './dto/response/resonse-document-version.dto';
import { CreateDocumentVersionDto } from './dto/request/create-document-version.dto';

@Injectable()
export class DocumentVersionService extends BaseService<DocumentVersionDocument> {
  constructor(
    @InjectModel(DocumentVersion.name)
    private readonly versionModel: Model<DocumentVersionDocument>,
  ) {
    super(versionModel);
  }

  /**
   * Get one version by ID
   */
  async findOneById(id: string): Promise<DocumentVersionResponseDto> {
    const version = await this.findOneByOrThrow(
      { _id: id, isDeleted: false },
      { message: 'Document version not found' },
    );

    return plainToInstance(DocumentVersionResponseDto, version, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Create a new document version
   */
  async createVersion(dto: CreateDocumentVersionDto): Promise<DocumentVersionResponseDto> {
    const normalizedChanges = (dto.changes || []).map((c) => ({
      position: c.position,
      insertedText: c.insertedText ?? '',
      deletedText: c.deletedText ?? '',
      timestamp: c.timestamp ?? new Date(),
    }));

    const latest = await this.versionModel
      .findOne({ documentId: dto.documentId, isDeleted: false })
      .sort({ versionNumber: -1 })
      .lean();

    const versionNumber = latest ? latest.versionNumber + 1 : 1;

    const created = await this.create({
      ...dto,
      versionNumber,
      changes: normalizedChanges,
    });

    return plainToInstance(DocumentVersionResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Soft delete a version
   */
  async deleteVersion(id: string): Promise<void> {
    await this.update(id, { isDeleted: true });
  }

  /**
   * Restore a version
   */
  async restoreVersion(id: string): Promise<DocumentVersionResponseDto> {
    const restored = await this.update(id, { isDeleted: false });

    return plainToInstance(DocumentVersionResponseDto, restored, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Get all versions by documentId
   */
  async findByDocumentId(documentId: string): Promise<DocumentVersionResponseDto[]> {

    const versions = await this.versionModel
      .find({ documentId: new Types.ObjectId(documentId), isDeleted: false })
      .sort({ versionNumber: -1 })
      .exec();

    return plainToInstance(DocumentVersionResponseDto, versions, {
      excludeExtraneousValues: true,
    });
  }
}