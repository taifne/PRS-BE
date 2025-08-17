import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResumeDocument = Resume & Document;

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string; // e.g. "Frontend Dev Resume"

  @Prop({ required: true })
  template: string; // template ID or name

  @Prop({ required: true })
  fullName: string; // full name

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  yearBorn: number;

  @Prop()
  address: string;

  @Prop()
  avatarUrl: string; // URL to profile picture

  @Prop()
  linkedinUrl: string;

  @Prop()
  githubUrl: string;

  @Prop()
  website: string;

  @Prop()
  desiredPosition: string;

  @Prop()
  desiredSalary: string; // could be string or number depending on your logic

  @Prop()
  availableFrom: Date;

  @Prop()
  summary: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({
    type: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
        achievements: { type: [String], default: [] },
      },
    ],
    default: [],
  })
  experience: {
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
    achievements: string[];
  }[];

  @Prop({
    type: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
        gpa: { type: String },
      },
    ],
    default: [],
  })
  education: {
    institution: string;
    degree: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
    gpa?: string;
  }[];

  @Prop({
    type: [
      {
        persionalProjectName: { type: String, required: true },
        domain: { type: String },
        description: { type: String },
        technologies: { type: [String], default: [] },
        time: { type: String },
        teamSize: { type: Number },
        responsibilities: { type: [String], default: [] },
      },
    ],
    default: [],
  })
  personalProjects: {
    persionalProjectName: string;
    domain?: string;
    description?: string;
    technologies: string[];
    time?: string;
    teamSize?: number;
    responsibilities: string[];
  }[];

  @Prop({
    type: [
      {
        cerName: { type: String, required: true },
        issuer: { type: String },
        date: { type: Date },
      },
    ],
    default: [],
  })
  certifications: {
    cerName: string;
    issuer?: string;
    date?: Date;
  }[];

  @Prop({
    type: [
      {
        langueName: { type: String, required: true },
        level: { type: String }, // e.g. "Fluent"
      },
    ],
    default: [],
  })
  languages: {
    langueName: string;
    level?: string;
  }[];

  @Prop({
    type: [
      {
        org: { type: String, required: true },
        role: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    default: [],
  })
  volunteerWork: {
    org: string;
    role?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }[];

  @Prop({
    type: [
      {
        label: { type: String },
        url: { type: String, required: true },
      },
    ],
    default: [],
  })
  links: {
    label?: string;
    url: string;
  }[];

  @Prop({
    type: [
      {
        referName: { type: String, required: true },
        contact: { type: String, required: true },
        relationship: { type: String },
      },
    ],
    default: [],
  })
  references: {
    referName: string;
    contact: string;
    relationship?: string;
  }[];

  @Prop({ type: String, enum: ['private', 'public', 'linkOnly'], default: 'private' })
  visibility: 'private' | 'public' | 'linkOnly';

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop()
  generatedText: string;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
