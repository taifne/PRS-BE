import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/core/role/role.schema';

import { DocumentVersionService } from './document-verision.service';
import { DocumentVersionController } from './document-version.controller';
import { DocumentVersion, DocumentVersionSchema } from './document-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentVersion.name, schema: DocumentVersionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [DocumentVersionService],
  controllers: [DocumentVersionController],
  exports: [DocumentVersionService],
})
export class DocumentVersionModule { }