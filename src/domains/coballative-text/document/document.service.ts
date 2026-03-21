import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseService } from 'src/common/base';
import { DocumentEntity, DocumentEntityDocument } from './document.schema';

@Injectable()
export class DocumentService extends BaseService<DocumentEntityDocument> {
  constructor(
    @InjectModel(DocumentEntity.name)
    private readonly documentModel: Model<DocumentEntityDocument>,
  ) {
    super(documentModel);
  }

  /**
   * Find a document by its ID
   */
  async findById(documentId: string): Promise<DocumentEntityDocument> {
    if (!Types.ObjectId.isValid(documentId)) {
      throw new BadRequestException('Invalid document ID');
    }

    const doc = await this.documentModel.findById(documentId).exec();
    if (!doc) {
      throw new NotFoundException(`Document ${documentId} not found`);
    }
    return doc;
  }

  /**
   * Create a new document
   */
  async createDocument(
    title: string,
    ownerId: Types.ObjectId,
    content = '',
  ): Promise<DocumentEntityDocument> {
    const newDoc = new this.documentModel({
      title,
      ownerId,
      content,
      collaborators: [{ userId: ownerId, role: 'owner' }],
    });

    return newDoc.save();
  }

  /**
   * Update document content
   */
  async updateContent(
    documentId: string,
    content: string,
  ): Promise<DocumentEntityDocument> {
    const doc = await this.findById(documentId);
    doc.content = content;
    return doc.save();
  }

  /**
   * Delete a document (soft delete)
   */
  async deleteDocument(documentId: string): Promise<void> {
    const doc = await this.findById(documentId);
    doc.isDeleted = true;
    await doc.save();
  }

  /**
   * List documents with optional filters
   */
  async findDocuments(
    ownerId?: Types.ObjectId,
    collaboratorId?: Types.ObjectId,
  ): Promise<DocumentEntityDocument[]> {
    const query: any = { isDeleted: false };

    if (ownerId) query.ownerId = ownerId;
    if (collaboratorId)
      query['collaborators.userId'] = collaboratorId;

    return this.documentModel.find(query).exec();
  }
}