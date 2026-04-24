import {Inject, Injectable} from '@nestjs/common';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {
    CareerEntity,
    CatalogueEntity,
    EnrollmentDetailEntity, EnrollmentDetailStateEntity,
    EnrollmentEntity,
    EnrollmentStateEntity,
    StudentEntity, SubjectEntity,
} from '@core/entities';
import {CatalogueEnrollmentStateEnum, CatalogueTypeEnum, CoreRepositoryEnum} from '@shared/enums';
import {UserEntity} from '@auth/entities';
import {CataloguesService, EnrollmentDetailStatesService} from '@core/services';

@Injectable()
export class EnrollmentSqlService {
    constructor(
        @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly repository: Repository<EnrollmentEntity>,
        private readonly cataloguesService: CataloguesService,
    ) {
    }

    async findEnrollmentsByCareer(careerId: string, schoolPeriodId: string): Promise<any[]> {
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
            .where(
                `careers.id = :careerId 
                AND enrollments.school_period_id = :schoolPeriodId 
                AND enrollment_states.deleted_at is null`, {
                    careerId,
                    schoolPeriodId,
                }).orderBy(
            `careers.name, 
                    academic_periods.code, 
                    parallels.code, 
                    users.lastname, 
                    users.name`);

        return await queryBuilder.getRawMany();
    }

    async findEnrollmentsBySchoolPeriod(schoolPeriodId: string): Promise<any[]> {
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
                'enrollments.socioeconomic_category as "Nivel Socioeconómico"',
                'enrollments.socioeconomic_percentage as "Porcentaje Socioeconómico"',
                'enrollments.socioeconomic_score as "Puntaje Socioeconómico"',
                'states.name as "Estado"',
            ])
            .innerJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
            .leftJoin(CatalogueEntity, 'types', 'types.id = enrollments.type_id')
            .innerJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
            .innerJoin(CatalogueEntity, 'parallels', 'parallels.id = enrollments.parallel_id')
            .innerJoin(CatalogueEntity, 'academic_periods', 'academic_periods.id = enrollments.academic_period_id')
            .innerJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
            .innerJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
            .innerJoin(UserEntity, 'users', 'users.id = students.user_id')
            .where(
                `enrollments.school_period_id = :schoolPeriodId 
                AND enrollment_states.deleted_at IS NULL 
                AND (states.code IN (:...stateCodes))`, {
                    schoolPeriodId,
                    stateCodes: ['approved', 'enrolled']
                })
            .orderBy('careers.name, users.lastname, users.name');

        return await queryBuilder.getRawMany();
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
              workday: true,
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
                    subject: {academicPeriod: true},
                    enrollmentDetailState: {state: true},
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

    async findEnrollmentDetailsBySchoolPeriod(schoolPeriodId: string): Promise<any[]> {
        const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.repository.createQueryBuilder('enrollments');
        queryBuilder.select(
            [
                'careers.code as "Código Carrera"',
                'careers.name as "Carrera"',
                'users.identification as "Número de Documento"',
                'users.lastname as "Apellidos"',
                'users.name as "Nombres"',
                'users.email as "Correo Electrónico"',
                'parallels.name as "Paralelo"',
                'types.name as "Tipo de Matrícula"',
                'subjects.code as "Código de Asignatura"',
                'subjects.name as "Asignutura"',
                'enrollment_details.number as "Número de Matrícula"',
                'academic_state.name as "Estado Asignatura"',
                'detail_states.name as "Estado Matrícula"',
                'enrollment_details.observation as "Observación"'
            ])
          .innerJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
          .innerJoin(CatalogueEntity, 'types', 'types.id = enrollments.type_id')
          .innerJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
          .innerJoin(CatalogueEntity, 'academic_periods', 'academic_periods.id = enrollments.academic_period_id')
          .innerJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
          .innerJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
          .innerJoin(UserEntity, 'users', 'users.id = students.user_id')
          .innerJoin(EnrollmentDetailEntity, 'enrollment_details', 'enrollment_details.enrollment_id = enrollments.id')
          .innerJoin(EnrollmentDetailStateEntity, 'enrollment_detail_states', 'enrollment_detail_states.enrollment_detail_id = enrollment_details.id')
          .innerJoin(CatalogueEntity, 'detail_states', 'detail_states.id = enrollment_detail_states.state_id')
          .leftJoin(CatalogueEntity, 'academic_state', 'academic_state.id = enrollment_details.academic_state_id')
          .innerJoin(SubjectEntity, 'subjects', 'subjects.id = enrollment_details.subject_id')
          .innerJoin(CatalogueEntity, 'parallels', 'parallels.id = enrollment_details.parallel_id')

            .where(
                `enrollments.school_period_id = :schoolPeriodId 
                AND enrollment_states.deleted_at is null 
                AND enrollment_detail_states.deleted_at is null 
                AND enrollments.deleted_at IS NULL 
                AND detail_states.code IN (:...stateCodes)`, {
                    schoolPeriodId, stateCodes: ['approved', 'enrolled']
                })
            .orderBy(
                `careers.name, 
                academic_periods.code, 
                parallels.code, 
                users.lastname, 
                users.name`);

        return await queryBuilder.getRawMany();
    }

    async findEnrollmentsBySchoolPeriod2(schoolPeriodId: string): Promise<any[]> {
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
                'enrollments.socioeconomic_category as "Nivel Socioeconómico"',
                'enrollments.socioeconomic_percentage as "Porcentaje Socioeconómico"',
                'enrollments.socioeconomic_score as "Puntaje Socioeconómico"',
                'states.name as "Estado"',
            ])
            .innerJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
            .leftJoin(CatalogueEntity, 'types', 'types.id = enrollments.type_id')
            .innerJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
            .innerJoin(CatalogueEntity, 'parallels', 'parallels.id = enrollments.parallel_id')
            .innerJoin(CatalogueEntity, 'academic_periods', 'academic_periods.id = enrollments.academic_period_id')
            .innerJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
            .innerJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
            .innerJoin(UserEntity, 'users', 'users.id = students.user_id')
            .where(
                `enrollments.school_period_id = :schoolPeriodId 
                AND enrollment_states.deleted_at is null`, {
                    schoolPeriodId,
                })
            .orderBy(
                `careers.name, 
                academic_periods.code, 
                parallels.code, 
                users.lastname, 
                users.name`);

        return await queryBuilder.getRawMany();
    }
}
