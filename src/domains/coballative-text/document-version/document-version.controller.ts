import { Controller, Get, Param, Patch, Body, Delete, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import { ROUTES, CommonResponseDto } from 'src/common';
import { DocumentVersionService } from './document-verision.service';
import { CreateDocumentVersionDto } from './dto/request/create-document-version.dto';
import { DocumentVersionResponseDto } from './dto/response/resonse-document-version.dto';
import { DocumentVersionMessages } from 'src/common/messages/document-version.message';

@ApiTags('Collaborative / Document Versions')
@ApiBearerAuth()
@Controller(ROUTES.COLLABORATIVE.DOCUMENT_VERSION)
export class DocumentVersionController {
  constructor(private readonly versionService: DocumentVersionService) { }

  @Get('document/:documentId')
  @ApiOperation({ summary: 'Get all versions for a specific document' })
  @ApiParam({ name: 'documentId', type: String, description: 'Document ID' })
  @ApiOkResponse({ description: 'Versions fetched successfully', type: [DocumentVersionResponseDto] })
  async findAllByDocument(
    @Param('documentId') documentId: string,
  ): Promise<CommonResponseDto<DocumentVersionResponseDto[]>> {
    const versions = await this.versionService.findByDocumentId(documentId);
    const message = DocumentVersionMessages.success.listFetched(versions.length);
    return CommonResponseDto.ok(versions, message);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific document version by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document Version ID' })
  @ApiOkResponse({ description: 'Version fetched successfully', type: DocumentVersionResponseDto })
  @ApiNotFoundResponse({ description: 'Document version not found', type: CommonResponseDto })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<DocumentVersionResponseDto>> {
    const version = await this.versionService.findOneById(id);
    return CommonResponseDto.ok(version, DocumentVersionMessages.success.fetched(version.versionNumber.toString()));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new document version' })
  @ApiOkResponse({ description: 'Document version created successfully', type: DocumentVersionResponseDto })
  async create(
    @Body() createDto: CreateDocumentVersionDto,
  ): Promise<CommonResponseDto<DocumentVersionResponseDto>> {
    const version = await this.versionService.createVersion(createDto);
    return CommonResponseDto.ok(version, DocumentVersionMessages.success.created());
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a document version by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document Version ID' })
  @ApiOkResponse({ description: 'Version deleted successfully', type: CommonResponseDto })
  @ApiNotFoundResponse({ description: 'Document version not found', type: CommonResponseDto })
  async delete(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<null>> {
    await this.versionService.deleteVersion(id);
    return CommonResponseDto.ok(null, DocumentVersionMessages.success.deleted(1));
  }

  @Patch('restore/:id')
  @ApiOperation({ summary: 'Restore a soft-deleted document version by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document Version ID' })
  @ApiOkResponse({ description: 'Version restored successfully', type: DocumentVersionResponseDto })
  @ApiNotFoundResponse({ description: 'Document version not found', type: CommonResponseDto })
  async restore(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<DocumentVersionResponseDto>> {
    const version = await this.versionService.restoreVersion(id);
    return CommonResponseDto.ok(version, DocumentVersionMessages.success.updated());
  }
}