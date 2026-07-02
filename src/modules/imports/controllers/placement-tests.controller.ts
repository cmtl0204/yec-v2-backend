import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { excelFileFilter, getFileName } from '@shared/helpers';
import { PlacementTestsService } from '../services/placement-tests.service';

@ApiTags('Imports Enrollments')
@Controller('imports/placement-tests')
export class PlacementTestsController {
  constructor(private readonly enrollmentsService: PlacementTestsService) {}

  @ApiOperation({ summary: 'Import Enrollments' })
  // @Roles(RoleEnum.ADMIN)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'storage/imports'),
        filename: getFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  async importEnrollments(@UploadedFile() file: Express.Multer.File): Promise<ResponseHttpModel> {
    await this.enrollmentsService.importEnrollments(file);

    return {
      data: null,
      message: `Matriculas Importadas Correctamente`,
      title: `Importado`,
    };
  }

  @ApiOperation({ summary: 'Import Enrollments' })
  // @Roles(RoleEnum.ADMIN)
  @Post('validate')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'storage/imports'),
        filename: getFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  async importEnrollmentsValidate(@UploadedFile() file: Express.Multer.File, @Body() payload: any): Promise<ResponseHttpModel> {
    await this.enrollmentsService.importEnrollmentsValidate(file, payload);

    return {
      data: null,
      message: `Matriculas Importadas Correctamente`,
      title: `Importado`,
    };
  }

  @ApiOperation({ summary: 'Import Correction Enrollments' })
  // @Roles(RoleEnum.ADMIN)
  @Post('corrections')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'storage/imports'),
        filename: getFileName,
      }),
      fileFilter: excelFileFilter,
    }),
  )
  async importCorrectionEnrollments(@UploadedFile() file: Express.Multer.File): Promise<ResponseHttpModel> {
    await this.enrollmentsService.importCorrectionEnrollments(file);

    return {
      data: null,
      message: `Matriculas Importadas Correctamente`,
      title: `Importado`,
    };
  }
}
