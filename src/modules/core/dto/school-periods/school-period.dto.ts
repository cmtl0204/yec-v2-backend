import {CatalogueEntity, InstitutionEntity} from '@core/entities';
import { IsString, IsOptional, IsNotEmpty, IsDate, IsBoolean } from 'class-validator';
import { isBooleanValidationOptions, isDateValidationOptions, isNotEmptyValidationOptions, isStringValidationOptions } from '@shared/validation';

export class SchoolPeriodDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly state: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly code: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly codeSniese: string;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly isVisible: boolean;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsString(isStringValidationOptions())
  readonly shortName: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly startedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly endedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly ordinaryStartedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly ordinaryEndedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly extraOrdinaryStartedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly extraOrdinaryEndedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly especialStartedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsDate(isDateValidationOptions())
  readonly especialEndedAt: Date;
}
