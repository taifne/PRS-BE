import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { DocumentTypeService } from "./document-type.service";
import { CreateDocumentTypeDto } from "./dto/requests/create-document-type.dto";
import { DocumentTypeResponseDto } from "./dto/response/document-type-response.dto";
import { CommonResponseDto } from "src/common";

@ApiTags('Collaborative / Document Type')
@ApiBearerAuth()
@Controller('document-types')
export class DocumentTypeController {
    constructor(private readonly service: DocumentTypeService) { }

    @Post()
    @ApiOperation({ summary: 'Create document type' })
    @ApiOkResponse({ type: DocumentTypeResponseDto })
    async create(
        @Body() dto: CreateDocumentTypeDto,
    ): Promise<CommonResponseDto<DocumentTypeResponseDto>> {
        const data = await this.service.createDocumentType(dto);
        return CommonResponseDto.ok(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all document types' })
    @ApiOkResponse({ type: [DocumentTypeResponseDto] })
    async findAll(): Promise<CommonResponseDto<DocumentTypeResponseDto[]>> {
        const data = await this.service.getAllDocumentTypes();
        return CommonResponseDto.ok(data);
    }
}