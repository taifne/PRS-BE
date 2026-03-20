import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from 'src/common/base';
import { DocumentVersion, DocumentVersionDocument } from './document-version.schema';

@Injectable()
export class DocumentVersionService extends BaseService<DocumentVersionDocument> {
  constructor(
    @InjectModel(DocumentVersion.name)
    private readonly versionModel: Model<DocumentVersionDocument>,
  ) {
    super(versionModel);
  }

  /**
   * List all versions of a document
   */
  async findByDocumentId(documentId: string): Promise<DocumentVersionDocument[]> {
    if (!Types.ObjectId.isValid(documentId)) {
      throw new BadRequestException('Invalid document ID');
    }

    return this.versionModel
      .find({ documentId: new Types.ObjectId(documentId), isDeleted: false })
      .sort({ versionNumber: -1 })
      .exec();
  }
}