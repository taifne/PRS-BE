import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

import { ROUTES, CommonResponseDto } from 'src/common';
import { DocumentCursorService } from './document-cursor.service';
import { CreateDocumentCursorDto } from './dto/request/create-document-cursor.dto';
import { GetDocumentCursorDto } from './dto/request/get-document-cursor.dto';
import { DocumentCursorResponseDto } from './dto/response/document-cursor.response.dto';

@ApiTags('Collaborative / Document Cursors')
@ApiBearerAuth()
@Controller(ROUTES.COLLABORATIVE.DOCUMENT_CURSOR)
export class DocumentCursorController {
  constructor(private readonly cursorService: DocumentCursorService) { }

  /**
   * Get all cursors (with optional filters)
   */
  @Get()
  @ApiOperation({ summary: 'Get all document cursors' })
  @ApiOkResponse({
    description: 'Cursors fetched successfully',
    type: [DocumentCursorResponseDto],
  })
  async findAll(
    @Query() query: GetDocumentCursorDto,
  ): Promise<CommonResponseDto<DocumentCursorResponseDto[]>> {
    const cursors = await this.cursorService.findCursors(query);
    return CommonResponseDto.ok(
      cursors,
      `Fetched ${cursors.length} cursor(s) successfully`,
    );
  }

  /**
   * Get one cursor by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a document cursor by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Cursor ID' })
  @ApiOkResponse({
    description: 'Cursor fetched successfully',
    type: DocumentCursorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Document cursor not found',
    type: CommonResponseDto,
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<DocumentCursorResponseDto>> {
    const cursor = await this.cursorService.findOneById(id);
    return CommonResponseDto.ok(cursor, 'Cursor fetched successfully');
  }

  /**
   * Create cursor
   */
  @Post()
  @ApiOperation({ summary: 'Create or get document cursor' })
  @ApiOkResponse({
    description: 'Cursor created successfully',
    type: DocumentCursorResponseDto,
  })
  async create(
    @Body() dto: CreateDocumentCursorDto,
  ): Promise<CommonResponseDto<DocumentCursorResponseDto>> {
    const cursor = await this.cursorService.createCursor(dto);
    return CommonResponseDto.ok(cursor, 'Cursor created successfully');
  }

  /**
   * Delete cursor
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document cursor by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Cursor ID' })
  @ApiOkResponse({
    description: 'Cursor deleted successfully',
    type: CommonResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Document cursor not found',
    type: CommonResponseDto,
  })
  async delete(
    @Param('id') id: string,
  ): Promise<CommonResponseDto<null>> {
    await this.cursorService.deleteCursor(id);
    return CommonResponseDto.ok(null, 'Cursor deleted successfully');
  }
}