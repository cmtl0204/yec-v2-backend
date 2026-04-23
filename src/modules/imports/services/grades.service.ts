import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import {
  CatalogueEntity,
  EnrollmentDetailEntity,
  EnrollmentEntity,
  GradeEntity,
  PartialEntity,
  PartialPermissionEntity,
  StudentEntity,
  TeacherDistributionEntity,
} from '@core/entities';
import { CatalogueEnrollmentStateEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { CataloguesService } from '@core/services';

enum ColumnsEnum {
  IDENTIFICATION = 'Identificacion',
  GRADE_1 = 'Parcial1',
  GRADE_2 = 'Parcial2',
  ATTENDANCE = 'Asistencia',
}

interface ErrorModel {
  row: number;
  column: string;
  value: string | number | null;
  observation: string;
}

@Injectable()
export class GradesService {
  private gradeErrors: ErrorModel[] = [];
  private attendanceErrors: ErrorModel[] = [];
  private partialPermissionErrors: ErrorModel[] = [];
  private row = 1;
  private partialEnabled1 = false;
  private partialEnabled2 = false;
  private partials: PartialEntity[] = [];
  private partial1!: PartialEntity;
  private partial2!: PartialEntity;
  private approved!: CatalogueEntity;
  private failed!: CatalogueEntity;

  constructor(
    private readonly cataloguesService: CataloguesService,
    @Inject(CoreRepositoryEnum.CATALOGUE_REPOSITORY) private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.GRADE_REPOSITORY) private readonly gradeRepository: Repository<GradeEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_REPOSITORY) private readonly partialRepository: Repository<PartialEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_PERMISSION_REPOSITORY) private readonly partialPermissionRepository: Repository<PartialPermissionEntity>,
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly studentRepository: Repository<StudentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY) private readonly enrollmentDetailRepository: Repository<EnrollmentDetailEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_DISTRIBUTION_REPOSITORY) private readonly teacherDistributionRepository: Repository<TeacherDistributionEntity>,
  ) {}

  async loadAcademicStates() {
    const academicStates = await this.catalogueRepository.find({ where: { type: CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE } });
    this.approved = academicStates.find(academicState => academicState.code === 'a');
    this.failed = academicStates.find(academicState => academicState.code === 'r');
  }

  async loadPartials() {
    this.partials = await this.partialRepository.find({
      where: { code: In(['1', '2']) },
    });
    this.partial1 = this.partials.find(partial => partial.code === '1');
    this.partial2 = this.partials.find(partial => partial.code === '2');
  }

  async loadPartialPermissions(teacherDistributionId: string) {
    const partialPermissions = await this.partialPermissionRepository.find({ where: { teacherDistributionId } });

    for (const partialPermission of partialPermissions) {
      if (partialPermission.partialId === this.partial1.id) {
        this.partialEnabled1 = partialPermission.enabled;
      }

      if (partialPermission.partialId === this.partial2.id) {
        this.partialEnabled2 = partialPermission.enabled;
      }
    }
  }

  async importGrades(file: Express.Multer.File, payload: any) {
    this.gradeErrors = [];
    this.attendanceErrors = [];
    this.partialPermissionErrors = [];
    this.row = 1;

    const path = join(process.cwd(), 'storage/imports', file.filename);

    const workbook = XLSX.readFile(path);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    const teacherDistribution = await this.teacherDistributionRepository.findOneBy({ id: payload.teacherDistributionId });

    await this.loadAcademicStates();
    await this.loadPartials();
    await this.loadPartialPermissions(teacherDistribution.id);

    const catalogues = await this.cataloguesService.findCache();
    const enrollmentStateEnrolled = catalogues.find(
      catalogue => catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE,
    );

    for (const item of dataExcel) {
      this.row++;

      let identification = item[ColumnsEnum.IDENTIFICATION];

      if (identification) identification = identification.toString().trim();

      const student = await this.studentRepository.findOne({
        where: { user: { identification: identification } },
      });

      this.checkErrors(item);

      if (!student) {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.IDENTIFICATION,
          value: item[ColumnsEnum.IDENTIFICATION],
          observation: `La cédula del estudiante no existe`,
        });

        continue;
      }

      const enrollment = await this.enrollmentRepository.findOne({
        where: {
          studentId: student.id,
          schoolPeriodId: teacherDistribution.schoolPeriodId,
          careerId: payload.careerId,
          enrollmentState: { stateId: enrollmentStateEnrolled.id },
        },
      });

      if (enrollment) {
        const enrollmentDetail = await this.enrollmentDetailRepository.findOne({
          where: {
            enrollmentId: enrollment.id,
            subjectId: teacherDistribution.subjectId,
            enrollmentDetailState: { stateId: enrollmentStateEnrolled.id },
          },
        });

        if (enrollment && enrollmentDetail) {
          await this.saveGrades(item, enrollmentDetail);

          await this.saveAttendance(item, enrollmentDetail);

          await this.saveAcademicState(enrollmentDetail);
        } else {
          this.attendanceErrors.push({
            row: this.row,
            column: ColumnsEnum.IDENTIFICATION,
            value: item[ColumnsEnum.IDENTIFICATION],
            observation: `El estudiante no se encuentra matriculado en la asignatura`,
          });
        }
      } else {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.IDENTIFICATION,
          value: item[ColumnsEnum.IDENTIFICATION],
          observation: `El estudiante no se encuentra matriculado`,
        });
      }
    }

    await this.generateErrorReport(teacherDistribution.id);

    fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));

    if (this.gradeErrors.concat(this.attendanceErrors, this.partialPermissionErrors).length > 0)
      throw new BadRequestException({
        message: 'Por favor descargue el informe de errores',
        error: 'Error al cargar el archivo',
      });
  }

  checkErrors(item: any) {
    this.validateGrade(item[ColumnsEnum.GRADE_1], ColumnsEnum.GRADE_1);
    this.validateGrade(item[ColumnsEnum.GRADE_2], ColumnsEnum.GRADE_2);
    this.validateAttendance(item[ColumnsEnum.ATTENDANCE]);
  }

  validateGrade(value: number, column: string) {
    if (value || value == 0) {
      if (isNaN(value)) {
        this.gradeErrors.push({
          row: this.row,
          column,
          value: value,
          observation: `${column} no válida`,
        });

        return;
      }

      const grade = Number(value);

      if (grade < 0) {
        this.gradeErrors.push({
          row: this.row,
          column,
          value: value,
          observation: `${column} no puede ser menor a 0`,
        });
      }

      if (grade > 10) {
        this.gradeErrors.push({
          row: this.row,
          column,
          value: value,
          observation: `${column} no puede ser mayor a 10`,
        });
      }
    }
  }

  validateAttendance(value: number) {
    if (value) {
      if (isNaN(value)) {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.ATTENDANCE,
          value: value,
          observation: `${ColumnsEnum.ATTENDANCE} no válida`,
        });

        return;
      }

      const attendance = Number(value);

      if (attendance < 0) {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.ATTENDANCE,
          value: value,
          observation: `${ColumnsEnum.ATTENDANCE} no puede ser menor a 0`,
        });
      }

      if (attendance > 100) {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.ATTENDANCE,
          value: value,
          observation: `${ColumnsEnum.ATTENDANCE} no puede ser mayor a 100`,
        });
      }
    }
  }

  addPartialPermissionError(column: string) {
    this.partialPermissionErrors.push({
      row: this.row,
      column,
      value: '',
      observation: `No se puede cambiar ${column}, el parcial se encuentra bloqueado`,
    });
  }

  async saveGrades(item: any, enrollmentDetail: EnrollmentDetailEntity) {
    if (this.gradeErrors.length === 0) {
      const grades = await this.gradeRepository.find({
        where: { enrollmentDetailId: enrollmentDetail.id },
      });

      let grade1 = grades.find(grade => grade.partialId === this.partial1.id);
      let grade2 = grades.find(grade => grade.partialId === this.partial2.id);

      if (this.partial1.enabled) {
        if (grade1) {
          grade1.value = parseFloat(String(grade1.value));

          if (grade1.value != item[ColumnsEnum.GRADE_1]) {
            if (this.partialEnabled1) {
              grade1.value = item[ColumnsEnum.GRADE_1];
            } else {
              this.addPartialPermissionError(ColumnsEnum.GRADE_1);
            }
          }
        } else {
          if (item[ColumnsEnum.GRADE_1] || item[ColumnsEnum.GRADE_1] == 0) {
            if (this.partialEnabled1) {
              grade1 = this.gradeRepository.create({
                enrollmentDetailId: enrollmentDetail.id,
                partialId: this.partial1.id,
                value: item[ColumnsEnum.GRADE_1],
              });
            } else {
              this.addPartialPermissionError(ColumnsEnum.GRADE_1);
            }
          }
        }
      }

      if (this.partial2.enabled) {
        if (grade2) {
          grade2.value = parseFloat(String(grade2.value));
          if (grade2.value != item[ColumnsEnum.GRADE_2]) {
            if (this.partialEnabled2) {
              grade2.value = item[ColumnsEnum.GRADE_2];
            } else {
              this.addPartialPermissionError(ColumnsEnum.GRADE_2);
            }
          }
        } else {
          if (item[ColumnsEnum.GRADE_2] || item[ColumnsEnum.GRADE_2] == 0) {
            if (this.partialEnabled2) {
              grade2 = this.gradeRepository.create({
                enrollmentDetailId: enrollmentDetail.id,
                partialId: this.partial2.id,
                value: item[ColumnsEnum.GRADE_2],
              });
            } else {
              this.addPartialPermissionError(ColumnsEnum.GRADE_2);
            }
          }
        }
      }

      if (this.partial1.enabled && grade1) await this.gradeRepository.save(grade1);

      if (this.partial2.enabled && grade2) await this.gradeRepository.save(grade2);

      await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
    }
  }

  async saveAttendance(item: any, enrollmentDetail: EnrollmentDetailEntity) {
    if (this.attendanceErrors.length === 0 && (item[ColumnsEnum.ATTENDANCE] || item[ColumnsEnum.ATTENDANCE] == 0)) {
      enrollmentDetail.finalAttendance = item[ColumnsEnum.ATTENDANCE];

      await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
    }
  }

  async saveAcademicState(enrollmentDetail: EnrollmentDetailEntity) {
    const grades = await this.gradeRepository.find({
      where: { enrollmentDetailId: enrollmentDetail.id },
    });

    let grade1 = grades.find(grade => grade.partialId === this.partial1.id)?.value || 0;
    let grade2 = grades.find(grade => grade.partialId === this.partial2.id)?.value || 0;

    if (grade1 && grade2) {
      grade1 = parseFloat(String(grade1));
      grade2 = parseFloat(String(grade2));

      enrollmentDetail.finalGrade = grade1 + grade2;

      await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);

      enrollmentDetail = await this.enrollmentDetailRepository.findOneBy({ id: enrollmentDetail.id });

      const finalGrade = parseFloat(String(enrollmentDetail.finalGrade));
      const finalAttendance = parseFloat(String(enrollmentDetail.finalAttendance));

      if (finalAttendance || finalAttendance == 0) {
        if (finalGrade >= 7) {
          if (finalAttendance >= 75) {
            enrollmentDetail.academicStateId = this.approved.id;
            enrollmentDetail.academicObservation = null;
          } else {
            enrollmentDetail.academicStateId = this.failed.id;
            enrollmentDetail.academicObservation = 'Pierde por Asistencia';
          }
        } else {
          enrollmentDetail.academicStateId = this.failed.id;

          if (finalAttendance >= 75) {
            enrollmentDetail.academicObservation = 'Pierde por Calificación';
          } else {
            enrollmentDetail.academicObservation = 'Pierde por Calificación y Asistencia';
          }
        }

        await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
      }
    }
  }

  async generateErrorReport(teacherDistributionId: string) {
    const errors = this.gradeErrors.concat(this.attendanceErrors, this.partialPermissionErrors);

    const data = errors.map(error => {
      return {
        Fila: error.row,
        Columna: error.column,
        Valor: error.value,
        Observación: error.observation,
      };
    });

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Errores');
    const path = join(process.cwd(), 'storage/reports/grades', teacherDistributionId + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }
}
