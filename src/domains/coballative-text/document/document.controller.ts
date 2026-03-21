import { Controller, Get } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentEntity } from './document.schema';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/base/dtos/common-response.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Get()
  @ApiOkResponse({ type: [DocumentEntity] })
  async getDocuments(): Promise<CommonResponseDto<DocumentEntity[]>> {
    const documents = await this.documentService.findDocuments();
    return CommonResponseDto.ok(documents, 'Documents fetched successfully');
  }
}