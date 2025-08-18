import { QueryWithHelpers, Types } from 'mongoose';

export function addAuditQueryHelpers(schema) {
  schema.query.byCreator = function (userId: string | Types.ObjectId) {
    return this.find({ createdBy: new Types.ObjectId(userId) });
  };

  schema.query.byUpdater = function (userId: string | Types.ObjectId) {
    return this.find({ updatedBy: new Types.ObjectId(userId) });
  };

  schema.query.createdAfter = function (date: Date) {
    return this.find({ createdAt: { $gte: date } });
  };

  schema.query.updatedAfter = function (date: Date) {
    return this.find({ updatedAt: { $gte: date } });
  };
}
