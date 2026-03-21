import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsUrl,
  IsEnum,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

class ExperienceDto {
  @IsString()
  company: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  location?: string;

  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[];
}

class EducationDto {
  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  location?: string;

  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  gpa?: string;
}

class PersonalProjectDto {
  @IsString()
  persionalProjectName: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];
}

class CertificationDto {
  @IsString()
  cerName: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @Type(() => Date)
  date?: Date;
}

class LanguageDto {
  @IsString()
  langueName: string;

  @IsOptional()
  @IsString()
  level?: string;
}

class VolunteerWorkDto {
  @IsString()
  org: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}

class LinkDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsUrl()
  url: string;
}

class ReferenceDto {
  @IsString()
  referName: string;

  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  relationship?: string;
}

export class CreateResumeDto {
  @IsString()
  title: string;

  @IsString()
  template: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  yearBorn?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  desiredPosition?: string;

  @IsOptional()
  @IsString()
  desiredSalary?: string;

  @IsOptional()
  @Type(() => Date)
  availableFrom?: Date;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  @IsOptional()
  experience?: ExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  @IsOptional()
  education?: EducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalProjectDto)
  @IsOptional()
  personalProjects?: PersonalProjectDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  @IsOptional()
  certifications?: CertificationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @IsOptional()
  languages?: LanguageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VolunteerWorkDto)
  @IsOptional()
  volunteerWork?: VolunteerWorkDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  @IsOptional()
  links?: LinkDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDto)
  @IsOptional()
  references?: ReferenceDto[];

  @IsOptional()
  @IsEnum(['private', 'public', 'linkOnly'])
  visibility?: 'private' | 'public' | 'linkOnly';

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  generatedText?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {}
