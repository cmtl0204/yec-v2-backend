import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateGradeDto, FilterGradeDto, UpdateGradeDto } from '@core/dto';
import { CatalogueEntity, EnrollmentDetailEntity, GradeEntity, PartialEntity, PartialPermissionEntity } from '@core/entities';
import { PaginationDto } from '@core/dto';
import { ServiceResponseHttpModel } from '@shared/models';
import { CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';

enum ColumnsEnum {
  IDENTIFICATION = 'Numero_Documento',
  GRADE_1 = 'Parcial1',
  GRADE_2 = 'Parcial2',
  GRADE_3 = 'Parcial3',
  GRADE_4 = 'Parcial4',
  ATTENDANCE = 'Asistencia',
}

interface ErrorModel {
  row: number;
  column: string;
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
  private partialEnabled3 = false;
  private partialEnabled4 = false;
  private partials: PartialEntity[] = [];
  private partial1!: PartialEntity;
  private partial2!: PartialEntity;
  private partial3!: PartialEntity;
  private approved!: CatalogueEntity;
  private failed!: CatalogueEntity;

  constructor(
    @Inject(CoreRepositoryEnum.CATALOGUE_REPOSITORY) private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.GRADE_REPOSITORY) private repository: Repository<GradeEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_REPOSITORY) private readonly partialRepository: Repository<PartialEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_PERMISSION_REPOSITORY) private readonly partialPermissionRepository: Repository<PartialPermissionEntity>,
    @Inject(CoreRepositoryEnum.GRADE_REPOSITORY) private readonly gradeRepository: Repository<GradeEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY) private readonly enrollmentDetailRepository: Repository<EnrollmentDetailEntity>,
  ) {}

  async create(payload: CreateGradeDto): Promise<GradeEntity> {
    const newSubject = this.repository.create(payload);

    return await this.repository.save(newSubject);
  }

  async findAll(params?: FilterGradeDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Other filters
    // if (params.value) {
    //   return this.filterByValue(params.value);
    // }

    //All
    const data = await this.repository.findAndCount({
      relations: ['partial', 'enrollmentDetail'],
    });

    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }

  async findOne(id: string): Promise<GradeEntity> {
    const subject = await this.repository.findOne({
      relations: ['enrollmentDetail', 'partial'],
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Grade not found');
    }

    return subject;
  }

  async update(id: string, payload: UpdateGradeDto): Promise<GradeEntity> {
    const subject = await this.repository.findOneBy({ id });

    if (!subject) {
      throw new NotFoundException('Grade not found');
    }

    this.repository.merge(subject, payload);

    return await this.repository.save(subject);
  }

  async remove(id: string): Promise<GradeEntity> {
    const subject = await this.repository.findOneBy({ id });

    if (!subject) {
      throw new NotFoundException('Grade not found');
    }

    return await this.repository.save(subject);
  }

  async removeAll(payload: GradeEntity[]): Promise<GradeEntity[]> {
    return await this.repository.softRemove(payload);
  }

  async createGradeByEnrollmentDetail(enrollmentDetailId: string, partialId: string, value: number): Promise<GradeEntity> {
    let grade = await this.repository.findOne({ where: { enrollmentDetailId, partialId } });

    if (!grade) {
      grade = this.repository.create();
      grade.enrollmentDetailId = enrollmentDetailId;
      grade.partialId = partialId;
    }

    grade.value = value;

    return await this.repository.save(grade);
  }

  private async paginateAndFilter(params: FilterGradeDto): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<GradeEntity> | FindOptionsWhere<GradeEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      // where.push({ enrollmentDetail: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      relations: ['enrollmentDetail', 'partial'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      data: response[0],
      pagination: { limit, totalItems: response[1] },
    };
  }

  async saveGradesByTeacher(enrollmentDetailId: string, payload: any) {
    await this.loadAcademicStates();
    await this.loadPartials();
    await this.loadPartialPermissions(payload.teacherDistributionId);
    const grades = await this.gradeRepository.find({
      where: { enrollmentDetailId: enrollmentDetailId },
    });

    let grade1 = grades.find(grade => grade.partialId === this.partial1.id);
    let grade2 = grades.find(grade => grade.partialId === this.partial2.id);
    // let grade3 = grades.find(grade => grade.partialId === this.partial3.id);

    if (grade1) {
      grade1.value = parseFloat(String(grade1.value));

      if (grade1.value != payload.grade1) {
        if (this.partialEnabled1) {
          grade1.value = payload.grade1;
        } else {
          this.addPartialPermissionError(ColumnsEnum.GRADE_1);
        }
      }
    } else {
      if (payload.grade1 || payload.grade1 == 0) {
        if (this.partialEnabled1) {
          grade1 = this.gradeRepository.create({
            enrollmentDetailId: enrollmentDetailId,
            partialId: this.partial1.id,
            value: payload.grade1,
          });
        } else {
          this.addPartialPermissionError(ColumnsEnum.GRADE_1);
        }
      }
    }

    if (grade2) {
      grade2.value = parseFloat(String(grade2.value));
      if (grade2.value != payload.grade2) {
        if (this.partialEnabled2) {
          grade2.value = payload.grade2;
        } else {
          this.addPartialPermissionError(ColumnsEnum.GRADE_2);
        }
      }
    } else {
      if (payload.grade2 || payload.grade2 == 0) {
        if (this.partialEnabled2) {
          grade2 = this.gradeRepository.create({
            enrollmentDetailId: enrollmentDetailId,
            partialId: this.partial2.id,
            value: payload.grade2,
          });
        } else {
          this.addPartialPermissionError(ColumnsEnum.GRADE_2);
        }
      }
    }

    // if (grade3) {
    //   grade3.value = parseFloat(String(grade3.value));
    //   if (grade3.value != payload.grade3) {
    //     if (this.partialEnabled3) {
    //       grade3.value = payload.grade3;
    //     } else {
    //       this.addPartialPermissionError(ColumnsEnum.GRADE_3);
    //     }
    //   }
    // } else {
    //   if (payload.grade3 || payload.grade3 == 0) {
    //     if (this.partialEnabled3) {
    //       grade3 = this.gradeRepository.create({
    //         enrollmentDetailId: enrollmentDetailId,
    //         partialId: this.partial3.id,
    //         value: payload.grade3,
    //       });
    //     } else {
    //       this.addPartialPermissionError(ColumnsEnum.GRADE_3);
    //     }
    //   }
    // }

    if (grade1) await this.gradeRepository.save(grade1);

    if (grade2) await this.gradeRepository.save(grade2);

    // if (grade3) {
    //   await this.gradeRepository.save(grade3);
    // }

    if (this.partialPermissionErrors.length > 0) {
      throw new UnprocessableEntityException({
        error: 'asd',
        message: this.partialPermissionErrors.map(item => item.observation),
      });
    }

    const enrollmentDetail = await this.enrollmentDetailRepository.findOneBy({ id: enrollmentDetailId });

    if (payload.attendance || payload.attendance == 0) {
      enrollmentDetail.finalAttendance = payload.attendance;

      await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
    }

    return await this.saveAcademicState(enrollmentDetail);
  }

  async saveSupplementaryGradeByTeacher(enrollmentDetailId: string, payload: any) {
    const enrollmentDetail = await this.enrollmentDetailRepository.findOneBy({ id: enrollmentDetailId });
    await this.loadPartials();
    await this.loadAcademicStates();

    if (payload.supplementaryGrade || payload.supplementaryGrade == 0) {
      enrollmentDetail.supplementaryGrade = payload.supplementaryGrade;
      await this.enrollmentDetailRepository.update(enrollmentDetail.id, enrollmentDetail);
    }

    return await this.saveAcademicState(enrollmentDetail);
  }

  async saveAcademicState(enrollmentDetail: EnrollmentDetailEntity) {
    const grades = await this.gradeRepository.find({
      where: { enrollmentDetailId: enrollmentDetail.id },
    });

    this.partialPermissionErrors = [];
    const grade1 = grades.find(grade => grade.partialId === this.partial1.id);
    const grade2 = grades.find(grade => grade.partialId === this.partial2.id);
    // const grade3 = grades.find(grade => grade.partialId === this.partial3.id);
    let supplementaryGrade = parseFloat(String(enrollmentDetail.supplementaryGrade));

    // if (grade1 && grade2 && grade3) {
    if (grade1 && grade2) {
      grade1.value = parseFloat(String(grade1.value));
      grade2.value = parseFloat(String(grade2.value));
      // grade3.value = parseFloat(String(grade3.value));

      // let finalGradeTotal = (grade1.value + grade2.value + grade3.value) / 3;
      let finalGradeTotal = grade1.value + grade2.value;

      if (finalGradeTotal >= 7 || finalGradeTotal < 4) {
        supplementaryGrade = null;
      }

      if (supplementaryGrade || supplementaryGrade == 0) {
        finalGradeTotal = (finalGradeTotal + supplementaryGrade) / 2;
      } else {
        enrollmentDetail.supplementaryGrade = null;
      }

      enrollmentDetail.finalGrade = finalGradeTotal;

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

    return grades;
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

      if (partialPermission.partialId === this.partial3.id) {
        this.partialEnabled3 = partialPermission.enabled;
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
}
