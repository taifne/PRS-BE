import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { BaseService } from "src/common";
import { DocumentTypeEntity, DocumentTypeEntityDocument } from "./document-type.schema";
import { CreateDocumentTypeDto } from "./dto/requests/create-document-type.dto";
import { DocumentTypeResponseDto } from "./dto/response/document-type-response.dto";

@Injectable()
export class DocumentTypeService extends BaseService<DocumentTypeEntityDocument> {
    constructor(
        @InjectModel(DocumentTypeEntity.name)
        protected readonly model: Model<DocumentTypeEntityDocument>,
    ) {
        super(model);
    }

    async createDocumentType(dto: CreateDocumentTypeDto): Promise<DocumentTypeResponseDto> {
        const data = await this.create(dto);
        return plainToInstance(DocumentTypeResponseDto, data, { excludeExtraneousValues: true });
    }

    async getAllDocumentTypes(): Promise<DocumentTypeResponseDto[]> {
        const list = await super.findAll(); // use base method
        return plainToInstance(DocumentTypeResponseDto, list, {
            excludeExtraneousValues: true,
        });
    }
}