import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CareerEntity,
  CatalogueEntity,
  EnrollmentDetailEntity,
  EnrollmentEntity,
  InstitutionEntity, PartialEntity,
  PartialPermissionEntity, SchoolPeriodEntity,
  StudentEntity, SubjectEntity,
  TeacherDistributionEntity, TeacherEntity,
} from '@core/entities';
import { AuthRepositoryEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { RoleEnum } from '@auth/enums';
import { RoleEntity, UserEntity } from '@auth/entities';
import { RolesService } from '@auth/services';
import { CareersService, CataloguesService, InstitutionsService } from '@core/services';
import * as Bcrypt from 'bcrypt';

enum ColumnsEnum {
  CAREER_CODE = 'Codigo_Carrera',
  IDENTIFICATION = 'Cedula_Docente',
  PARALLEL_CODE = 'Codigo_Paralelo',
  SCHOOL_PERIOD_CODE = 'Codigo_Periodo',
  ACADEMIC_PERIOD_CODE = 'Semestre',
  SUBJECT_CODE = 'Codigo_Asignatura',
  WORKDAY_CODE = 'Horario',
}

interface ErrorModel {
  row: number;
  column: string;
  observation: string;
}

@Injectable()
export class TeacherDistributionsService {
  private errors: ErrorModel[] = [];
  private attendanceErrors: ErrorModel[] = [];
  private row = 1;
  private parallels: CatalogueEntity[] = [];
  private workdays: CatalogueEntity[] = [];
  private subjects: SubjectEntity[] = [];
  private academicPeriods: CatalogueEntity[] = [];
  private schoolPeriods: SchoolPeriodEntity[] = [];
  private partials: PartialEntity[] = [];
  private institutions: InstitutionEntity[] = [];
  private careers: CareerEntity[] = [];

  constructor(
    private readonly careersService: CareersService,
    private readonly rolesService: RolesService,
    private readonly cataloguesService: CataloguesService,
    private readonly institutionsService: InstitutionsService,
    @Inject(CoreRepositoryEnum.CATALOGUE_REPOSITORY) private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_REPOSITORY) private readonly teacherRepository: Repository<TeacherEntity>,
    @Inject(CoreRepositoryEnum.SCHOOL_PERIOD_REPOSITORY) private readonly schoolPeriodRepository: Repository<SchoolPeriodEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY) private readonly enrollmentDetailRepository: Repository<EnrollmentDetailEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_DISTRIBUTION_REPOSITORY) private readonly teacherDistributionRepository: Repository<TeacherDistributionEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_PERMISSION_REPOSITORY) private readonly partialPermissionRepository: Repository<PartialPermissionEntity>,
    @Inject(CoreRepositoryEnum.SUBJECT_REPOSITORY) private readonly subjectRepository: Repository<SubjectEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_REPOSITORY) private readonly partialRepository: Repository<PartialEntity>,
  ) {
  }

  async loadCareers() {
    this.careers = (await this.careersService.findCareersByInstitution(this.institutions[0].id)).data;
  }

  async loadSubjects() {
    this.subjects = await this.subjectRepository.find();
  }

  async loadSchoolPeriods() {
    this.schoolPeriods = await this.schoolPeriodRepository.find();
  }

  async loadPartials() {
    this.partials = await this.partialRepository.find();
  }

  async loadInstitutions() {
    this.institutions = (await this.institutionsService.findAll()).data;
  }

  async loadCatalogues() {
    const catalogues = (await this.cataloguesService.findAll()).data as CatalogueEntity[];

    this.parallels = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.PARALLEL);
    this.workdays = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
    this.academicPeriods = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ACADEMIC_PERIOD);
  }

  async import(file: Express.Multer.File, payload: any) {
    try {
      const path = join(process.cwd(), 'storage/imports', file.filename);
      const workbook = XLSX.readFile(path);
      const workbookSheets = workbook.SheetNames;


      const sheet = workbookSheets[0];
      const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);



      // await this.loadCareers();
      await this.loadSubjects();
      await this.loadSchoolPeriods();
      await this.loadPartials();
      await this.loadCatalogues();

      this.row = 1;
      this.errors = [];

      for (const item of dataExcel) {
        this.row++;
        await this.checkErrors(item);
      }

      if (this.errors.length > 0) {
        fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));
        await this.generateErrorReport();
        throw new BadRequestException();
      }

      this.row = 1;
      let totalNewTeacherDistribution = 0;
      let totalExitsTeacherDistribution = 0;

      for (const item of dataExcel) {
        this.row++;
        const parallel = this.parallels.find(parallel => parallel.code.toLowerCase() === item[ColumnsEnum.PARALLEL_CODE].trim().toLowerCase());
        const schoolPeriod = this.schoolPeriods.find(schoolPeriod => schoolPeriod.code.toLowerCase() === item[ColumnsEnum.SCHOOL_PERIOD_CODE].trim().toLowerCase());
        const academicPeriod = this.academicPeriods.find(academicPeriod => academicPeriod.code === item[ColumnsEnum.ACADEMIC_PERIOD_CODE].toString().trim());
        const subject = this.subjects.find(subject => subject.code.toLowerCase() === item[ColumnsEnum.SUBJECT_CODE].trim().toLowerCase());
        const workday = this.workdays.find(workday => workday.code.toLowerCase() === item[ColumnsEnum.WORKDAY_CODE].trim().toLowerCase());
        const user = await this.userRepository.findOne({
          relations: { teacher: true },
          where: { identification: item[ColumnsEnum.IDENTIFICATION].toString().trim() },
        });

        if (!user.teacher){
          const teacher = this.teacherRepository.create();
          teacher.userId = user.id;
          user.teacher = await this.teacherRepository.save(teacher);
        }

        let teacherDistribution = await this.teacherDistributionRepository.findOne({
          where: {
            subjectId: subject.id,
            workdayId: workday.id,
            parallelId: parallel.id,
            teacherId: user.teacher.id,
            schoolPeriodId: schoolPeriod.id,
          },
        });

        if (teacherDistribution) {
          totalExitsTeacherDistribution++;
        }

        if (!teacherDistribution) {
          teacherDistribution = this.teacherDistributionRepository.create();
          teacherDistribution.parallelId = parallel.id;
          teacherDistribution.schoolPeriodId = schoolPeriod.id;
          teacherDistribution.subjectId = subject.id;
          teacherDistribution.teacherId = user.teacher.id;
          teacherDistribution.workdayId = workday.id;

          await this.teacherDistributionRepository.save(teacherDistribution);
          totalNewTeacherDistribution++;
        }

        for (const partial of this.partials) {
          let partialPermission = await this.partialPermissionRepository.findOne({
            where: {
              teacherDistributionId: teacherDistribution.id,
              partialId: partial.id,
            },
          });

          if (!partialPermission) {
            partialPermission = this.partialPermissionRepository.create();
            partialPermission.teacherDistributionId = teacherDistribution.id;
            partialPermission.partialId = partial.id;
            partialPermission.enabled = true;

            await this.partialPermissionRepository.save(partialPermission);
          }
        }
      }

      fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));
      return{
        totalNewTeacherDistribution,
        totalExitsTeacherDistribution,
        totalTeacherDistribution: totalNewTeacherDistribution + totalExitsTeacherDistribution
      }
    } catch (err) {
      throw new BadRequestException('Problemas al subir el archivo, por favor verifique los errores');
    }
  }

  async checkErrors(item: any) {
    const parallel = this.parallels.find(parallel => parallel.code.toLowerCase() === item[ColumnsEnum.PARALLEL_CODE].trim().toLowerCase());
    const schoolPeriod = this.schoolPeriods.find(schoolPeriod => schoolPeriod.code.toLowerCase() === item[ColumnsEnum.SCHOOL_PERIOD_CODE].trim().toLowerCase());
    const academicPeriod = this.academicPeriods.find(academicPeriod => academicPeriod.code === item[ColumnsEnum.ACADEMIC_PERIOD_CODE].toString().trim());
    const subject = this.subjects.find(subject => subject.code.toLowerCase() === item[ColumnsEnum.SUBJECT_CODE].trim().toLowerCase());
    const workday = this.workdays.find(workday => workday.code.toLowerCase() === item[ColumnsEnum.WORKDAY_CODE].trim().toLowerCase());
    const user = await this.userRepository.findOne({
      relations: { teacher: true },
      where: { identification: item[ColumnsEnum.IDENTIFICATION].toString().trim() },
    });
    //console.log(item[ColumnsEnum.IDENTIFICATION].toString().trim());
    //console.log(!user);
    //console.log(!user?.teacher);


    if (!parallel) {
      this.errors.push({
        row: this.row,
        column: ColumnsEnum.PARALLEL_CODE,
        observation: `${ColumnsEnum.PARALLEL_CODE} no válido`,
      });
    }

    if (!schoolPeriod) {
      this.errors.push({
        row: this.row,
        column: ColumnsEnum.SCHOOL_PERIOD_CODE,
        observation: `${ColumnsEnum.SCHOOL_PERIOD_CODE} no válido`,
      });
    }

    // if (!academicPeriod) {
    //   this.errors.push({
    //     row: this.row,
    //     column: ColumnsEnum.ACADEMIC_PERIOD_CODE,
    //     observation: `${ColumnsEnum.ACADEMIC_PERIOD_CODE} no válido`,
    //   });
    // }

    if (!subject) {
      this.errors.push({
        row: this.row,
        column: ColumnsEnum.SUBJECT_CODE,
        observation: `${ColumnsEnum.SUBJECT_CODE} no válido`,
      });
    }

    if (!workday) {
      this.errors.push({
        row: this.row,
        column: ColumnsEnum.WORKDAY_CODE,
        observation: `${ColumnsEnum.WORKDAY_CODE} no válido`,
      });
    }

    if (!user) {
      this.errors.push({
        row: this.row,
        column: ColumnsEnum.IDENTIFICATION,
        observation: `${ColumnsEnum.IDENTIFICATION} Usuario no existe o no valido`,
      });
    }

    if (user && !user?.teacher) {
      this.errors.push({
        row: this.row,
        column: ColumnsEnum.IDENTIFICATION,
        observation: `${ColumnsEnum.IDENTIFICATION} Docente no válido`,
      });
    }
  }

  async generateErrorReport() {
    const errors = this.errors.concat(this.attendanceErrors);

    const data = errors.map(error => {
      return {
        'Fila': error.row,
        'Columna': error.column,
        'Observación': error.observation,
      };
    });

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Errores');
    const path = join(process.cwd(), 'storage/reports/teacher-distributions', new Date().getTime() + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }
}
