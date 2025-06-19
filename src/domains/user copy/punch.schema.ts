  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { Document, Types } from 'mongoose';

  export type PunchDocument = Punch & Document;

  @Schema({ timestamps: true }) // Optional if you want createdAt/updatedAt
  export class Punch {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    date: Date; // Only the date part (e.g. 2025-04-10)

    @Prop()
    firstPunchIn: Date;

    @Prop()
    lastPunchOut: Date;
  }

  export const PunchSchema = SchemaFactory.createForClass(Punch);
