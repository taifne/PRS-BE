import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { BaseEntity, BaseEntitySchema } from "src/common/base/schemas/base-entity.schema";
import { auditLogPlugin } from "src/common/audit/audit-log.plugin";

export type DocumentTypeEntityDocument = DocumentTypeEntity & BaseEntity & Document;

@Schema({ timestamps: true })
export class DocumentTypeEntity extends BaseEntity {
    @ApiProperty()
    @Prop({ required: true })
    name: string;

    @ApiProperty()
    @Prop({ default: '' })
    description: string;

    @ApiProperty()
    @Prop({ default: false })
    isDeleted: boolean;
}

export const DocumentTypeEntitySchema = SchemaFactory.createForClass(DocumentTypeEntity);
DocumentTypeEntitySchema.add(BaseEntitySchema);
DocumentTypeEntitySchema.plugin(auditLogPlugin, { collection: 'document-types' });