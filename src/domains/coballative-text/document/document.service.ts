import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model, Types } from "mongoose";
import { BaseService } from "src/common";
import { DocumentEntityDocument, DocumentEntity, DocumentPrivacy } from "./document.schema";
import { UpdateDocumentDto } from "./dto/requests/update-document.dto";
import { DocumentResponseDto } from "./dto/response/document-response.dto";
import { CreateDocumentDto } from "./dto/requests/create-document.dto";

@Injectable()
export class DocumentService extends BaseService<DocumentEntityDocument> {
  constructor(
    @InjectModel(DocumentEntity.name) private readonly documentModel: Model<DocumentEntityDocument>,
  ) {
    super(documentModel);
  }

  /** Create a new document */
  async createDocument(createDto: CreateDocumentDto): Promise<DocumentResponseDto> {
    console.log("createDto", createDto);
    const document = await this.create(createDto);
    return plainToInstance(DocumentResponseDto, document, { excludeExtraneousValues: true });
  }

  async findAllByOwner(ownerId: string): Promise<DocumentResponseDto[]> {
    const docs = await this.findAllByOrThrow<DocumentEntity>(
      { ownerId, isDeleted: false },
      {
        lean: true,
        message: `No documents found for owner ${ownerId}`,
        populate: [
          {
            path: 'ownerId',
            select: 'username email displayName',
          },
          {
            path: 'collaborators',
            select: 'username email displayName',
          },
          {
            path: 'viewers',
            select: 'username email displayName',
          },
          {
            path: 'documentTypeId',
            select: 'name', // adjust based on your schema
          },
        ],
      },
    );

    return plainToInstance(DocumentResponseDto, docs, {
      excludeExtraneousValues: true,
    });
  }


  async getById(id: string, currentUserId: string): Promise<DocumentResponseDto> {
    const doc = await super.findOne(id);

    if (!doc || doc.isDeleted) {
      throw new NotFoundException('Document not found');
    }

    const userId = currentUserId.toString();

    const isOwner = doc.ownerId?.toString() === userId;

    const isCollaborator = doc.collaborators?.some(
      (c) => c.toString() === userId,
    );

    const isViewer = doc.viewers?.some(
      (v) => v.toString() === userId,
    );

    const isPublic = doc.privacy === DocumentPrivacy.PUBLIC;

    if (!isOwner && !isCollaborator && !isViewer && !isPublic) {
      throw new ForbiddenException('You do not have access to this document');
    }

    return plainToInstance(DocumentResponseDto, doc, {
      excludeExtraneousValues: true,
    });
  }

  /** Update a document by ID */
  async updateDocument(id: string, dto: UpdateDocumentDto): Promise<DocumentResponseDto> {
    const updated = await super.update(id, dto); // calls base service
    return plainToInstance(DocumentResponseDto, updated, { excludeExtraneousValues: true });
  }

  /** Soft delete a document */
  async softDeleteDocument(id: string): Promise<void> {
    await super.findOne(id); // ensure it exists
    await super.update(id, { isDeleted: true });
  }
}