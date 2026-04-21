import { Controller, Get, Param, Patch, Body, Delete, Post, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CommonResponseDto, ROUTES } from 'src/common';
import { UpdateDocumentDto } from './dto/requests/update-document.dto';
import { DocumentResponseDto } from './dto/response/document-response.dto';
import { DocumentMessages } from 'src/common/messages';
import { CreateDocumentDto } from './dto/requests/create-document.dto';

@ApiTags('Collaborative / Document')
@ApiBearerAuth()
@Controller(ROUTES.COLLABORATIVE.DOCUMENT)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

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
    @Req() req: Request,
  ): Promise<CommonResponseDto<DocumentResponseDto>> {
    const userId = (req as any).user?._id || (req as any).user?.id;

    const dto = await this.documentService.getById(id, userId);

    return CommonResponseDto.ok(
      dto,
      DocumentMessages.success.fetched(dto.title),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document ID' })
  @ApiOkResponse({ description: 'Document updated successfully', type: DocumentResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found', type: CommonResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentDto,
  ): Promise<CommonResponseDto<DocumentResponseDto>> {
    const dto = await this.documentService.updateDocument(id, updateDto);
    return CommonResponseDto.ok(dto, DocumentMessages.success.updated(dto.title));
  }
  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiOkResponse({ description: 'Document created successfully', type: DocumentResponseDto })
  async create(
    @Body() createDto: CreateDocumentDto,
  ): Promise<CommonResponseDto<DocumentResponseDto>> {
    const dto = await this.documentService.createDocument(createDto);
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