import { Schema } from 'mongoose';
import { currentUserId } from './audit.helper';

export function auditPlugin(schema: Schema) {
  schema.set('timestamps', false);

  schema.pre('save', function (next) {
    const userId = currentUserId();
    const now = new Date();

    if (this.isNew) {
      if (userId && !this.get('createdBy')) {
        this.set('createdBy', userId);
      }
      if (!this.get('createdAt')) {
        this.set('createdAt', now);
      }
    }

    if (userId) {
      this.set('updatedBy', userId);
    }
    this.set('updatedAt', now);

    next();
  });

  schema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const userId = currentUserId();
    const now = new Date();

    const update: Record<string, any> = { updatedAt: now };
    if (userId) {
      update.updatedBy = userId;
    }

    this.set(update);
    next();
  });
}
