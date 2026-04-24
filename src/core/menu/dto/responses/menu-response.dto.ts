import { Expose, Transform } from 'class-transformer';

export class MenuResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly label: string;

  @Expose()
  readonly description?: string;

  @Expose()
  readonly icon?: string;

  @Expose()
  readonly path?: string;

  @Expose()
  readonly externalUrl?: string;

  @Expose()
  readonly type?: string;

  @Expose()
  @Transform(({ value }) => value ? value.toString() : null)
  readonly parent?: string | null;

  @Expose()
  readonly order?: number;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly hidden: boolean;

  @Expose()
  readonly roles?: string[];

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}