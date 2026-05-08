import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model, Types } from "mongoose";
import { BaseService } from "src/common";
import { DocumentEntityDocument, DocumentEntity, DocumentPrivacy } from "./document.schema";
import { UpdateDocumentDto } from "./dto/requests/update-document.dto";
import { DocumentResponseDto } from "./dto/response/document-response.dto";
import { CreateDocumentDto } from "./dto/requests/create-document.dto";
import { SearchDocumentDto } from "./dto/requests/search-document.dto";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.schema";

@Injectable()
export class DocumentService extends BaseService<DocumentEntityDocument> {
  constructor(
    @InjectModel(DocumentEntity.name) private readonly documentModel: Model<DocumentEntityDocument>,
    private readonly notificationService: NotificationService,
  ) {
    super(documentModel);
  }

  // ✅ Helper method to send notifications
  private async sendDocumentNotifications(
    document: DocumentEntity,
    previousCollaborators: string[],
    previousViewers: string[],
    currentUserId: string,
    currentUserName: string,
  ) {
    // Convert ObjectId arrays to string arrays for comparison
    const currentCollaborators = document.collaborators?.map(c => c.toString()) || [];
    const currentViewers = document.viewers?.map(v => v.toString()) || [];

    const newCollaborators = currentCollaborators.filter(c => !previousCollaborators.includes(c));
    const newViewers = currentViewers.filter(v => !previousViewers.includes(v));

    // Get document ID as string
    const documentId = (document as any)._id?.toString();

    // Send notifications for new collaborators
    for (const collaboratorId of newCollaborators) {
      if (collaboratorId !== currentUserId) {
        await this.notificationService.createNotification({
          userId: collaboratorId,
          type: NotificationType.COLLABORATOR_ADDED,
          documentId: documentId,
          actorId: currentUserId,
          message: `${currentUserName} added you as a collaborator to "${document.title}"`,
          metadata: {
            documentTitle: document.title,
            role: 'collaborator',
            actorName: currentUserName,
          },
        });
      }
    }

    // Send notifications for new viewers
    for (const viewerId of newViewers) {
      if (viewerId !== currentUserId) {
        await this.notificationService.createNotification({
          userId: viewerId,
          type: NotificationType.VIEWER_ADDED,
          documentId: documentId,
          actorId: currentUserId,
          message: `${currentUserName} shared "${document.title}" with you as a viewer`,
          metadata: {
            documentTitle: document.title,
            role: 'viewer',
            actorName: currentUserName,
          },
        });
      }
    }
  }

  async searchDocuments(filters: SearchDocumentDto): Promise<{
    data: DocumentResponseDto[];
    page: number;
    limit: number;
    total: number;
  }> {
    const {
      keyword,
      privacy,
      documentTypeId,
      collaboratorId,
      viewerId,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {
      isDeleted: false,
    };

    if (keyword?.trim()) {
      query.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { content: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    if (privacy) {
      query.privacy = privacy;
    }

    if (documentTypeId) {
      if (!Types.ObjectId.isValid(documentTypeId)) {
        throw new BadRequestException('Invalid documentTypeId');
      }
      query.documentTypeId = new Types.ObjectId(documentTypeId);
    }

    if (collaboratorId) {
      if (!Types.ObjectId.isValid(collaboratorId)) {
        throw new BadRequestException('Invalid collaboratorId');
      }
      query.collaborators = new Types.ObjectId(collaboratorId);
    }

    if (viewerId) {
      if (!Types.ObjectId.isValid(viewerId)) {
        throw new BadRequestException('Invalid viewerId');
      }
      query.viewers = new Types.ObjectId(viewerId);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.documentModel
        .find(query)
        .populate('ownerId', 'username email displayName')
        .populate('collaborators', 'username email displayName')
        .populate('viewers', 'username email displayName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.documentModel.countDocuments(query),
    ]);

    const mapped = plainToInstance(DocumentResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      data: mapped,
      total,
      page,
      limit,
    };
  }

  /** Create a new document */
  async createDocument(
    createDto: CreateDocumentDto,
    currentUserId: string,
    currentUserName: string,
  ): Promise<DocumentResponseDto> {
    console.log("createDto", createDto);
    
    // Convert string IDs to ObjectId for database
    const documentData = {
      ...createDto,
      ownerId: new Types.ObjectId(currentUserId),
      collaborators: createDto.collaborators?.map(id => new Types.ObjectId(id)) || [],
      viewers: createDto.viewers?.map(id => new Types.ObjectId(id)) || [],
      documentTypeId: createDto.documentTypeId ? new Types.ObjectId(createDto.documentTypeId) : undefined,
    };
    
    const document = await this.create(documentData);
    
    // Get document ID as string
    const documentId = (document as any)._id?.toString();
    
    // Send notifications for initial collaborators/viewers
    const initialCollaborators = createDto.collaborators || [];
    const initialViewers = createDto.viewers || [];
    
    for (const collaboratorId of initialCollaborators) {
      if (collaboratorId !== currentUserId) {
        await this.notificationService.createNotification({
          userId: collaboratorId,
          type: NotificationType.COLLABORATOR_ADDED,
          documentId: documentId,
          actorId: currentUserId,
          message: `${currentUserName} added you as a collaborator to "${createDto.title}"`,
          metadata: {
            documentTitle: createDto.title,
            role: 'collaborator',
            actorName: currentUserName,
          },
        });
      }
    }
    
    for (const viewerId of initialViewers) {
      if (viewerId !== currentUserId) {
        await this.notificationService.createNotification({
          userId: viewerId,
          type: NotificationType.VIEWER_ADDED,
          documentId: documentId,
          actorId: currentUserId,
          message: `${currentUserName} shared "${createDto.title}" with you as a viewer`,
          metadata: {
            documentTitle: createDto.title,
            role: 'viewer',
            actorName: currentUserName,
          },
        });
      }
    }
    
    return plainToInstance(DocumentResponseDto, document, { excludeExtraneousValues: true });
  }

async findAllByOwner(ownerId: string): Promise<DocumentResponseDto[]> {
  const docs = await this.documentModel
    .find({ ownerId: new Types.ObjectId(ownerId), isDeleted: false })
    .populate('ownerId', 'username email displayName')
    .populate('collaborators', 'username email displayName')
    .populate('viewers', 'username email displayName')
    .populate('documentTypeId', 'name')
    .lean();

  if (!docs || docs.length === 0) {
    return [];
  }

  const mappedDocs = docs.map((doc: any) => ({
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    ownerId: doc.ownerId?._id?.toString() || doc.ownerId?.toString(),
    collaborators: (doc.collaborators || []).map((c: any) => ({
      id: c._id?.toString() || c.toString(),
      username: c.username || 'Unknown',
      displayName: c.displayName || c.username || 'Unknown User',
      email: c.email || '',
    })),
    viewers: (doc.viewers || []).map((v: any) => v._id?.toString() || v.toString()),
    privacy: doc.privacy,
    documentTypeId: doc.documentTypeId?._id?.toString() || doc.documentTypeId?.toString(),
    documentTypeName: doc.documentTypeId?.name,
    isDeleted: doc.isDeleted,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));

  return plainToInstance(DocumentResponseDto, mappedDocs, {
    excludeExtraneousValues: true,
  });
}

async getById(id: string, currentUserId: string): Promise<DocumentResponseDto> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid document ID');
  }

  const doc = await this.documentModel
    .findById(id)
    .populate('ownerId', 'username email displayName')
    .populate('collaborators', 'username email displayName')
    .populate('viewers', 'username email displayName')
    .lean();

  if (!doc || doc.isDeleted) {
    throw new NotFoundException('Document not found');
  }

  const userId = currentUserId.toString();
  
  // Extract ownerId
  const ownerId = doc.ownerId?._id?.toString() || doc.ownerId?.toString();
  const isOwner = ownerId === userId;
  const isCollaborator = doc.collaborators?.some(
    (c: any) => c._id?.toString() === userId || c.toString() === userId,
  );
  const isViewer = doc.viewers?.some(
    (v: any) => v._id?.toString() === userId || v.toString() === userId,
  );
  const isPublic = doc.privacy === DocumentPrivacy.PUBLIC;

  if (!isOwner && !isCollaborator && !isViewer && !isPublic) {
    throw new ForbiddenException('You do not have access to this document');
  }

  // ✅ Build collaborators array with id
  const collaborators = (doc.collaborators || []).map((c: any) => {
    // Get the id correctly
    let collaboratorId = '';
    if (c._id) {
      collaboratorId = c._id.toString();
    } else if (c.id) {
      collaboratorId = c.id;
    } else if (c.toString) {
      collaboratorId = c.toString();
    }
    
    return {
      id: collaboratorId,
      username: c.username || 'Unknown',
      displayName: c.displayName || c.username || 'Unknown User',
      email: c.email || '',
    };
  }).filter(c => c.id); // Only include if has id

  // Build viewers array
  const viewers = (doc.viewers || []).map((v: any) => {
    if (v._id) return v._id.toString();
    if (v.id) return v.id;
    if (v.toString) return v.toString();
    return null;
  }).filter(Boolean);

  // Build response
  const response = {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    ownerId: ownerId,
    collaborators: collaborators,
    viewers: viewers,
    privacy: doc.privacy,
    documentTypeId: doc.documentTypeId?.toString(),
    isDeleted: doc.isDeleted,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return plainToInstance(DocumentResponseDto, response, {
    excludeExtraneousValues: true,
  });
}
  /** Update a document by ID */
  async updateDocument(
    id: string,
    dto: UpdateDocumentDto,
    currentUserId: string,
    currentUserName: string,
  ): Promise<DocumentResponseDto> {
    // Get existing document to compare collaborators/viewers
    const existingDoc = await this.documentModel.findById(id).lean();
    
    if (!existingDoc || existingDoc.isDeleted) {
      throw new NotFoundException('Document not found');
    }
    
    // Store previous values as strings
    const previousCollaborators = existingDoc.collaborators?.map((c: any) => c.toString()) || [];
    const previousViewers = existingDoc.viewers?.map((v: any) => v.toString()) || [];
    
    // Prepare update data with ObjectId conversion
    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.privacy !== undefined) updateData.privacy = dto.privacy;
    if (dto.collaborators !== undefined) {
      updateData.collaborators = dto.collaborators.map(id => new Types.ObjectId(id));
    }
    if (dto.viewers !== undefined) {
      updateData.viewers = dto.viewers.map(id => new Types.ObjectId(id));
    }
    if (dto.documentTypeId !== undefined) {
      updateData.documentTypeId = dto.documentTypeId ? new Types.ObjectId(dto.documentTypeId) : null;
    }
    
    const updated = await this.documentModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    
    if (!updated) {
      throw new NotFoundException('Document not found');
    }
    
    // Send notifications for new collaborators/viewers
    await this.sendDocumentNotifications(
      updated as any,
      previousCollaborators,
      previousViewers,
      currentUserId,
      currentUserName,
    );
    
    return plainToInstance(DocumentResponseDto, updated, { excludeExtraneousValues: true });
  }

  /** Soft delete a document */
  async softDeleteDocument(id: string): Promise<void> {
    const doc = await this.documentModel.findById(id);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    await this.documentModel.findByIdAndUpdate(id, { isDeleted: true });
  }
  // Get documents where user is a collaborator
async findDocumentsByCollaborator(userId: string): Promise<DocumentResponseDto[]> {
  const docs = await this.documentModel
    .find({ 
      collaborators: new Types.ObjectId(userId), 
      isDeleted: false 
    })
    .populate('ownerId', 'username email displayName')
    .populate('collaborators', 'username email displayName')
    .populate('viewers', 'username email displayName')
    .sort({ updatedAt: -1 })
    .lean();

  if (!docs || docs.length === 0) {
    return [];
  }

  return plainToInstance(DocumentResponseDto, docs, {
    excludeExtraneousValues: true,
  });
}

// Get documents where user is a viewer
async findDocumentsByViewer(userId: string): Promise<DocumentResponseDto[]> {
  const docs = await this.documentModel
    .find({ 
      viewers: new Types.ObjectId(userId), 
      isDeleted: false 
    })
    .populate('ownerId', 'username email displayName')
    .populate('collaborators', 'username email displayName')
    .populate('viewers', 'username email displayName')
    .sort({ updatedAt: -1 })
    .lean();

  if (!docs || docs.length === 0) {
    return [];
  }

  return plainToInstance(DocumentResponseDto, docs, {
    excludeExtraneousValues: true,
  });
}
async findAllDocuments(
  page: number = 1,
  limit: number = 10,
  search?: string,
  privacy?: string,
  isDeleted?: boolean,
): Promise<{
  data: DocumentResponseDto[];
  total: number;
  page: number;
  limit: number;
}> {
  const query: any = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (privacy) {
    query.privacy = privacy;
  }
  
  if (isDeleted !== undefined) {
    query.isDeleted = isDeleted;
  }
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    this.documentModel
      .find(query)
      .populate('ownerId', 'username email displayName')
      .populate('collaborators', 'username email displayName')
      .populate('viewers', 'username email displayName')
      .populate('documentTypeId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.documentModel.countDocuments(query),
  ]);
  
  const mapped = plainToInstance(DocumentResponseDto, data, {
    excludeExtraneousValues: true,
  });
  
  return { data: mapped, total, page, limit };
}
}