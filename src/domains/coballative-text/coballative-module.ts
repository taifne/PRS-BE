import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentModule } from './document/document.module';
import { DocumentVersionModule } from './document-version/document-version.module';
import { DocumentCursorModule } from './document-cursor/document-cursor.module';
@Module({
    imports: [
        MongooseModule.forFeature([]),
        DocumentModule,
        DocumentVersionModule,
        DocumentCursorModule
    ],

    exports: [
        DocumentModule,
        DocumentVersionModule,
        DocumentCursorModule

    ],
})
export class CollaborativeModule { }