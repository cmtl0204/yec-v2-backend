import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {FindOptionsWhere, ILike, Repository} from 'typeorm';
import {
    CreateSchoolPeriodDto, FilterCareerDto,
    PaginationDto,
    SeedSchoolPeriodDto,
    UpdateSchoolPeriodDto
} from '@core/dto';
import {SchoolPeriodEntity} from '@core/entities';
import {CataloguesService} from '@core/services';
import {CatalogueSchoolPeriodStateEnum, CoreRepositoryEnum, MessageEnum} from '@shared/enums';
import {ServiceResponseHttpModel} from '@shared/models';

@Injectable()
export class SchoolPeriodsService {
    constructor(
        @Inject(CoreRepositoryEnum.SCHOOL_PERIOD_REPOSITORY)
        private repository: Repository<SchoolPeriodEntity>,
        private cataloguesService: CataloguesService,
    ) {
    }

    async catalogue(): Promise<ServiceResponseHttpModel> {
        const response = await this.repository.findAndCount({
            relations: ['state'],
            take: 1000,
        });

        return {
            data: response[0],
            pagination: {
                totalItems: response[1],
                limit: 1000,
            },
        };
    }

    async create(payload: CreateSchoolPeriodDto | SeedSchoolPeriodDto): Promise<SchoolPeriodEntity> {
        const newEntity = this.repository.create(payload);
        return await this.repository.save(newEntity);
    }

    async findAll(): Promise<ServiceResponseHttpModel> {
        const relations = {state: true};

        //All
        const response = await this.repository.find({
            relations,
            order: {code: 'desc'},
        });

        return {
            data: response,
            pagination: {totalItems: response.length, limit: response.length},
        };
    }

    async findOne(id: string): Promise<SchoolPeriodEntity> {
        const entity = await this.repository.findOne({
            relations: {state: true},
            where: {
                id,
            },
        });

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        return entity;
    }

    async findOpenSchoolPeriod(): Promise<SchoolPeriodEntity> {
        const entity = await this.repository.findOne({
            where: {
                state: {code: 'open'},
            },
        });

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        return entity;
    }

    async update(id: string, payload: UpdateSchoolPeriodDto): Promise<SchoolPeriodEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        this.repository.merge(entity, payload);

        return await this.repository.save(entity);
    }

    async remove(id: string): Promise<SchoolPeriodEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        return await this.repository.softRemove(entity);
    }

    async removeAll(payload: SchoolPeriodEntity[]): Promise<SchoolPeriodEntity[]> {
        return await this.repository.softRemove(payload);
    }

    private async paginateAndFilter(institutionId: string, params: FilterCareerDto, relations: any): Promise<ServiceResponseHttpModel> {
        let where: FindOptionsWhere<SchoolPeriodEntity> | FindOptionsWhere<SchoolPeriodEntity>[];
        where = {};
        let {page, search} = params;
        const {limit} = params;

        if (search) {
            search = search.trim();
            page = 0;
            where = [];
            where.push({institution: {id: institutionId}, code: ILike(`%${search}%`)});
            where.push({institution: {id: institutionId}, codeSniese: ILike(`%${search}%`)});
            where.push({institution: {id: institutionId}, name: ILike(`%${search}%`)});
            where.push({institution: {id: institutionId}, shortName: ILike(`%${search}%`)});
        }

        const response = await this.repository.findAndCount({
            relations,
            where,
            order: {startedAt: 'desc'},
            take: limit,
            skip: PaginationDto.getOffset(limit, page),
        });

        return {
            data: response[0],
            pagination: {limit, totalItems: response[1]},
        };
    }

    async hide(id: string): Promise<SchoolPeriodEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }
        entity.isVisible = false;
        return await this.repository.save(entity);
    }

    async reactivate(id: string): Promise<SchoolPeriodEntity> {
        const entity = await this.repository.findOneBy({id});

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }
        entity.isVisible = true;
        return await this.repository.save(entity);
    }

    async open(id: string): Promise<SchoolPeriodEntity> {
        const entity = await this.findOne(id);
        const entities = (await this.findAll()).data as SchoolPeriodEntity[];
        const existOpenSchoolPeriod = entities.find(entity => entity.state.code === CatalogueSchoolPeriodStateEnum.OPEN);

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        if (entity.state.code === CatalogueSchoolPeriodStateEnum.OPEN) {
            throw new BadRequestException(MessageEnum.EXISTS_OPEN_SCHOOL_PERIOD);
        }

        if (existOpenSchoolPeriod) {
            throw new BadRequestException(`${MessageEnum.EXISTS_OPEN_SCHOOL_PERIOD} (${existOpenSchoolPeriod.name})`);
        }

        entity.state = await this.cataloguesService.findByCode(CatalogueSchoolPeriodStateEnum.OPEN);
        return await this.repository.save(entity);
    }

    async close(id: string): Promise<SchoolPeriodEntity> {
        const entity = await this.findOne(id);

        if (!entity) {
            throw new NotFoundException(MessageEnum.NOT_FOUND);
        }

        if (entity.state.code === CatalogueSchoolPeriodStateEnum.CLOSE) {
            throw new BadRequestException(MessageEnum.EXISTS_CLOSE_SCHOOL_PERIOD);
        }

        entity.state = await this.cataloguesService.findByCode(CatalogueSchoolPeriodStateEnum.CLOSE);
        return await this.repository.save(entity);
    }

    async findByInstitution(institutionId: string, params?: FilterCareerDto): Promise<ServiceResponseHttpModel> {
        const relations = {state: true};

        //Pagination & Filter by Search
        if (params?.limit > 0 && params?.page >= 0) {
            return await this.paginateAndFilter(institutionId, params, relations);
        }

        //All
        const response = await this.repository.find({
            where: {institution: {id: institutionId}},
            relations,
        });

        return {
            data: response,
            pagination: {totalItems: response.length, limit: response.length},
        };
    }
}
