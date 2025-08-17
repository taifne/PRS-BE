import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocabularyDocument = Vocabulary & Document;

@Schema({ timestamps: true })
export class Vocabulary {
  @Prop({ required: true, unique: true })
  word: string;

  @Prop()
  partOfSpeech?: string;

  @Prop({ type: [String], default: [] })
  definitions: string[];

  @Prop({ type: [String], default: [] })
  examples: string[];

  @Prop({ type: [String], default: [] })
  synonyms: string[];

  @Prop({ type: [String], default: [] })
  antonyms: string[];

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' })
  level: string;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
