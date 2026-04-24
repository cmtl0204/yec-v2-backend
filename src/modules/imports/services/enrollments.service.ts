import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CareerEntity,
  CatalogueEntity,
  EnrollmentDetailEntity,
  EnrollmentDetailStateEntity,
  EnrollmentEntity,
  EnrollmentStateEntity,
  GradeEntity,
  InformationStudentEntity,
  InstitutionEntity,
  PartialEntity,
  PartialPermissionEntity,
  SchoolPeriodEntity,
  StudentEntity,
  SubjectEntity,
  TeacherDistributionEntity,
} from '@core/entities';
import { AuthRepositoryEnum, CatalogueEnrollmentStateEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { CataloguesService } from '@core/services';
import { RoleEntity, UserEntity } from '@auth/entities';
import { RoleEnum } from '@auth/enums';

enum ColumnsEnum {
  IDENTIFICATION = 'Identificacion',
  GRADE_1 = 'Parcial1',
  GRADE_2 = 'Parcial2',
  GRADE_3 = 'Parcial3',
  GRADE_4 = 'Parcial4',
  ATTENDANCE = 'Progreso',
  FINAL_GRADE = 'Nota_Final',
  STATE = 'Estado',
  SCHOOL_PERIOD = 'Periodo',
  CAREER_CODE = 'Codigo_Carrera',
  NAME = 'Nombres',
  LASTNAME = 'Apellidos',
  EMAIL = 'Email',
  ACADEMIC_PERIOD = 'Nivel',
  PARALLEL = 'Paralelo',
  WORKDAY = 'Horario',
  SUBJECT_CODE = 'Codigo_Asignatura',
  ENROLLMENT_NUMBER = 'Numero_Matricula',
  ENROLLMENT_DATE = 'Fecha',
}

interface ErrorModel {
  row: number;
  column: string;
  observation: string;
}

@Injectable()
export class EnrollmentsService {
  private gradeErrors: ErrorModel[] = [];
  private attendanceErrors: ErrorModel[] = [];
  private partialPermissionErrors: ErrorModel[] = [];
  private row = 1;
  private partials: PartialEntity[] = [];
  private partial1!: PartialEntity;
  private partial2!: PartialEntity;
  private partial3!: PartialEntity;
  private partial4!: PartialEntity;
  private approved!: CatalogueEntity;
  private failed!: CatalogueEntity;
  private studentRole!: RoleEntity;
  private users: UserEntity[] = [];

  constructor(
    private readonly cataloguesService: CataloguesService,
    @Inject(CoreRepositoryEnum.CATALOGUE_REPOSITORY) private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.SCHOOL_PERIOD_REPOSITORY) private readonly schoolPeriodRepository: Repository<SchoolPeriodEntity>,
    @Inject(CoreRepositoryEnum.GRADE_REPOSITORY) private readonly gradeRepository: Repository<GradeEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_REPOSITORY) private readonly partialRepository: Repository<PartialEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_PERMISSION_REPOSITORY) private readonly partialPermissionRepository: Repository<PartialPermissionEntity>,
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly studentRepository: Repository<StudentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_STATE_REPOSITORY) private readonly enrollmentStateRepository: Repository<EnrollmentStateEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY) private readonly enrollmentDetailRepository: Repository<EnrollmentDetailEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_STATE_REPOSITORY) private readonly enrollmentDetailStateRepository: Repository<EnrollmentDetailStateEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_DISTRIBUTION_REPOSITORY) private readonly teacherDistributionRepository: Repository<TeacherDistributionEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.CAREER_REPOSITORY) private readonly careerRepository: Repository<CareerEntity>,
    @Inject(CoreRepositoryEnum.INSTITUTION_REPOSITORY) private readonly institutionRepository: Repository<InstitutionEntity>,
    @Inject(CoreRepositoryEnum.SUBJECT_REPOSITORY) private readonly subjectRepository: Repository<SubjectEntity>,
    @Inject(AuthRepositoryEnum.ROLE_REPOSITORY) private readonly roleRepository: Repository<RoleEntity>,
    @Inject(CoreRepositoryEnum.INFORMATION_STUDENT_REPOSITORY) private readonly informationStudentRepository: Repository<InformationStudentEntity>,
  ) {}

  async loadRoles() {
    const roles = await this.roleRepository.find();
    this.studentRole = roles.find(role => role.code === RoleEnum.STUDENT);
  }

  async loadUsers() {
    this.users = await this.userRepository.find();
  }

  async loadAcademicStates() {
    const academicStates = await this.catalogueRepository.find({ where: { type: CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE } });
    this.approved = academicStates.find(academicState => academicState.code === 'a');
    this.failed = academicStates.find(academicState => academicState.code === 'r');
  }

  async loadPartials() {
    this.partials = await this.partialRepository.find();
    this.partial1 = this.partials.find(partial => partial.code === '1');
    this.partial2 = this.partials.find(partial => partial.code === '2');
    this.partial3 = this.partials.find(partial => partial.code === '3');
    this.partial4 = this.partials.find(partial => partial.code === '4');
  }

  async importEnrollments(file: Express.Multer.File, payload: any) {
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
    const schoolPeriods = await this.schoolPeriodRepository.find();
    const careers = await this.careerRepository.find();
    const subjects = await this.subjectRepository.find({ relations: { academicPeriod: true } });

    await this.loadUsers();
    await this.loadAcademicStates();
    await this.loadPartials();
    await this.loadRoles();

    const catalogues = await this.cataloguesService.findCache();
    const enrollmentStateEnrolled = catalogues.find(
      catalogue => catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE,
    );

    const parallels = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.PARALLEL);
    const enrollmentTypes = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_TYPE);
    const workdays = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);

    for (const item of dataExcel) {
      this.row++;
      console.log(this.row);
      console.log(item[ColumnsEnum.IDENTIFICATION]);

      const schoolPeriod = schoolPeriods.find(schoolPeriod => schoolPeriod.codeSniese === item[ColumnsEnum.SCHOOL_PERIOD]);
      const career = careers.find(career => career.code === item[ColumnsEnum.CAREER_CODE]);
      const parallel = parallels.find(parallel => parallel.code === item[ColumnsEnum.PARALLEL].toLowerCase());
      const enrollmentType = enrollmentTypes.find(enrollmentType => enrollmentType.code === 'ordinary');
      const workday = workdays.find(workday => workday.code == item[ColumnsEnum.WORKDAY]);

      const subject = subjects.find(subject => subject.code.toLowerCase() === item[ColumnsEnum.SUBJECT_CODE].toLowerCase().trim());
      const academicPeriod = subject.academicPeriod;

      let identification = item[ColumnsEnum.IDENTIFICATION];

      if (!identification || identification.length === 0) continue;

      if (identification) identification = identification.toString().trim();

      if (identification.length === 9) identification = '0' + identification;

      const student = await this.findStudent(item);

      let enrollment = await this.enrollmentRepository.findOne({
        where: {
          studentId: student.id,
          schoolPeriodId: schoolPeriod.id,
          careerId: career.id,
        },
      });

      if (enrollment) {
        let enrollmentDetail = await this.enrollmentDetailRepository.findOne({
          where: {
            enrollmentId: enrollment.id,
            subjectId: subject.id,
          },
        });

        if (!enrollmentDetail) {
          enrollmentDetail = this.enrollmentDetailRepository.create();
        }

        enrollmentDetail.enrollmentId = enrollment.id;
        enrollmentDetail.parallelId = parallel.id;
        enrollmentDetail.subjectId = subject.id;
        enrollmentDetail.typeId = enrollmentType.id;
        enrollmentDetail.workdayId = workday.id;
        enrollmentDetail.number = item[ColumnsEnum.ENROLLMENT_NUMBER];
        enrollmentDetail.date = new Date(item[ColumnsEnum.ENROLLMENT_DATE]);

        enrollmentDetail = await this.enrollmentDetailRepository.save(enrollmentDetail);

        const enrollmentDetailState = {
          enrollmentDetailId: enrollmentDetail.id,
          stateId: enrollmentStateEnrolled.id,
          userId: student.userId,
          date: new Date(item[ColumnsEnum.ENROLLMENT_DATE]),
        };

        await this.enrollmentDetailStateRepository.save(enrollmentDetailState);

        // await this.saveGrades(item, enrollmentDetail);

        await this.saveAttendance(item, enrollmentDetail);

        await this.saveAcademicState(item, enrollmentDetail);
      } else {
        enrollment = this.enrollmentRepository.create();
        enrollment.academicPeriodId = academicPeriod.id;
        enrollment.careerId = career.id;
        enrollment.parallelId = parallel.id;
        enrollment.schoolPeriodId = schoolPeriod.id;
        enrollment.studentId = student.id;
        enrollment.typeId = enrollmentType.id;
        enrollment.workdayId = workday.id;
        enrollment.code = `${schoolPeriod.codeSniese}-${career.code}-${identification}`;
        enrollment.date = new Date(item[ColumnsEnum.ENROLLMENT_DATE]);
        enrollment.applicationsAt = new Date(item[ColumnsEnum.ENROLLMENT_DATE]);
        enrollment.folio = `${schoolPeriod.codeSniese}-${career.code}-${academicPeriod.code}`;

        const enrollmentCreated = await this.enrollmentRepository.save(enrollment);

        const enrollmentState = {
          enrollmentId: enrollmentCreated.id,
          stateId: enrollmentStateEnrolled.id,
          userId: student.userId,
          date: new Date(item[ColumnsEnum.ENROLLMENT_DATE]),
        };

        await this.enrollmentStateRepository.save(enrollmentState);

        let enrollmentDetail = this.enrollmentDetailRepository.create();
        enrollmentDetail.enrollmentId = enrollmentCreated.id;
        enrollmentDetail.parallelId = parallel.id;
        enrollmentDetail.subjectId = subject.id;
        enrollmentDetail.typeId = enrollmentType.id;
        enrollmentDetail.workdayId = workday.id;
        enrollmentDetail.number = item[ColumnsEnum.ENROLLMENT_NUMBER];
        enrollmentDetail.date = new Date();

        enrollmentDetail = await this.enrollmentDetailRepository.save(enrollmentDetail);

        const enrollmentDetailState = {
          enrollmentDetailId: enrollmentDetail.id,
          stateId: enrollmentStateEnrolled.id,
          userId: student.userId,
          date: new Date(item[ColumnsEnum.ENROLLMENT_DATE]),
        };

        await this.enrollmentDetailStateRepository.save(enrollmentDetailState);

        // await this.saveGrades(item, enrollmentDetail);

        await this.saveAttendance(item, enrollmentDetail);

        await this.saveAcademicState(item, enrollmentDetail);
      }
    }

    await this.generateErrorReport(teacherDistribution.id);

    fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));

    if (this.gradeErrors.concat(this.attendanceErrors, this.partialPermissionErrors).length > 0) throw new BadRequestException();
  }

  checkErrors(item: any) {
    this.validateGrade(item[ColumnsEnum.GRADE_1], ColumnsEnum.GRADE_1);
    this.validateGrade(item[ColumnsEnum.GRADE_2], ColumnsEnum.GRADE_2);
    this.validateGrade(item[ColumnsEnum.GRADE_3], ColumnsEnum.GRADE_3);
    this.validateGrade(item[ColumnsEnum.GRADE_4], ColumnsEnum.GRADE_4);

    this.validateAttendance(item[ColumnsEnum.ATTENDANCE]);
  }

  validateGrade(value: number, column: string) {
    if (value || value == 0) {
      if (isNaN(value)) {
        this.gradeErrors.push({
          row: this.row,
          column,
          observation: `${column} no válida`,
        });

        return;
      }

      const grade = Number(value);

      if (grade < 0) {
        this.gradeErrors.push({
          row: this.row,
          column,
          observation: `${column} no puede ser menor a 0`,
        });
      }

      if (grade > 10) {
        this.gradeErrors.push({
          row: this.row,
          column,
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
          observation: `${ColumnsEnum.ATTENDANCE} no válida`,
        });

        return;
      }

      const attendance = Number(value);

      if (attendance < 0) {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.ATTENDANCE,
          observation: `${ColumnsEnum.ATTENDANCE} no puede ser menor a 0`,
        });
      }

      if (attendance > 100) {
        this.attendanceErrors.push({
          row: this.row,
          column: ColumnsEnum.ATTENDANCE,
          observation: `${ColumnsEnum.ATTENDANCE} no puede ser mayor a 100`,
        });
      }
    }
  }

  addPartialPermissionError(column: string) {
    this.partialPermissionErrors.push({
      row: this.row,
      column,
      observation: `No se puede cambiar ${column}, el parcial se encuentra bloqueado`,
    });
  }

  async saveGrades(item: any, enrollmentDetail: EnrollmentDetailEntity) {
    if (this.gradeErrors.length === 0) {
      const grades = await this.gradeRepository.find({
        where: { enrollmentDetailId: enrollmentDetail.id },
      });

      console.log(grades);

      let grade1 = grades.find(grade => grade.partialId === this.partial1.id);
      let grade2 = grades.find(grade => grade.partialId === this.partial2.id);
      let grade3 = grades.find(grade => grade.partialId === this.partial3.id);
      let grade4 = grades.find(grade => grade.partialId === this.partial4.id);

      if (grade1) {
        grade1.value = parseFloat(String(grade1.value));

        if (grade1.value != item[ColumnsEnum.GRADE_1]) {
          grade1.value = item[ColumnsEnum.GRADE_1];
        }
      } else {
        if (item[ColumnsEnum.GRADE_1] || item[ColumnsEnum.GRADE_1] == 0) {
          grade1 = this.gradeRepository.create({
            enrollmentDetailId: enrollmentDetail.id,
            partialId: this.partial1.id,
            value: item[ColumnsEnum.GRADE_1],
          });
        }
      }

      if (grade2) {
        grade2.value = parseFloat(String(grade2.value));
        if (grade2.value != item[ColumnsEnum.GRADE_2]) {
          grade2.value = item[ColumnsEnum.GRADE_2];
        }
      } else {
        if (item[ColumnsEnum.GRADE_2] || item[ColumnsEnum.GRADE_2] == 0) {
          grade2 = this.gradeRepository.create({
            enrollmentDetailId: enrollmentDetail.id,
            partialId: this.partial2.id,
            value: item[ColumnsEnum.GRADE_2],
          });
        }
      }

      if (grade3) {
        grade3.value = parseFloat(String(grade3.value));
        if (grade3.value != item[ColumnsEnum.GRADE_3]) {
          grade3.value = item[ColumnsEnum.GRADE_3];
        }
      } else {
        if (item[ColumnsEnum.GRADE_3] || item[ColumnsEnum.GRADE_3] == 0) {
          grade3 = this.gradeRepository.create({
            enrollmentDetailId: enrollmentDetail.id,
            partialId: this.partial3.id,
            value: item[ColumnsEnum.GRADE_3],
          });
        }
      }

      if (grade4) {
        grade4.value = parseFloat(String(grade4.value));
        if (grade4.value != item[ColumnsEnum.GRADE_4]) {
          grade4.value = item[ColumnsEnum.GRADE_4];
        }
      } else {
        if (item[ColumnsEnum.GRADE_4] || item[ColumnsEnum.GRADE_4] == 0) {
          grade4 = this.gradeRepository.create({
            enrollmentDetailId: enrollmentDetail.id,
            partialId: this.partial4.id,
            value: item[ColumnsEnum.GRADE_4],
          });
        }
      }

      if (grade1) await this.gradeRepository.save(grade1);

      if (grade2) await this.gradeRepository.save(grade2);

      if (grade3) await this.gradeRepository.save(grade3);

      if (grade4) await this.gradeRepository.save(grade4);
    }
  }

  async saveAttendance(item: any, enrollmentDetail: EnrollmentDetailEntity) {
    if (this.attendanceErrors.length === 0 && (item[ColumnsEnum.ATTENDANCE] || item[ColumnsEnum.ATTENDANCE] == 0)) {
      enrollmentDetail.finalAttendance = item[ColumnsEnum.ATTENDANCE];

      await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
    }
  }

  async saveAcademicState(item: any, enrollmentDetail: EnrollmentDetailEntity) {
    if (item[ColumnsEnum.FINAL_GRADE]) enrollmentDetail.finalGrade = item[ColumnsEnum.FINAL_GRADE];

    await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);

    enrollmentDetail = await this.enrollmentDetailRepository.findOneBy({ id: enrollmentDetail.id });

    if (item[ColumnsEnum.STATE].toLowerCase().trim() === 'aprobado') {
      enrollmentDetail.academicStateId = this.approved.id;
    } else {
      enrollmentDetail.academicStateId = this.failed.id;
    }

    await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
  }

  async generateErrorReport(teacherDistributionId: string) {
    const errors = this.gradeErrors.concat(this.attendanceErrors, this.partialPermissionErrors);

    const data = errors.map(error => {
      return {
        Fila: error.row,
        Columna: error.column,
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

  async findStudent(item: any) {
    let identification = item[ColumnsEnum.IDENTIFICATION];

    if (identification) identification = identification.toString().trim();

    if (identification.length === 9) identification = '0' + identification;

    let student = await this.studentRepository.findOne({
      relations: { user: true },
      where: { user: { identification: identification } },
    });

    if (student) {
      return student;
    }

    const careers = await this.careerRepository.find({ where: { code: item[ColumnsEnum.CAREER_CODE] } });
    const institutions = await this.institutionRepository.find();
    const catalogues = await this.cataloguesService.findCache();
    const identificationType = catalogues.find(catalogue => catalogue.code === '1' && catalogue.type === CatalogueTypeEnum.IDENTIFICATION_TYPE);

    const user = this.userRepository.create();
    user.identification = identification;
    user.identificationTypeId = identificationType.id;
    user.name = item[ColumnsEnum.NAME].trim();
    user.lastname = item[ColumnsEnum.LASTNAME].trim();
    // user.email = item[ColumnsEnum.EMAIL].trim();
    user.username = identification;
    user.password = identification.toString();
    user.careers = careers;
    user.institutions = institutions;
    user.roles = [this.studentRole];

    const userCreated = await this.userRepository.save(user);

    student = this.studentRepository.create();
    student.userId = userCreated.id;
    student.careers = careers;

    const studentCreated = await this.studentRepository.save(student);

    const newInformationStudent = this.informationStudentRepository.create({ studentId: studentCreated.id });

    await this.informationStudentRepository.save(newInformationStudent);

    return studentCreated;
  }

  async importEnrollmentsValidate(file: Express.Multer.File, payload: any) {
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
    const schoolPeriods = await this.schoolPeriodRepository.find();
    const careers = await this.careerRepository.find();
    const subjects = await this.subjectRepository.find({ relations: { academicPeriod: true } });

    await this.loadUsers();
    await this.loadAcademicStates();
    await this.loadPartials();
    await this.loadRoles();

    const catalogues = await this.cataloguesService.findCache();
    const enrollmentStateEnrolled = catalogues.find(
      catalogue => catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE,
    );

    const parallels = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.PARALLEL);
    const enrollmentTypes = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_TYPE);
    const workdays = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);

    for (const item of dataExcel) {
      this.row++;

      const schoolPeriod = schoolPeriods.find(schoolPeriod => schoolPeriod.codeSniese === item[ColumnsEnum.SCHOOL_PERIOD]);
      const career = careers.find(career => career.code === item[ColumnsEnum.CAREER_CODE]);
      const parallel = parallels.find(parallel => parallel.code === item[ColumnsEnum.PARALLEL].toLowerCase());
      const enrollmentType = enrollmentTypes.find(enrollmentType => enrollmentType.code === 'ordinary');
      const workday = workdays.find(workday => workday.code == item[ColumnsEnum.WORKDAY]);

      const subject = subjects.find(subject => subject.code.toLowerCase() === item[ColumnsEnum.SUBJECT_CODE].toLowerCase().trim());
      const academicPeriod = subject.academicPeriod;

      let identification = item[ColumnsEnum.IDENTIFICATION];

      if (!identification || identification.length === 0) continue;

      if (identification) identification = identification.toString().trim();

      if (identification.length === 9) identification = '0' + identification;

      const student = await this.findStudent(item);

      let enrollment = await this.enrollmentRepository.findOne({
        where: {
          studentId: student.id,
          schoolPeriodId: schoolPeriod.id,
          careerId: career.id,
        },
      });

      if (enrollment) {
        console.log(this.row);
        console.log(item[ColumnsEnum.IDENTIFICATION]);
        console.log(item[ColumnsEnum.SCHOOL_PERIOD]);
        console.log(item[ColumnsEnum.SUBJECT_CODE]);
        console.log(item[ColumnsEnum.WORKDAY]);
        console.log(item[ColumnsEnum.PARALLEL]);
        console.log('-----------------------------------------------------------------------------------------');
      }
    }

    await this.generateErrorReport(teacherDistribution.id);

    fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));

    if (this.gradeErrors.concat(this.attendanceErrors, this.partialPermissionErrors).length > 0) throw new BadRequestException();
  }
}
