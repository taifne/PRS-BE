
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditGuard } from 'src/core/auth/guards/audit.guard';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { DocumentVersionService } from './document.service';
import { ROUTES } from 'src/common/constants/routes.constant';

@ApiTags('Documents / Versions')
@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, AuditGuard)
@Controller(ROUTES.COLLABORATIVE.DOCUMENTVERSION)
export class DocumentVersionController {
  constructor(private readonly versionService: DocumentVersionService) { }
}