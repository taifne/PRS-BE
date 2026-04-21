import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DocumentTypeController } from "./document-type.controller";
import { DocumentTypeService } from "./document-type.service";
import { DocumentTypeEntity, DocumentTypeEntitySchema } from "./document-type.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DocumentTypeEntity.name, schema: DocumentTypeEntitySchema },
        ]),
    ],
    controllers: [DocumentTypeController],
    providers: [DocumentTypeService],
    exports: [DocumentTypeService],
})
export class DocumentTypeModule { }