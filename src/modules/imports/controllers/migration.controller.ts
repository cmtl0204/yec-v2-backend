import {Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {excelFileFilter, getFileName} from '@shared/helpers';
import {MigrationService} from "../services/migration.service";
import {PublicRoute} from "@auth/decorators";

@ApiTags('Imports Migration')
@Controller('imports/migration')
export class MigrationController {
  constructor(private readonly service: MigrationService) {
  }

  @ApiOperation({ summary: 'Import Migration' })
  // @Roles(RoleEnum.ADMIN)
  @PublicRoute()
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
  async import(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: any): Promise<ResponseHttpModel> {
    await this.service.import(file, payload);

    return {
      data: null,
      message: `Matriculas Importadas Correctamente`,
      title: `Importado`,
    };
  }
}
