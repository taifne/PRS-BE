import { AuditLogDocument } from '../schemas/audit-log.schema';
import { currentUserId, currentUsername } from './audit.helper';
import { Schema, Model } from 'mongoose';

export function auditLogPlugin(schema: Schema, options?: { collection?: string }) {
  const collection =
    options?.collection || schema.get('collection') || 'unknown';

  schema.post('save', async function (doc) {
    
const AuditLogModel = (doc.constructor as Model<any>).db.model('AuditLog');
    const userId = currentUserId();
    const username = currentUsername();
    await AuditLogModel.create({
      userId,
      username,
      collection,
      documentId: doc._id,
      action: doc.isNew ? 'create' : 'update',
      after: doc.toObject(),
    });
  });

  schema.post('findOneAndUpdate', async function (res) {
    if (!res) return;
    const AuditLogModel = res.constructor.db.model('AuditLog') as Model<AuditLogDocument>;
    const userId = currentUserId();
    const username = currentUsername();

    await AuditLogModel.create({
      userId,
      username,
      collection,
      documentId: res._id,
      action: 'update',
      after: res.toObject(),
    });
  });

  schema.post('findOneAndDelete', async function (res) {
    if (!res) return;
    const AuditLogModel = res.constructor.db.model('AuditLog') as Model<AuditLogDocument>;
    const userId = currentUserId();
    const username = currentUsername();

    await AuditLogModel.create({
      userId,
      username,
      collection,
      documentId: res._id,
      action: 'delete',
      before: res.toObject(),
    });
  });
}
