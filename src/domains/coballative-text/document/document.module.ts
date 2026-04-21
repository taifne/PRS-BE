import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentEntity, DocumentEntitySchema } from './document.schema';
import { Role, RoleSchema } from 'src/core/role/role.schema';
import { DocumentTypeEntity, DocumentTypeEntitySchema } from '../document-type/document-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentEntitySchema },
      { name: Role.name, schema: RoleSchema },
      { name: DocumentTypeEntity.name, schema: DocumentTypeEntitySchema },
    ]),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule { }