import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from '../document/document.controller';
import { DocumentEntity, DocumentEntitySchema } from '../document/document.schema';
import { DocumentService } from '../document/document.service';
import { Role, RoleSchema } from 'src/core/role/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentEntitySchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule { }