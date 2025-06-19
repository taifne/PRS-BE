
import { RolesList } from 'src/common/types/role';
import { Messages } from 'src/common/message/messages';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/common/base/dto/common-response.dto';
import { Roles } from 'src/domains/auth/decorators/roles.decorator';
import { AuditGuard } from 'src/domains/auth/guards/audit.guard';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/domains/auth/guards/roles.guard';
import { DocumentVersion } from './document-version.schema';
import { DocumentVersionService } from './document.service';
import { ROUTES } from 'src/common/constants/routes.constant';

@ApiTags('Documents / Versions')
@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, AuditGuard)
@Controller(ROUTES.COBALLATIVETEXT.DOCUMENTVERSION)
export class DocumentVersionController {
  constructor(private readonly versionService: DocumentVersionService) { }

  @Post()
  @Roles(RolesList.ADMIN, RolesList.USER)
  @ApiOperation({ summary: 'Create a new document version' })
  async create(
    @Body() createDto: CreateDocumentVersionDto,
  ): Promise<CommonResponseDto<DocumentVersion>> {
    const version = await this.versionService.createVersion(
      createDto.documentId,
      createDto.content,
      createDto.createdBy,
      createDto.note,
    );

    return CommonResponseDto.ok(version, Messages.success.document.versionCreated());
  }
}