// src/punch/dto/create-punch.dto.ts
import { IsDate, IsOptional } from 'class-validator';

export class CreatePunchDto {
  @IsDate()
  date: Date;

  @IsOptional()
  @IsDate()
  firstPunchIn?: Date;

  @IsOptional()
  @IsDate()
  lastPunchOut?: Date;
}
