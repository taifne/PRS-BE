import { Controller, Get, Param, Patch, Body, Delete, Post, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CommonResponseDto, ROUTES } from 'src/common';
import { UpdateDocumentDto } from './dto/requests/update-document.dto';
import { DocumentResponseDto } from './dto/response/document-response.dto';
import { DocumentMessages } from 'src/common/messages';
import { CreateDocumentDto } from './dto/requests/create-document.dto';
import { SearchDocumentDto } from './dto/requests/search-document.dto';

@ApiTags('Collaborative / Document')
@ApiBearerAuth()
@Controller(ROUTES.COLLABORATIVE.DOCUMENT)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Get('search')
  @ApiOperation({ summary: 'Search documents' })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'privacy', required: false, enum: ['public', 'private'] })
  @ApiQuery({ name: 'documentTypeId', required: false, type: String })
  @ApiQuery({ name: 'collaboratorId', required: false, type: String })
  @ApiQuery({ name: 'viewerId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ description: 'Documents fetched successfully' })
  async searchDocuments(
    @Query() filters: SearchDocumentDto,
  ): Promise<CommonResponseDto<DocumentResponseDto[]>> {
    const { data, page, limit, total } = await this.documentService.searchDocuments(filters);
    const message = DocumentMessages.success.listFetched(data.length);
    return CommonResponseDto.ok(data, message, { page, limit, total });
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get all documents by owner ID' })
  @ApiParam({ name: 'ownerId', type: String, description: 'Owner User ID' })
  @ApiOkResponse({ description: 'Documents fetched successfully', type: [DocumentResponseDto] })
  async findAllByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<CommonResponseDto<DocumentResponseDto[]>> {
    const dtos = await this.documentService.findAllByOwner(ownerId);
    const message = DocumentMessages.success.listFetched(dtos.length);
    return CommonResponseDto.ok(dtos, message);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID' })
  @ApiOkResponse({ description: 'Document fetched successfully', type: DocumentResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found', type: CommonResponseDto })
  async findOne(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<CommonResponseDto<DocumentResponseDto>> {
    const userId = req.user?._id || req.user?.id;
    const dto = await this.documentService.getById(id, userId);
    return CommonResponseDto.ok(dto, DocumentMessages.success.fetched(dto.title));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID' })
  @ApiOkResponse({ description: 'Document updated successfully', type: DocumentResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found', type: CommonResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentDto,
    @Req() req: any,
  ): Promise<CommonResponseDto<DocumentResponseDto>> {
    const userId = req.user?._id || req.user?.id;
    const userName = req.user?.displayName || req.user?.username || 'Someone';
    const dto = await this.documentService.updateDocument(id, updateDto, userId, userName);
    return CommonResponseDto.ok(dto, DocumentMessages.success.updated(dto.title));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiOkResponse({ description: 'Document created successfully', type: DocumentResponseDto })
  async create(
    @Body() createDto: CreateDocumentDto,
    @Req() req: any,
  ): Promise<CommonResponseDto<DocumentResponseDto>> {
    const userId = req.user?._id || req.user?.id;
    const userName = req.user?.displayName || req.user?.username || 'Someone';
    const dto = await this.documentService.createDocument(createDto, userId, userName);
    return CommonResponseDto.ok(dto, DocumentMessages.success.created(dto.title));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID' })
  @ApiOkResponse({ description: 'Document deleted successfully', type: CommonResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found', type: CommonResponseDto })
  async delete(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<null>> {
    await this.documentService.softDeleteDocument(id);
    return CommonResponseDto.ok(null, DocumentMessages.success.deleted(1));
  }
}