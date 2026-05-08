import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentModule } from './document/document.module';
import { DocumentVersionModule } from './document-version/document-version.module';
import { DocumentCursorModule } from './document-cursor/document-cursor.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { NotificationModule } from './notification/notification.module';
@Module({
    imports: [
        MongooseModule.forFeature([]),
        DocumentModule,
        DocumentVersionModule,
        DocumentCursorModule,
        DocumentTypeModule,
          NotificationModule,
    ],

    exports: [
        DocumentModule,
        DocumentVersionModule,
        DocumentCursorModule,
        DocumentTypeModule,
        NotificationModule

    ],
})
export class CollaborativeModule { }