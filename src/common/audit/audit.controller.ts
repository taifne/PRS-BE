import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditViewerService } from './audit-viewer.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditViewerService: AuditViewerService) {}

  // GET /audit/recent?limit=20
  @Get('recent')
  async getRecent(@Query('limit') limit = 20) {
    return this.auditViewerService.getRecentLogs(Number(limit));
  }

  // GET /audit/:collection/:id
  @Get(':collection/:id')
  async getLogsForDocument(
    @Param('collection') collection: string,
    @Param('id') documentId: string,
  ) {
    return this.auditViewerService.getLogsForDocument(collection, documentId);
  }
}
