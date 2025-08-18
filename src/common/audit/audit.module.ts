import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditViewerService } from './audit-viewer.service';
import { AuditController } from './audit.controller';
import { AuditLog, AuditLogSchema } from '../schemas/audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [AuditViewerService],
  controllers: [AuditController],  
  exports: [AuditViewerService],
})
export class AuditModule {}
