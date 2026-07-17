import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike, LessThan, SelectQueryBuilder, Not, ArrayContains, In } from 'typeorm';
import { UserEntity } from '@auth/entities';
import {
  CreateEnrollmentDto,
  FilterEnrollmentDto,
  PaginationDto,
  UpdateEnrollmentDto,
} from '@core/dto';
import {
  CareerEntity,
  CatalogueEntity,
  CurriculumEntity,
  EnrollmentDetailEntity,
  EnrollmentEntity,
  InformationStudentEntity,
  SchoolPeriodEntity,
  StudentEntity,
  GradeEntity,
  SubjectEntity,
  EnrollmentStateEntity,
} from '@core/entities';
import {
  CataloguesService,
  EnrollmentStatesService,
  EnrollmentDetailsService,
  EnrollmentDetailStatesService,
  SchoolPeriodsService,
  CareerParallelsService, SubjectsService,
} from '@core/services';
import {
  CatalogueEnrollmentsAcademicStateEnum,
  CatalogueEnrollmentStateEnum,
  CatalogueSchoolPeriodTypeEnum,
  CatalogueTypeEnum,
  CoreRepositoryEnum,
} from '@shared/enums';
import { ServiceResponseHttpModel } from '@shared/models';
import { isAfter, isBefore } from 'date-fns';
import { StudentsService } from './students.service';
import { IsNotEmpty } from 'class-validator';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly repository: Repository<EnrollmentEntity>,
    private readonly enrollmentsStateService: EnrollmentStatesService,
    private readonly enrollmentDetailsService: EnrollmentDetailsService,
    private readonly enrollmentDetailStatesService: EnrollmentDetailStatesService,
    private readonly cataloguesService: CataloguesService,
    private readonly schoolPeriodsService: SchoolPeriodsService,
    private readonly careerParallelsService: CareerParallelsService,
    private readonly studentsService: StudentsService,
    private readonly subjectsService: SubjectsService,
  ) {
  }

  async create(payload: CreateEnrollmentDto): Promise<EnrollmentEntity> {
    const newSubject = this.repository.create(payload);

    return await this.repository.save(newSubject);
  }

  async findAll(params?: FilterEnrollmentDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Other filters
    // if (params.code) {
    //   return this.filterByCode(params.code);
    // }

    //All
    const data = await this.repository.findAndCount({
      relations: { career: true },
    });

    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }

  async findOne(id: string): Promise<EnrollmentEntity> {
    const entity = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        career: true,
        enrollmentStates: { state: true },
        enrollmentState: { state: true },
        parallel: true,
        student: { user: true },
        type: true,
        workday: true,
      },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Matricula no encontrada');
    }

    return entity;
  }

  async update(id: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOneBy({ id });

    if (!enrollment) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    if (enrollment.parallelId != payload.parallel.id) {
      await this.enrollmentDetailsService.updateParallels(enrollment.id, payload.parallel.id);
    }

    if (enrollment.workdayId != payload.workday.id) {
      await this.enrollmentDetailsService.updateWorkdays(enrollment.id, payload.workday.id);
    }

    if (enrollment.typeId != payload.type.id) {
      await this.enrollmentDetailsService.updateTypes(enrollment.id, payload.type.id);
    }

    if (payload.academicPeriod)
      enrollment.academicPeriodId = payload.academicPeriod.id;

    if (payload.parallel)
      enrollment.parallelId = payload.parallel.id;

    if (payload.type)
      enrollment.typeId = payload.type.id;

    if (payload.workday)
      enrollment.workdayId = payload.workday.id;

    if (payload.academicPeriod)
      enrollment.date = payload.date;

    if (payload.observation)
      enrollment.observation = payload.observation;

    return await this.repository.save(enrollment);
  }

  async updateEnrolled(id: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    entity.parallelId = payload.parallel.id;
    entity.workdayId = payload.workday.id;

    return await this.repository.save(entity);
  }

  async updateApproved(id: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    entity.parallelId = payload.parallel.id;
    entity.workdayId = payload.workday.id;

    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<EnrollmentEntity> {
    const subject = await this.repository.findOneBy({ id });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return await this.repository.save(subject);
  }

  async removeAll(payload: EnrollmentEntity[]): Promise<EnrollmentEntity[]> {
    return await this.repository.softRemove(payload);
  }

  private async paginateAndFilter(params: FilterEnrollmentDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<EnrollmentEntity> | FindOptionsWhere<EnrollmentEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ code: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations: { career: true },
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async paginateAndFilterByCareer(careerId: string, params: FilterEnrollmentDto): Promise<ServiceResponseHttpModel> {
    const where: FindOptionsWhere<EnrollmentEntity>[] = [];

    let { page, search } = params;

    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;

      where.push(
        {
          //careerId,
          // schoolPeriodId: params.schoolPeriodId,
          student: {
            user: {
              identification: ILike(`%${search}%`),
            },
          },
        },
        {
          //careerId,
          // schoolPeriodId: params.schoolPeriodId,
          student: {
            user: {
              name: ILike(`%${search}%`),
            },
          },
        },
        {
          //careerId,
          // schoolPeriodId: params.schoolPeriodId,
          student: {
            user: {
              lastname: ILike(`%${search}%`),
            },
          },
        },
      );
    } else {
      if (params.academicPeriodId) {
        if (params.enrollmentStateId) {
          where.push(
            {
              careerId,
              schoolPeriodId: params.schoolPeriodId,
              academicPeriodId: params.academicPeriodId,
              enrollmentState: { state: { id: params.enrollmentStateId } },
            },
          );
        } else {
          if (params.enrollmentStateId) {
            where.push(
              {
                careerId,
                schoolPeriodId: params.schoolPeriodId,
                enrollmentState: { state: { id: params.enrollmentStateId } },
              },
            );
          } else {
            where.push(
              {
                careerId,
                schoolPeriodId: params.schoolPeriodId,
                academicPeriodId: params.academicPeriodId,
              },
            );
          }

        }
      } else {
        if (params.enrollmentStateId) {
          where.push(
            {
              careerId,
              schoolPeriodId: params.schoolPeriodId,
              enrollmentState: { state: { id: params.enrollmentStateId } },
            },
          );
        } else {
          where.push(
            {
              careerId,
              schoolPeriodId: params.schoolPeriodId,
            },
          );
        }
      }
    }

    const response = await this.repository.findAndCount({
      relations: {
        career: true,
        schoolPeriod: true,
        academicPeriod: true,
        parallel: true,
        enrollmentStates: { state: true },
        enrollmentState: { state: true },
        student: { user: true },
        type: true,
        workday: true,
      },
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async filterByCode(code: string): Promise<ServiceResponseHttpModel> {
    const where: FindOptionsWhere<EnrollmentEntity> = {};

    if (code) {
      where.code = LessThan(code);
    }

    const response = await this.repository.findAndCount({
      relations: { career: true },
      where,
    });

    return {
      data: response[0],
      pagination: { limit: 10, totalItems: response[1] },
    };
  }

  async findEnrollmentCertificateByStudent(identificationUser: string, codeSchoolPeriod: string) {
    const enrollmentCertificate = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        enrollmentDetails: true,
        career: true,
        workday: true,
        schoolPeriod: true,
      },
      where: { student: { user: { identification: identificationUser } }, schoolPeriod: { code: codeSchoolPeriod } },
    });

    if (!enrollmentCertificate) {
      throw new NotFoundException('Matricula no encontrada');
    }
    return enrollmentCertificate;
  }

  async reportEnrollmentsByCareer(careerId: string, schoolPeriodId: string): Promise<any[]> {
    const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.repository.createQueryBuilder('enrollments');
    queryBuilder.select(
      [
        'careers.code as "Código de Carrera"',
        'careers.name as "Carrera"',
        'users.identification  as "Número de Documento"',
        'users.lastname  as "Apellidos"',
        'users.name  as "Nombres"',
        'parallels.name as "Paralelo"',
        'academic_periods.name as "Nivel"',
        'types.name as "Tipo de Matricula"',
        'enrollments.date as " Fecha de Matricula"',
        'enrollments.applications_at as "Fecha de envio de solicitud"',
        'states.name        as "Estado"',
      ])
      .innerJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
      .leftJoin(CatalogueEntity, 'types', 'types.id = enrollments.type_id')
      .innerJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
      .innerJoin(CatalogueEntity, 'parallels', 'parallels.id = enrollments.parallel_id')
      .innerJoin(CatalogueEntity, 'academic_periods', 'academic_periods.id = enrollments.academic_period_id')
      .innerJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
      .innerJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
      .innerJoin(UserEntity, 'users', 'users.id = students.user_id')
      .where('careers.id = :careerId and enrollments.school_period_id = :schoolPeriodId and enrollment_states.deleted_at is null', {
        careerId,
        schoolPeriodId,
      }).orderBy('careers.name, academic_periods.code, parallels.code, users.lastname, users.name');

    return await queryBuilder.getRawMany();
  }

  async exportCuposDetalladosByEnrollments(): Promise<any[]> {
    const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.repository.createQueryBuilder('exportCuposAsignatura');

    queryBuilder
      .select([
        'enrollment_state.name',
        'CareerEntity.name',
        'CurriculumEntity.name',
        'UserEntity.identification',
        'UserEntity.lastname',
        'UserEntity.name',
        'UserEntity.email',
        'UserEntity.phone',
        'subjects.code',
        'subjects.name',
        'EnrollmentDetailEntity.number',
        'SchoolPeriodEntity.code_sniese',
        'SchoolPeriodEntity.school_period_id',
        'enrollment_parallel.name',
        'enrollment_type.name',
        'GradeEntity.value',
        'EnrollmentDetailEntity.final_grade',
        'EnrollmentDetailEntity.final_attendance',
        'enrollment_academic_state.code',
        'academic_period.name',

      ])
      .innerJoin(StudentEntity, 'StudentEntity.id = EnrollmentEntity.student_id')
      .innerJoin(InformationStudentEntity, 'StudentEntity.id = Information_studentEntity.student_id')
      .innerJoin(UserEntity, 'UserEntity.id = StudentEntity.user_id')
      .innerJoin(EnrollmentDetailEntity, 'EnrollmentEntity.id = EnrollmentDetailEntity.enrollment_id')
      .innerJoin(CatalogueEntity, 'academic_period', 'academic_period.id = enrollmentEntity.academic_period_id')
      .innerJoin(CatalogueEntity, 'enrollment_state', 'enrollment_state.id = EnrollmentEntity.state_id')
      .innerJoin(CatalogueEntity, 'enrollment_parallel', 'EnrollmentDetailEntity.parallel_id = enrollment_parallel.id')
      .innerJoin(CatalogueEntity, 'enrollment_type', 'EnrollmentDetailEntity.type_id = enrollment_type.id')
      .innerJoin(CatalogueEntity, 'enrollment_workday', 'EnrollmentDetailEntity.workday_id = enrollment_workday.id')
      .innerJoin(CatalogueEntity, 'enrollment_academic_state', 'enrollment_academic_state.id = EnrollmentDetailEntity.academic_state_id')
      .innerJoin(CurriculumEntity, 'CurriculumEntity.id = EnrollmentEntity.curriculum_id')
      .innerJoin(CareerEntity, 'CareerEntity.id = EnrollmentEntity.career_Id')
      .innerJoin(SchoolPeriodEntity, 'SchoolPeriodEntity.id = EnrollmentEntity.school_period_id')
      .innerJoin(GradeEntity, 'enrollment_detail_id = enrollmentDetailsEntity.id')
      .innerJoin(SubjectEntity, 'subjects.id = enrollment_details.subject_id');

    const result = await queryBuilder.getRawMany();
    return result;
  }

  async findstudentGrade(identificationUser: string, codeSchoolPeriod: string) {
    const studentGrade = await this.repository.findOne({
      relations: ['academicPeriod', 'enrollmentDetails', 'career', 'workday', 'schoolPeriod'],
      where: { student: { user: { identification: identificationUser } }, schoolPeriod: { code: codeSchoolPeriod } },
    });

    if (!studentGrade) {
      throw new NotFoundException('Matricula no encontrada');
    }

    return studentGrade;
  }

  async findEnrollmentsByCareer(careerId: string, params?: FilterEnrollmentDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilterByCareer(careerId, params);
    }
  }

  async findEnrollmentsByStudent(studentId: string): Promise<EnrollmentDetailEntity[]> {
    const enrollments = await this.repository.find({
      relations: {
        enrollmentDetails: {
          subject: { type: true },
          academicState: true,
          enrollmentDetailStates: { state: true },
          enrollmentDetailState: { state: true },
        },
      },
      where: { studentId },
    });

    const enrollmentDetails = [];

    for (const item of enrollments) {
      enrollmentDetails.push(...item.enrollmentDetails);
    }

    if (enrollmentDetails.length === 0) {
      return [];
    }

    return enrollmentDetails;
  }

  async findEnrollmentByStudent(studentId: string, careerId: string): Promise<EnrollmentEntity> {
    const openSchoolPeriod = await this.schoolPeriodsService.findOpenSchoolPeriod();

    const enrollment = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        parallel: true,
        workday: true,
        schoolPeriod: true,
        enrollmentStates: {
          state: true,
        },
        enrollmentState: {
          state: true,
        },
      },
      where: { studentId, careerId, schoolPeriodId: openSchoolPeriod.id },
    });

    return enrollment;
  }

  async findEnrollmentSubjectsByStudent(studentId: string, schoolPeriodId: string, careerId: string): Promise<EnrollmentDetailEntity[]> {
    const catalogues = await this.cataloguesService.findCache();

    const enrolledState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    const enrollment = await this.repository.findOne({
      relations: {
        enrollmentDetails: {
          academicState: true,
          subject: { academicPeriod: true },
          enrollmentDetailState: {
            state: true,
          },
          grades: { partial: true },
          parallel: true,
          type: true,
          workday: true,
          incomeType: true,
        },
      },
      where: {
        studentId,
        careerId,
        schoolPeriodId,
        enrollmentDetails: { enrollmentDetailStates: { stateId: enrolledState.id } },
      },
    });

    if (enrollment) {
      return enrollment.enrollmentDetails;
    }

    return [];
  }

  async sendRegistration(userId: string, payload: any): Promise<EnrollmentEntity> {
    try {
      const filePath = join(process.cwd(), 'log-registration.txt');
      fs.appendFile(filePath, payload.toString() + '\n', (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      throw new Error(`Error appending to file: ${error.message}`);
    }

    // return await this.repository.manager.transaction(async (transactionalEntityManager) => {
    let enrollment = await this.repository.findOne({
      relations: { enrollmentStates: { state: true }, enrollmentDetails: true },
      where: {
        studentId: payload.student.id,
        careerId: payload.career.id,
        schoolPeriodId: payload.schoolPeriod.id,
      },
    });

    const enrollmentTotal = await this.findTotalEnrollments(
      enrollment?.id,
      payload.career.id,
      payload.parallel.id,
      payload.schoolPeriod.id,
      payload.workday.id,
      payload.academicPeriod.id,
    );

    const capacity = await this.careerParallelsService.findCapacityByCareer(payload.career.id, payload.parallel.id, payload.workday.id, payload.academicPeriod.id);

    if (capacity <= enrollmentTotal) {
      throw new BadRequestException(`No existen cupos disponibles en la jornada ${payload.workday.name} con en el paralelo ${payload.parallel.name}`);
    }

    if (!enrollment) {
      enrollment = this.repository.create();
    }

    enrollment.academicPeriodId = payload.academicPeriod.id;
    enrollment.careerId = payload.career.id;
    enrollment.parallelId = payload.parallel.id;
    enrollment.schoolPeriodId = payload.schoolPeriod.id;
    enrollment.studentId = payload.student.id;
    enrollment.workdayId = payload.workday.id;
    enrollment.applicationsAt = new Date();
    enrollment.socioeconomicScore = await this.studentsService.calculateSocioeconomicFormScore(enrollment.studentId);
    enrollment.socioeconomicCategory = this.studentsService.calculateSocioeconomicFormCategory(enrollment.socioeconomicScore);
    enrollment.socioeconomicPercentage = this.studentsService.calculateSocioeconomicFormPercentage(enrollment.socioeconomicCategory);

    enrollment = await this.repository.save(enrollment);

    const catalogues = await this.cataloguesService.findCache();

    if (!enrollment.enrollmentStates || enrollment.enrollmentStates?.length === 0) {
      const registeredState = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.REGISTERED &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      await this.enrollmentsStateService.create({
        enrollmentId: enrollment.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    if (enrollment?.enrollmentDetails) {
      await this.enrollmentDetailsService.removeAll(enrollment.enrollmentDetails);
    }

    // if (!valid) {
    //     throw new BadRequestException('No cumple con los prerequisitos de la asignatura');
    // }

    for (const item of payload.enrollmentDetails) {
      // if (await this.validateSubjectPrerequisites(item.id, enrollment.id)) {
      //     continue;
      // }

      let enrollmentNumber = await this.calculateEnrollmentDetailNumber(payload.student.id, item.id);

      enrollmentNumber = enrollmentNumber + 1;

      if (enrollmentNumber > 3) continue;

      const enrollmentDetail: any = {
        enrollmentId: enrollment.id,
        parallel: { id: enrollment.parallelId },
        subject: { id: item.id },
        type: { id: enrollment.typeId },
        workday: { id: enrollment.workdayId },
        number: enrollmentNumber,
      };

      const enrollmentDetailCreated = await this.enrollmentDetailsService.create(userId, enrollmentDetail);

      const registeredState = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.REGISTERED &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: enrollmentDetailCreated.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    return enrollment;
    // });
  }

  async validateSubjectPrerequisites(subjectId: string, enrollmentId: string) {
    const subject = await this.subjectsService.findOne(subjectId);
    const enrollmentDetails = await this.enrollmentDetailsService.findEnrollmentDetailsByEnrollment(enrollmentId);

    let valid = true;
    let existSubject = false;
    let prerequisites = '';
    let namePrerequisite = '';

    for (const subjectPrerequisite of subject.subjectPrerequisites) {
      namePrerequisite = `(${subjectPrerequisite.requirement.code}) ${subjectPrerequisite.requirement.name}`;

      for (const enrollmentDetail of enrollmentDetails) {
        if (subjectPrerequisite.requirement.id === enrollmentDetail.subjectId) {
          existSubject = true;

          if (!enrollmentDetail.academicState?.code || enrollmentDetail.academicState?.code === 'r') {
            prerequisites += '\n' + namePrerequisite;
            valid = false;
          }
        }
      }

      if (!existSubject) {
        prerequisites += '\n' + namePrerequisite;
        valid = false;
      }

      existSubject = false;
    }

    return valid;
  }

  async calculateEnrollmentDetailNumber(studentId: string, subjectId: string) {
    const enrollmentDetails = await this.enrollmentDetailsService.calculateEnrollmentDetailNumber(studentId, subjectId);

    return enrollmentDetails.length;
  }

  async sendRequest(userId: string, id: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    // return await this.repository.manager.transaction(async (transactionalEntityManager) => {
    let enrollment = await this.repository.findOne({
      relations: { enrollmentDetails: { enrollmentDetailStates: true }, enrollmentStates: true },
      where: { id },
    });

    if (!enrollment)
      enrollment = this.repository.create();

    enrollment.applicationsAt = new Date();
    enrollment.typeId = (await this.getType(payload.schoolPeriod)).id;

    enrollment = await this.repository.save(enrollment);

    await this.enrollmentsStateService.removeAll(enrollment.enrollmentStates);

    const catalogues = await this.cataloguesService.findCache();

    const registeredState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentStateEnum.REQUEST_SENT &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    await this.enrollmentsStateService.create({
      enrollmentId: enrollment.id,
      stateId: registeredState.id,
      userId,
      date: new Date(),
      observation: payload.observation,
    });

    for (const item of enrollment.enrollmentDetails) {
      const registeredState = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.REQUEST_SENT &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      await this.enrollmentDetailStatesService.removeAll(item.enrollmentDetailStates);

      item.type = await this.getType(payload.schoolPeriod);

      await this.enrollmentDetailsService.update(item.id, item);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: item.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    return enrollment;
    // });
  }

  async approve(id: string, userId: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOne({
      relations: { enrollmentDetails: { enrollmentDetailStates: true }, enrollmentStates: { state: true } },
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    const catalogues = await this.cataloguesService.findCache();

    const approvedState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentStateEnum.APPROVED &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    await this.enrollmentsStateService.removeAll(enrollment.enrollmentStates);

    await this.enrollmentsStateService.create({
      enrollmentId: id,
      stateId: approvedState.id,
      userId,
      date: new Date(),
      observation: payload.observation,
    });

    for (const item of enrollment.enrollmentDetails) {
      const registeredState = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.APPROVED &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      await this.enrollmentDetailStatesService.removeAll(item.enrollmentDetailStates);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: item.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    return enrollment;
  }

  async reject(id: string, userId: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOne({
      relations: { enrollmentDetails: { enrollmentDetailStates: true }, enrollmentStates: { state: true } },
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    const catalogues = await this.cataloguesService.findCache();

    const rejectedState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentStateEnum.REJECTED &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    await this.enrollmentsStateService.removeAll(enrollment.enrollmentStates);

    await this.enrollmentsStateService.create({
      enrollmentId: id,
      stateId: rejectedState.id,
      userId,
      date: new Date(),
      observation: payload.observation,
    });

    for (const item of enrollment.enrollmentDetails) {
      const registeredState = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.REJECTED &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      await this.enrollmentDetailStatesService.removeAll(item.enrollmentDetailStates);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: item.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    return enrollment;
  }

  async enroll(id: string, userId: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOne({
      relations: {
        enrollmentDetails: { enrollmentDetailStates: true },
        enrollmentStates: true,
        schoolPeriod: true,
        career: true,
        academicPeriod: true,
        student: { user: true },
      },
      where: { id },
    });

    enrollment.date = new Date();

    enrollment.code =
      `${enrollment.schoolPeriod.code}-${enrollment.career.acronym}-${enrollment.student.user.identification}`;

    enrollment.folio =
      `${enrollment.schoolPeriod.code}-${enrollment.career.acronym}-${enrollment.academicPeriod.code}`;

    await this.repository.save(enrollment);

    await this.enrollmentsStateService.removeAll(enrollment.enrollmentStates);

    const catalogues = await this.cataloguesService.findCache();

    const enrolledState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    await this.enrollmentsStateService.create({
      enrollmentId: id,
      stateId: enrolledState.id,
      userId,
      date: new Date(),
      observation: payload.observation,
    });

    for (const item of enrollment.enrollmentDetails) {
      const state = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      item.date = new Date();
      await this.enrollmentDetailsService.update(item.id, item);

      await this.enrollmentDetailStatesService.removeAll(item.enrollmentDetailStates);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: item.id,
        stateId: state.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    return enrollment;
  }

  async revoke(id: string, userId: string, payload: UpdateEnrollmentDto): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOne({
      relations: { enrollmentDetails: { enrollmentDetailStates: true }, enrollmentStates: true },
      where: { id },
    });

    const catalogues = await this.cataloguesService.findCache();

    const revokedState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentStateEnum.REVOKED &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    await this.enrollmentsStateService.removeAll(enrollment.enrollmentStates);

    await this.enrollmentsStateService.create({
      enrollmentId: id,
      stateId: revokedState.id,
      userId,
      date: new Date(),
      observation: payload.observation,
    });

    for (const item of enrollment.enrollmentDetails) {
      const registeredState = catalogues.find(catalogue =>
        catalogue.code === CatalogueEnrollmentStateEnum.REVOKED &&
        catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

      await this.enrollmentDetailStatesService.removeAll(item.enrollmentDetailStates);

      await this.enrollmentDetailStatesService.create({
        enrollmentDetailId: item.id,
        stateId: registeredState.id,
        userId,
        date: new Date(),
        observation: payload.observation,
      });
    }

    return enrollment;
  }

  async findTotalEnrollments(enrollmentId: string, careerId: string, parallelId: string, schoolPeriodId: string, workdayId: string, academicPeriodId: string): Promise<number> {
    const catalogues = await this.cataloguesService.findCache();

    const states = catalogues.filter((item: CatalogueEntity) =>
      item.code != CatalogueEnrollmentStateEnum.REVOKED && item.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    const statesId = states.map(state => state.id);

    let total = [];

    if (enrollmentId) {
      total = await this.repository.find({
        where: {
          id: Not(enrollmentId),
          academicPeriodId,
          workdayId,
          parallelId,
          schoolPeriodId,
          careerId,
          enrollmentStates: { stateId: In(statesId) },
        },
      });
    } else {
      total = await this.repository.find({
        where: {
          academicPeriodId,
          workdayId,
          parallelId,
          schoolPeriodId,
          careerId,
          enrollmentStates: { stateId: In(statesId) },
        },
      });
    }

    return total.length;
  }

  private async getType(schoolPeriod: SchoolPeriodEntity) {
    const currentDate = new Date();

    const catalogues = await this.cataloguesService.findCache();

    let codeType = CatalogueSchoolPeriodTypeEnum.ESPECIAL;


    if (isAfter(currentDate, new Date(schoolPeriod.ordinaryStartedAt)) && isBefore(currentDate, new Date(schoolPeriod.ordinaryEndedAt))) {
      codeType = CatalogueSchoolPeriodTypeEnum.ORDINARY;
    }

    if (isAfter(currentDate, new Date(schoolPeriod.extraOrdinaryStartedAt)) && isBefore(currentDate, new Date(schoolPeriod.extraOrdinaryEndedAt))) {
      codeType = CatalogueSchoolPeriodTypeEnum.EXTRAORDINARY;
    }

    if (isAfter(currentDate, new Date(schoolPeriod.especialStartedAt)) && isBefore(currentDate, new Date(schoolPeriod.especialEndedAt))) {
      codeType = CatalogueSchoolPeriodTypeEnum.ESPECIAL;
    }

    const type = catalogues.find(type => {
      return type.code === codeType && type.type === CatalogueTypeEnum.ENROLLMENTS_TYPE;
    });

    return type;
  }

  private async getEnrollmentDetailNumber(studentId: string, subjectId: string): Promise<number> {
    const number = 1;

    const enrollments = await this.repository.find({
        relations: { enrollmentDetails: { enrollmentDetailStates: { state: true } } },
        where: { studentId, enrollmentDetails: { subjectId } },
      },
    );
    return number;
  }

  async findEnrollmentCertificateByEnrollment(id: string): Promise<EnrollmentEntity> {
    const enrollment = await this.repository.findOne({
      relations: {
        academicPeriod: true,
        career: { institution: true },
        parallel: true,
        workday: true,
        schoolPeriod: true,
        enrollmentDetails: {
          parallel: true,
          subject: { academicPeriod: true },
          enrollmentDetailStates: { state: true },
        },
        enrollmentStates: {
          state: true,
        },
        student: { user: true },
      },
      where: { id },
    });

    return enrollment;
  }

  async findAcademicRecordByStudent(studentId: string, careerId: string): Promise<EnrollmentEntity[]> {
    const catalogues = await this.cataloguesService.findCache();
    const enrolled = catalogues.find(item => item.code === CatalogueEnrollmentStateEnum.REQUEST_SENT && item.type === CatalogueTypeEnum.ENROLLMENT_STATE);

    return await this.repository.find({
      relations: {
        academicPeriod: true,
        parallel: true,
        workday: true,
        schoolPeriod: true,
        enrollmentDetails: {
          parallel: true,
          subject: { academicPeriod: true },
          enrollmentDetailState: { state: true },
        },
        enrollmentStates: {
          state: true,
        },
      },
      where: {
        studentId,
        careerId,

      },
    });
    //enrollmentState: { stateId: enrolled.id },
    //         enrollmentDetails: { enrollmentDetailState: { stateId: enrolled.id } },
  }

  async findEnrollmentSubjectsByTeacher(teacherId: string, params: any): Promise<EnrollmentEntity[]> {
    return await this.repository.find({
      relations: {
        enrollmentDetails: { subject: true },
      },
      where: {
        schoolPeriodId: params.schoolPeriodId,
        enrollmentDetails: { parallelId: params.parallelId, workdayId: params.workdayId },
      },
    });
  }

  async recalculateSocioeconomicForm(): Promise<EnrollmentEntity> {
    // return await this.repository.manager.transaction(async (transactionalEntityManager) => {
    const enrollments = await this.repository.find({
      relations: { enrollmentStates: { state: true }, enrollmentDetails: true },
      where: {
        enrollmentStates: {
          state: {
            code: In([
              'request_sent',
              'approved',
              'enrolled',
              'revoked',
              'registered',
              'rejected',
            ]),
          },
        },
      },
    });


    for (const enrollment of enrollments) {
      enrollment.socioeconomicScore = await this.studentsService.calculateSocioeconomicFormScore(enrollment.studentId);
      enrollment.socioeconomicCategory = this.studentsService.calculateSocioeconomicFormCategory(enrollment.socioeconomicScore);
      enrollment.socioeconomicPercentage = this.studentsService.calculateSocioeconomicFormPercentage(enrollment.socioeconomicCategory);

      await this.repository.save(enrollment);
    }

    return enrollments[0];
    // });
  }

  async findLastEnrollmentDetailByStudent(studentId: string, careerId: string): Promise<string> {
    const catalogues = await this.cataloguesService.findCache();

    const approvedState = catalogues.find(catalogue =>
      catalogue.code === CatalogueEnrollmentsAcademicStateEnum.APPROVED &&
      catalogue.type === CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE);

    const enrollments = await this.repository.find({
      relations: {
        enrollmentDetails: {
          subject: { type: true, academicPeriod: true },
          academicState: true,
        },
      },
      where: { careerId, studentId, enrollmentDetails: { academicStateId: approvedState.id } },
      order: { schoolPeriod: { startedAt: 'asc' }, enrollmentDetails: { subject: { code: 'asc' } } },
    });

    let lastAcademicPeriod = 0;

    for (const enrollment of enrollments) {
      for (const enrollmentDetail of enrollment.enrollmentDetails) {
        if (parseInt(enrollmentDetail.subject.academicPeriod.code) > lastAcademicPeriod) {
          lastAcademicPeriod = parseInt(enrollmentDetail.subject.academicPeriod.code);
        }
      }
    }

    return lastAcademicPeriod.toString();
  }
}
