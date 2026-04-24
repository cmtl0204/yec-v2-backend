import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { GradesService } from '../services/grades.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { excelFileFilter, getFileName } from '@shared/helpers';
import { EnrollmentsService } from '../services/enrollments.service';

@ApiTags('Imports Enrollments')
@Controller('imports/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

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
  async importEnrollments(@UploadedFile() file: Express.Multer.File, @Body() payload: any): Promise<ResponseHttpModel> {
    await this.enrollmentsService.importEnrollments(file, payload);

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
}


