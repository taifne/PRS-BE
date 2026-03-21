import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentModule } from './document/document.module';
@Module({
    imports: [
        MongooseModule.forFeature([]),
        DocumentModule,
    ],

    exports: [
        DocumentModule,

    ],
})
export class CollaborativeModule { }