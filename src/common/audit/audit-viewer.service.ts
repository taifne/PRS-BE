import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AuditLog, AuditLogDocument } from '../schemas/audit-log.schema';
@Injectable()
export class AuditViewerService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}
  async getLogsForDocument(collection: string, documentId: string) {
    return this.auditLogModel
      .find({ collection, documentId })
      .sort({ createdAt: -1 })
      .exec();
  }
  async getRecentLogs(limit = 20) {
    return this.auditLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
