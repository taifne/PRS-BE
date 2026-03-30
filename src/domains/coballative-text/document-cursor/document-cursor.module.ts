import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/core/role/role.schema';

import { DocumentCursorService } from './document-cursor.service';
import { DocumentCursorController } from './document-cursor.controller';
import {
  DocumentCursor,
  DocumentCursorSchema,
} from './document-cursor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentCursor.name, schema: DocumentCursorSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [DocumentCursorService],
  controllers: [DocumentCursorController],
  exports: [DocumentCursorService],
})
export class DocumentCursorModule { }