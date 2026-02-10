import {Injectable} from '@nestjs/common';
import {CreateCatalogueDto, SeedCatalogueDto} from '@core/dto';
import {CataloguesService} from '@core/services';
import {
    CatalogueStateEnum,
    CatalogueTypeEnum,
    CatalogueCareersModalityEnum,
    CatalogueMaritalStatusEnum,
    CatalogueSchoolPeriodStateEnum, CatalogueEthnicOriginEnum, CatalogueTypeSchoolEnum, CatalogueStudentLiveEnum
} from '@shared/enums';
import {CatalogueEntity} from "@core/entities";
import {SeedCatalogueParentDto} from "../../modules/core/dto/catalogues/seed-catalogue-parent.dto";

@Injectable()
export class CataloguesSeeder {
    constructor(private catalogueService: CataloguesService) {
    }

    async run() {
        await this.createAcademicPeriodCatalogues();
        await this.createBloodTypeCatalogues();
        await this.createCareerModalityCatalogues();
        await this.createDisabilityTypeCatalogues();
        await this.createEducationLevelCatalogues();
        await this.createEthnicOriginCatalogues();
        await this.createIdentificationTypeCatalogues();
        await this.createInstitutionPracticesTypeCatalogues();
        await this.createIndigenousNationalityTypeCatalogues();
        await this.createGenderCatalogues();
        await this.createMaritalStatusCatalogues();
        await this.createProjectScopeCatalogues();
        await this.createScholarshipReasonCatalogues();
        await this.createScholarshipTypeCatalogues();
        await this.createScholarshipFundingTypeCatalogues();
        await this.createTypeSchoolCatalogues();
        await this.createSexCatalogues();
        await this.createStudentIncomeForCatalogues();
        await this.createStudentOccupationCatalogues();
        await this.createYesNoCatalogues();
        await this.createYesNoNACatalogues();
        await this.createSchoolPeriodsStateCatalogues();
        await this.createInstitutionsStateCatalogues();
        await this.createCareersStateCatalogues();
        await this.createCareersTypeCatalogues();
        await this.createCurriculumsStateCatalogues();
        await this.createSubjectsStateCatalogues();
        await this.createSubjectsTypeCatalogues();
        await this.createEnrollmentsWorkdayCatalogues();
        await this.createParallelsCatalogues();
        await this.createEnrollmentsTypeCatalogues();
        await this.createEnrollmentsAcademicStateCatalogues();
        await this.createEnrollmentsStateCatalogues();
        await this.createClassroomsStateCatalogues();
        await this.createClassroomsTypeCatalogues();
        await this.createStudentLiveCatalogues();
        await this.createHomeOwnershipCatalogues();
        await this.createHomeTypeCatalogues();
        await this.createHomeRoofCatalogues();
        await this.createHomeFloorCatalogues();
        await this.createHomeWallCatalogues();
        await this.createFamilyIncomeCatalogues();
        await this.createNationalityCatalogues();
        await this.createAncestralLanguageNameCatalogues();
        await this.createTownCatalogues();
        await this.createForeignLanguageNameCatalogues();
        await this.createContactEmergencyKinshipCatalogues();
        await this.createMonthlySalaryCatalogues();
        await this.createWorkingHoursIdCatalogues();
        await this.createChildrenTotalCatalogues();
        await this.createUniversityCarrerIdCatalogues();
        await this.createDegreeSuperiorIdCatalogues();
        await this.createTypeStudyOtherCareerIdCatalogues();
        await this.createElectronicDeviceIdCatalogues();
        await this.createInternetTypeIdCatalogues();
        await this.createMembersHouseNumberCatalogues();
        await this.createFamilyPropiertiesIdCatalogues();
        await this.createFamilyKinshipCatastrophicIllnessIdCatalogues();
        await this.createWaterServiceTypeCatalogues();
        await this.createElectricServiceBlackoutCatalogues();
        await this.createSewerageServiceTypeCatalogues();
        await this.createEconomicContributionIdCatalogues();
        await this.createConsumeNewsTypeCatalogues();
        await this.createTypeGenderViolenceCatalogues();
        await this.createPandemicPsychologicalEffectCatalogues();
        await this.createTypeInjuriesCatalogues();
        await this.createTypeDiscriminationCatalogues();
        await this.createSocialGroupCatalogues();
        await this.createFamilyKinshipDisabilityCatalogues();
        await this.createFileTypeNewStudentsCatalogues();
        await this.createFileTypeOldStudentsCatalogues();
    }

    private async createAcademicPeriodCatalogues(): Promise<void> {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'leveling',
                description: 'Nivelación',
                name: 'Nivelación',
                sort: 0,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '1',
                description: 'Periodo academico',
                name: 'Primero',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '2',
                description: 'Periodo academico',
                name: 'Segundo',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '3',
                description: 'Periodo academico',
                name: 'Tercero',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '4',
                description: 'Periodo academico',
                name: 'Cuarto',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '5',
                description: 'Periodo academico',
                name: 'Quinto',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '6',
                description: 'Periodo academico',
                name: 'Sexto',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '7',
                description: 'Periodo academico',
                name: 'Séptimo',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '8',
                description: 'Periodo academico',
                name: 'Octavo',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '9',
                description: 'Periodo academico',
                name: 'Noveno',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
            {
                code: '10',
                description: 'Periodo academico',
                name: 'Décimo',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ACADEMIC_PERIOD,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createBloodTypeCatalogues(): Promise<void> {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'a+',
                description: 'tipo de sangre',
                name: 'A+',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'a-',
                description: 'tipo de sangre',
                name: 'A-',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'b+',
                description: 'tipo de sangre',
                name: 'B+',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'b-',
                description: 'tipo de sangre',
                name: 'B-',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'ab+',
                description: 'tipo de sangre',
                name: 'AB+',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'ab-',
                description: 'tipo de sangre',
                name: 'AB-',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'o+',
                description: 'tipo de sangre',
                name: 'O+',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
            {
                code: 'o-',
                description: 'tipo de sangre',
                name: 'O-',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.BLOOD_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createCareerModalityCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: CatalogueCareersModalityEnum.ON_SITE,
                description: 'Modalidad de carrera',
                name: 'Presencial',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREER_MODALITY,
            },
            {
                code: CatalogueCareersModalityEnum.SEMI_ON_SITE,
                description: 'Modalidad de carrera',
                name: 'Semi-Presencial',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREER_MODALITY,
            },
            {
                code: CatalogueCareersModalityEnum.DISTANCE,
                description: 'Modalidad de carrera',
                name: 'Distancia',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREER_MODALITY,
            },
            {
                code: CatalogueCareersModalityEnum.ONLINE,
                description: 'Modalidad de carrera',
                name: 'En Línea',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREER_MODALITY,
            }
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createDisabilityTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'tipo de discapacidad',
                name: 'Intelectual',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DISABILITY_TYPE,
            },
            {
                code: '2',
                description: 'tipo de discapacidad',
                name: 'Física',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DISABILITY_TYPE,
            },
            {
                code: '3',
                description: 'tipo de discapacidad',
                name: 'Visual',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DISABILITY_TYPE,
            },
            {
                code: '4',
                description: 'tipo de discapacidad',
                name: 'Auditiva',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DISABILITY_TYPE,
            },
            {
                code: '6',
                description: 'tipo de discapacidad',
                name: 'Psicosocial',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DISABILITY_TYPE,
            },
            {
                code: '5',
                description: 'tipo de discapacidad',
                name: 'Otra',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DISABILITY_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEducationLevelCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Nivel de formación',
                name: 'Centro de Alfabetización',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '2',
                description: 'Nivel de formación',
                name: 'Jardín de infantes',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '3',
                description: 'Nivel de formación',
                name: 'Primaria',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '4',
                description: 'Nivel de formación',
                name: 'Educación Básica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '5',
                description: 'Nivel de formación',
                name: 'Secundaria',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '6',
                description: 'Nivel de formación',
                name: 'Educación Media',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '7',
                description: 'Nivel de formación',
                name: 'Superior no Universitaria',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '8',
                description: 'Nivel de formación',
                name: 'Superior Universitaria',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '9',
                description: 'Nivel de formación',
                name: 'Posgrado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
            {
                code: '10',
                description: 'Nivel de formación',
                name: 'No aplica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.EDUCATION_LEVEL,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEthnicOriginCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: CatalogueEthnicOriginEnum.INDIGENOUS,
                description: 'etnia',
                name: 'Indígena',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ETHNIC_ORIGIN,
            },
            {
                code: CatalogueEthnicOriginEnum.AFRO_ECUADORIAN,
                description: 'etnia',
                name: 'Afroecuatoriano',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ETHNIC_ORIGIN,
            },
            {
                code: CatalogueEthnicOriginEnum.MONTUBIO,
                description: 'etnia',
                name: 'Montubio',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ETHNIC_ORIGIN,
            },
            {
                code: CatalogueEthnicOriginEnum.HALF_BLOOD,
                description: 'etnia',
                name: 'Mestizo',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ETHNIC_ORIGIN,
            },
            {
                code: CatalogueEthnicOriginEnum.WHITE,
                description: 'etnia',
                name: 'Blanco',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ETHNIC_ORIGIN,
            }
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createIdentificationTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'tipo de identificacion',
                name: 'Cédula',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.IDENTIFICATION_TYPE,
            },
            {
                code: '2',
                description: 'tipo de identificacion',
                name: 'Pasaporte',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.IDENTIFICATION_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createInstitutionPracticesTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'tipo de institucion practicas',
                name: 'Pública',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INSTITUTION_PRACTICES_TYPE,
            },
            {
                code: '2',
                description: 'tipo de institucion practicas',
                name: 'Privada',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INSTITUTION_PRACTICES_TYPE,
            },
            {
                code: '3',
                description: 'tipo de institucion practicas',
                name: 'ONG',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INSTITUTION_PRACTICES_TYPE,
            },
            {
                code: '4',
                description: 'tipo de institucion practicas',
                name: 'Otro',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INSTITUTION_PRACTICES_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createGenderCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'genero',
                name: 'Masculino',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.GENDER,
            },
            {
                code: '2',
                description: 'tipo de identificacion',
                name: 'Femenino',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.GENDER,
            },
            {
                code: '3',
                description: '',
                name: 'LGBTI',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.GENDER,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createMaritalStatusCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: CatalogueMaritalStatusEnum.SINGLE,
                description: 'estado civil',
                name: 'Soltero/a',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MARITAL_STATUS,
            },
            {
                code: CatalogueMaritalStatusEnum.MARRIED,
                description: 'estado civil',
                name: 'Casado/a',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MARITAL_STATUS,
            },
            {
                code: CatalogueMaritalStatusEnum.DIVORCED,
                description: 'estado civil',
                name: 'Divorciado/a',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MARITAL_STATUS,
            },
            {
                code: CatalogueMaritalStatusEnum.FREE_UNION,
                description: 'estado civil',
                name: 'Unión libre',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MARITAL_STATUS,
            },
            {
                code: CatalogueMaritalStatusEnum.WIDOWER,
                description: 'estado civil',
                name: 'Viudo/a',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MARITAL_STATUS,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createProjectScopeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Alcance del proyecto de vinculacion',
                name: 'Nacional',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PROJECT_SCOPE,
            },
            {
                code: '2',
                description: 'Alcance del proyecto de vinculacion',
                name: 'Provincial',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PROJECT_SCOPE,
            },
            {
                code: '3',
                description: 'Alcance del proyecto de vinculacion',
                name: 'Cantonal',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PROJECT_SCOPE,
            },
            {
                code: '4',
                description: 'Alcance del proyecto de vinculacion',
                name: 'Parrolquial',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PROJECT_SCOPE,
            },
            {
                code: '5',
                description: 'Alcance del proyecto de vinculacion',
                name: 'No aplica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PROJECT_SCOPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createScholarshipReasonCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Primera razón de la beca',
                name: 'Socioeconómica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },
            {
                code: '2',
                description: 'Segunda razón de la beca',
                name: 'Excelencia Académica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },
            {
                code: '3',
                description: 'Tercera razón de la beca',
                name: 'Deportista',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },

            {
                code: '4',
                description: 'Cuarta razón de la beca',
                name: 'Pueblos y Nacionalidades',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },
            {
                code: '5',
                description: 'Quinta razón de la beca',
                name: 'Discapacidad',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },
            {
                code: '6',
                description: 'Sexta razón de la beca',
                name: 'Otra',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },
            {
                code: '0',
                description: 'Sexta razón de la beca',
                name: 'No aplica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_REASON,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createScholarshipTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'total',
                description: 'Tipo de beca',
                name: 'Total',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_TYPE,
            },
            {
                code: 'partial',
                description: 'Tipo de beca',
                name: 'Parcial',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_TYPE,
            },
            {
                code: 'na',
                description: 'Tipo de beca',
                name: 'No aplica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createScholarshipFundingTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Tipo de financiamento de beca',
                name: 'Fondos propios',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_FUNDING_TYPE,
            },
            {
                code: '2',
                description: 'Tipo de financiamento de beca',
                name: 'Transferencia del Estado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_FUNDING_TYPE,
            },
            {
                code: '3',
                description: 'Tipo de financiamento de beca',
                name: 'Donaciones',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_FUNDING_TYPE,
            },
            {
                code: '4',
                description: 'Tipo de financiamento de beca',
                name: 'No aplica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOLARSHIP_FUNDING_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createTypeSchoolCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: CatalogueTypeSchoolEnum.FISCAL,
                description: 'Tipo de colegio',
                name: 'Fiscal',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
            {
                code: CatalogueTypeSchoolEnum.FISCOMISIONAL,
                description: 'Tipo de colegio',
                name: 'Fiscomisional',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
            {
                code: CatalogueTypeSchoolEnum.PARTICULAR,
                description: 'Tipo de colegio',
                name: 'Particular',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
            {
                code: CatalogueTypeSchoolEnum.MUNICIPAL,
                description: 'Tipo de colegio',
                name: 'Municipal',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
            {
                code: '5',
                description: 'Tipo de colegio',
                name: 'Sist. Intercultural bilingue',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
            {
                code: '6',
                description: 'Tipo de colegio',
                name: 'Guard. memoria afroecuat.',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
            {
                code: '6',
                description: 'Tipo de colegio',
                name: 'Guard. memoria montubia',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_SCHOOL,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createSexCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'sexo',
                name: 'Hombre',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SEX,
            },
            {
                code: '2',
                description: 'sexo',
                name: 'Mujer',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SEX,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createStudentIncomeForCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Para que emplea sus ingresos',
                name: 'Financiar sus estudios',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_INCOME_FOR,
            },
            {
                code: '2',
                description: 'Para que emplea sus ingresos',
                name: 'Para mantener a su hogar',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_INCOME_FOR,
            },
            {
                code: '3',
                description: 'Para que emplea sus ingresos',
                name: 'Gastos personales',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_INCOME_FOR,
            },
            {
                code: '4',
                description: 'Para que emplea sus ingresos',
                name: 'No aplica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_INCOME_FOR,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createStudentOccupationCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Ocupacion del estudiante',
                name: 'Solo estudia',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_OCCUPATION,
            },
            {
                code: '2',
                description: 'Ocupacion del estudiante',
                name: 'Trabaja y estudia',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_OCCUPATION,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createYesNoCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Si o No',
                name: 'Sí',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.YES_NO,
            },
            {
                code: '2',
                description: 'Si o No',
                name: 'No',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.YES_NO,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createYesNoNACatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Si, No y No aplica',
                name: 'Si',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.YES_NO_NA,
            },
            {
                code: '2',
                description: 'Si, No y No aplica',
                name: 'No',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.YES_NO_NA,
            },
            {
                code: '3',
                description: 'Si, No y No aplica',
                name: 'No apliaca',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.YES_NO_NA,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createSchoolPeriodsStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: CatalogueSchoolPeriodStateEnum.OPEN,
                description: 'Periodo Lectivo Actual',
                name: 'ABIERTO',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOOL_PERIODS_STATE,
            },
            {
                code: CatalogueSchoolPeriodStateEnum.CLOSE,
                description: 'Periodo Lectivo Histórico',
                name: 'CERRADO',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SCHOOL_PERIODS_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createInstitutionsStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'enabled',
                description: 'Habilitado para escoger',
                name: 'Habilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INSTITUTIONS_STATE,
            },
            {
                code: 'disabled',
                description: 'Inhabilitado para escoger',
                name: 'Inhabilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INSTITUTIONS_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createCareersStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'enabled',
                description: 'Habilitado para escoger',
                name: 'Habilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREERS_STATE,
            },
            {
                code: 'disabled',
                description: 'Inhabilitado para escoger',
                name: 'Inhabilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREERS_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createCareersTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'level_3',
                description: 'Tercer Nivel',
                name: 'Tercer Nivel',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREERS_TYPE,
            },
            {
                code: 'technology',
                description: 'Tecnología,Tecnicatura',
                name: 'Tecnología',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREERS_TYPE,
            },
            {
                code: 'technique',
                description: 'Tecnología,Tecnicatura',
                name: 'Tecnicatura',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CAREERS_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createCurriculumsStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'enabled',
                description: 'Habilitado para escoger',
                name: 'Habilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CURRICULUMS_STATE,
            },
            {
                code: 'disabled',
                description: 'Inhabilitado para escoger',
                name: 'Inhabilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CURRICULUMS_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createSubjectsStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'enabled',
                description: 'Habilitado para escoger',
                name: 'Habilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SUBJECTS_STATE,
            },
            {
                code: 'disabled',
                description: 'Inhabilitado para escoger',
                name: 'Inhabilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SUBJECTS_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createSubjectsTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'subject',
                description: 'Asignatura',
                name: 'Asignatura',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SUBJECTS_TYPE,
            },
            {
                code: 'integrator_project',
                description: 'Proyecto Integrador',
                name: 'Proyecto Integrador',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SUBJECTS_TYPE,
            },
            {
                code: 'practical_phase',
                description: 'Fase Práctica',
                name: 'Fase Práctica',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SUBJECTS_TYPE,
            },
            {
                code: 'leveling',
                description: 'Nivelación',
                name: 'Nivelación',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SUBJECTS_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createParallelsCatalogues() {
        const catalogues = await this.catalogueService.findCache();
        const workdays = catalogues.filter((item: CatalogueEntity) => item.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
        const morning = workdays.find((item: CatalogueEntity) => item.code === 'm');
        const evening = workdays.find((item: CatalogueEntity) => item.code === 'v');

        const newCatalogues: SeedCatalogueParentDto[] = [];

        newCatalogues.push(
            {
                parentId: morning.id,
                code: 'a',
                description: 'A',
                name: 'A',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PARALLEL,
            },
            {
                parentId: morning.id,
                code: 'b',
                description: 'B',
                name: 'B',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PARALLEL,
            },
            {
                parentId: morning.id,
                code: 'c',
                description: 'C',
                name: 'C',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PARALLEL,
            },
            {
                parentId: evening.id,
                code: 'd',
                description: 'D',
                name: 'D',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PARALLEL,
            },
            {
                parentId: evening.id,
                code: 'e',
                description: 'E',
                name: 'E',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PARALLEL,
            },
            {
                parentId: evening.id,
                code: 'f',
                description: 'F',
                name: 'F',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PARALLEL,
            },
        );

        for (const catalogue of newCatalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEnrollmentsTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'ordinary',
                description: 'Ordinaria',
                name: 'Ordinaria',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_TYPE,
            },
            {
                code: 'extraordinary',
                description: 'Extraordinary',
                name: 'Extraordinaria',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_TYPE,
            },
            {
                code: 'especial',
                description: 'Especial',
                name: 'Especial',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEnrollmentsAcademicStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'a',
                description: 'Aprobado',
                name: 'Aprobado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE,
            },
            {
                code: 'r',
                description: 'Reprobado',
                name: 'Reprobado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEnrollmentsWorkdayCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: '07:00-09:00',
                name: '07:00-09:00',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },
            {
                code: '2',
                description: '09:00-11:00',
                name: '09:00-11:00',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },
            {
                code: '3',
                description: '11:00-13:00',
                name: '11:00-13:00',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },
            {
                code: '4',
                description: '13:00-15:00',
                name: '13:00-15:00',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },
            {
                code: '5',
                description: '15:00-17:00',
                name: '15:00-17:00',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },
            {
                code: '6',
                description: '17:00-19:00',
                name: '17:00-19:00',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },
            {
                code: '7',
                description: '19:00-21:00',
                name: '19:00-21:00',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENTS_WORKDAY,
            },

        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEnrollmentsStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'request_sent',
                description: 'Solicitud Enviada',
                name: 'Solicitud Enviada',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_STATE,
            },
            {
                code: 'approved',
                description: 'Aprobado',
                name: 'Aprobado',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_STATE,
            },
            {
                code: 'rejected',
                description: 'Rechazado',
                name: 'Rechazado',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_STATE,
            },
            {
                code: 'enrolled',
                description: 'Matriculado',
                name: 'Matriculado',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_STATE,
            },
            {
                code: 'revoked',
                description: 'Anulado',
                name: 'Anulado',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_STATE,
            },
            {
                code: 'registered',
                description: 'Inscrito',
                name: 'Inscrito',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createClassroomsStateCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'enabled',
                description: 'Habilitado',
                name: 'Habilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CLASSROOMS_STATE,
            },
            {
                code: 'disabled',
                description: 'Inhabilitado',
                name: 'Inhabilitado',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CLASSROOMS_STATE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createClassroomsTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'classroom',
                description: 'Aula',
                name: 'Aula',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CLASSROOMS_TYPE,
            },
            {
                code: 'laboratory',
                description: 'Laboratorio',
                name: 'Laboratorio',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CLASSROOMS_TYPE,
            },
            {
                code: 'workshop',
                description: 'Taller',
                name: 'Taller',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CLASSROOMS_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createStudentLiveCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: CatalogueStudentLiveEnum.ALONE,
                description: 'Solo',
                name: 'Solo',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
            {
                code: CatalogueStudentLiveEnum.BOTH_PARENTS,
                description: 'Ambos Padres',
                name: 'Ambos Padres',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
            {
                code: CatalogueStudentLiveEnum.MOTHER,
                description: 'Madre',
                name: 'Madre',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
            {
                code: CatalogueStudentLiveEnum.FATHER,
                description: 'Padre',
                name: 'Padre',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
            {
                code: CatalogueStudentLiveEnum.SPOUSE,
                description: 'Cónygue / Conviviente',
                name: 'Cónygue / Conviviente',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
            {
                code: CatalogueStudentLiveEnum.GRANDPARENTS,
                description: 'Abuelos',
                name: 'Abuelos',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
            {
                code: CatalogueStudentLiveEnum.OTHER,
                description: 'Otro',
                name: 'Otro',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.STUDENT_LIVE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createHomeOwnershipCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'paid',
                description: 'Propia, Pagada',
                name: 'Propia, Pagada',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_OWNERSHIP,
            },
            {
                code: 'mortgaged',
                description: 'Propia, Hipotecada',
                name: 'Propia, Hipotecada',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_OWNERSHIP,
            },
            {
                code: 'rented',
                description: 'Arrendada',
                name: 'Arrendada',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_OWNERSHIP,
            },
            {
                code: 'family',
                description: 'De un Familiar',
                name: 'De un Familiar',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_OWNERSHIP,
            },
            {
                code: 'shared',
                description: 'Compartida',
                name: 'Compartida',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_OWNERSHIP,
            },
            {
                code: 'other',
                description: 'Otro',
                name: 'Otro',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_OWNERSHIP,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createHomeTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'house',
                description: 'Casa / Villa',
                name: 'Casa / Villa',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
            {
                code: 'department',
                description: 'Departamento',
                name: 'Departamento',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
            {
                code: 'hut',
                description: 'Choza / Covacha',
                name: 'Choza / Covacha',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
            {
                code: 'mediagua',
                description: 'Mediagua',
                name: 'Mediagua',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
            {
                code: 'ranch',
                description: 'Rancho',
                name: 'Rancho',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
            {
                code: 'room',
                description: 'Cuarto',
                name: 'Cuarto',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
            {
                code: 'other',
                description: 'Otro',
                name: 'Otro',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createHomeRoofCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'zinc',
                description: 'Zinc',
                name: 'Zinc',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_ROOF,
            },
            {
                code: 'tile',
                description: 'Teja',
                name: 'Teja',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_ROOF,
            },
            {
                code: 'ternit',
                description: 'Eternit',
                name: 'Eternit',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_ROOF,
            },
            {
                code: 'concrete',
                description: 'Hormigón',
                name: 'Hormigón',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_ROOF,
            },
            {
                code: 'other',
                description: 'Otro',
                name: 'Otro',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_ROOF,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createHomeFloorCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'ceramic',
                description: 'Cerámica / Baldosa',
                name: 'Cerámica / Baldosa',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'vinyl',
                description: 'Vinil',
                name: 'Vinil',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'wood',
                description: 'Madera',
                name: 'Madera',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'untreated_board',
                description: 'Tabla sin tratar',
                name: 'Tabla sin tratar',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'cement',
                description: 'Cemento',
                name: 'Cemento',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'land',
                description: 'Tierra',
                name: 'Tierra',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'cane',
                description: 'Caña',
                name: 'Caña',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'brick',
                description: 'Ladrillo',
                name: 'Ladrillo',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
            {
                code: 'other',
                description: 'Otro',
                name: 'Otro',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_FLOOR,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createHomeWallCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'concrete',
                description: 'Hormigón',
                name: 'Hormigón',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_WALL,
            },
            {
                code: 'brick',
                description: 'Ladrillo',
                name: 'Ladrillo',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_WALL,
            },
            {
                code: 'wood',
                description: 'Madera',
                name: 'Madera',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_WALL,
            },
            {
                code: 'adobe',
                description: 'Adobe',
                name: 'Adobe',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_WALL,
            },
            {
                code: 'cane',
                description: 'Caña',
                name: 'Caña',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_WALL,
            },
            {
                code: 'other',
                description: 'Otro',
                name: 'Otro',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.HOME_WALL,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createFamilyIncomeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: '0-50 dólares',
                name: '0-50 dólares',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
            {
                code: '2',
                description: '51-200 dólares',
                name: '51-200 dólares',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
            {
                code: '3',
                description: '201-400 dólares',
                name: '201-400 dólares',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
            {
                code: '4',
                description: '401-800 dólares',
                name: '401-800 dólares',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
            {
                code: '5',
                description: '801-1000 dólares',
                name: '801-1000 dólares',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
            {
                code: '6',
                description: '1001-2000 dólares',
                name: '1001-2000 dólares',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
            {
                code: '7',
                description: '2001-en adelante',
                name: '2001-en adelante',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_INCOME,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createNationalityCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Ecuatoriana',
                name: 'Ecuatoriana',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '2',
                description: 'Colombiana',
                name: 'Colombiana',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '3',
                description: 'Peruana',
                name: 'Peruana',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '4',
                description: 'Venezolana',
                name: 'Venezolana',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '5',
                description: 'Chilena',
                name: 'Chilena',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '6',
                description: 'Argentina',
                name: 'Argentina',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '7',
                description: 'Brasileña',
                name: 'Brasileña',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '8',
                description: 'Uruguaya',
                name: 'Uruguaya',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '9',
                description: 'Paraguaya',
                name: 'Paraguaya',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '10',
                description: 'Boliviana',
                name: 'Boliviana',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '11',
                description: 'Costarricense',
                name: 'Costarricense',
                sort: 11,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '12',
                description: 'Cubana',
                name: 'Cubana',
                sort: 12,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '13',
                description: 'Salvadoreña',
                name: 'Salvadoreña',
                sort: 13,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '14',
                description: 'Guatemalteca',
                name: 'Guatemalteca',
                sort: 14,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '15',
                description: 'Mexicana',
                name: 'Mexicana',
                sort: 15,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '16',
                description: 'Haitiana',
                name: 'Haitiana',
                sort: 16,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '17',
                description: 'Nicaraguense',
                name: 'Nicaraguense',
                sort: 17,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '18',
                description: 'Estado Unidense',
                name: 'Estado Unidense',
                sort: 18,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '19',
                description: 'Canadiense',
                name: 'Canadiense',
                sort: 19,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
            {
                code: '20',
                description: 'Otra',
                name: 'Otra',
                sort: 20,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.NATIONALITY,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createAncestralLanguageNameCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Andoa',
                name: 'Andoa',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '2',
                description: 'Achuar',
                name: 'Achuar',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '3',
                description: 'Chicham',
                name: 'Chicham',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '4',
                description: 'A’ingae',
                name: 'A’ingae',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '5',
                description: 'Awapit',
                name: 'Awapit',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '6',
                description: 'Baaikoka',
                name: 'Baaikoka',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '7',
                description: 'Cha’palaa',
                name: 'Cha’palaa',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '8',
                description: 'Siapede',
                name: 'Siapede',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '9',
                description: 'Kayapi',
                name: 'Kayapi',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '10',
                description: 'Paaicoca',
                name: 'Paaicoca',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '11',
                description: 'Quichua O Runa Shimi',
                name: 'Quichua O Runa Shimi',
                sort: 11,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '12',
                description: 'Shuar-Chicham',
                name: 'Shuar-Chicham',
                sort: 12,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '13',
                description: 'Sapara',
                name: 'Sapara',
                sort: 13,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '14',
                description: 'Tsafiqui',
                name: 'Tsafiqui',
                sort: 14,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
            {
                code: '15',
                description: 'Waotedeo-Huaotedeo',
                name: 'Waotedeo-Huaotedeo',
                sort: 15,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ANCESTRAL_LANGUAGE_NAME,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createTownCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Chibuleo',
                name: 'Chibuleo',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '2',
                description: 'Cañari',
                name: 'Cañari',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '3',
                description: 'Karanki',
                name: 'Karanki',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '4',
                description: 'Kayambi',
                name: 'Kayambi',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '5',
                description: 'Kisapincha',
                name: 'Kisapincha',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '6',
                description: 'Kitukara',
                name: 'Kitukara',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '7',
                description: 'Panzaleo',
                name: 'Panzaleo',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '8',
                description: 'Natabuela',
                name: 'Natabuela',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '9',
                description: 'Otavalo',
                name: 'Otavalo',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '10',
                description: 'Puruwa',
                name: 'Puruwa',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '11',
                description: 'Palta',
                name: 'Palta',
                sort: 11,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '12',
                description: 'Salasaka',
                name: 'Salasaka',
                sort: 12,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '13',
                description: 'Saraguro',
                name: 'Saraguro',
                sort: 13,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '14',
                description: 'Waranka',
                name: 'Waranka',
                sort: 14,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '15',
                description: 'Huancavilca',
                name: 'Huancavilca',
                sort: 15,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '16',
                description: 'Manta',
                name: 'Manta',
                sort: 16,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '17',
                description: 'Pasto',
                name: 'Pasto',
                sort: 17,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
            {
                code: '18',
                description: 'Kichwa Amazónico',
                name: 'Kichwa Amazónico',
                sort: 18,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TOWN,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createIndigenousNationalityTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Epera',
                name: 'Epera',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '2',
                description: 'Chachi',
                name: 'Chachi',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '3',
                description: 'Awá',
                name: 'Awá',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '4',
                description: 'Tsachila',
                name: 'Tsachila',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '5',
                description: 'Kichwa',
                name: 'Kichwa',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '6',
                description: 'Cofán',
                name: 'Cofán',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '7',
                description: 'Huaorani',
                name: 'Huaorani',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '8',
                description: 'Shuar',
                name: 'Shuar',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '9',
                description: 'Siona',
                name: 'Siona',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '10',
                description: 'Secoya',
                name: 'Secoya',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '11',
                description: 'Zápara',
                name: 'Zápara',
                sort: 11,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '12',
                description: 'Andoa',
                name: 'Andoa',
                sort: 12,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '13',
                description: 'Shiwiar',
                name: 'Shiwiar',
                sort: 13,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
            {
                code: '14',
                description: 'Achuar',
                name: 'Achuar',
                sort: 14,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INDIGENOUS_NATIONALITY,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createForeignLanguageNameCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Inglés',
                name: 'Inglés',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '2',
                description: 'Chino Mandarin',
                name: 'Chino Mandarin',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '3',
                description: 'Hindi',
                name: 'Hindi',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '4',
                description: 'Francés',
                name: 'Francés',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '5',
                description: 'Árabe',
                name: 'Árabe',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '6',
                description: 'Ruso',
                name: 'Ruso',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '7',
                description: 'Portugués',
                name: 'Portugués',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '8',
                description: 'Alemán',
                name: 'Alemán',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '9',
                description: 'Japonés',
                name: 'Japonés',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '10',
                description: 'Italiano',
                name: 'Italiano',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '11',
                description: 'Turco',
                name: 'Turco',
                sort: 11,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '12',
                description: 'Coreano',
                name: 'Coreano',
                sort: 12,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '13',
                description: 'Neerlandés',
                name: 'Neerlandés',
                sort: 13,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '14',
                description: 'Polaco',
                name: 'Polaco',
                sort: 14,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '15',
                description: 'Griego',
                name: 'Griego',
                sort: 15,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
            {
                code: '16',
                description: 'Otro',
                name: 'Otro',
                sort: 16,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FOREIGN_LANGUAGE_NAME,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createContactEmergencyKinshipCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Mamá',
                name: 'Mamá',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '2',
                description: 'Papá',
                name: 'Papá',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '3',
                description: 'Hermano/a',
                name: 'Hermano/a',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '4',
                description: 'Hijo/a',
                name: 'Hijo/a',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '5',
                description: 'Tío',
                name: 'Tío',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '6',
                description: 'Sobrino/a',
                name: 'Sobrino/a',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '7',
                description: 'Tía',
                name: 'Tía',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '8',
                description: 'Vecino',
                name: 'Vecino',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
            {
                code: '9',
                description: 'Otro',
                name: 'Otro',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONTACT_EMERGENCY_KINSHIP,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createFamilyKinshipDisabilityCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Mamá',
                name: 'Mamá',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '2',
                description: 'Papá',
                name: 'Papá',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '3',
                description: 'Hermano/a',
                name: 'Hermano/a',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '4',
                description: 'Hijo/a',
                name: 'Hijo/a',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '5',
                description: 'Tío',
                name: 'Tío',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '6',
                description: 'Sobrino/a',
                name: 'Sobrino/a',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '7',
                description: 'Tía',
                name: 'Tía',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '8',
                description: 'Vecino',
                name: 'Vecino',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
            {
                code: '9',
                description: 'Otro',
                name: 'Otro',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_DISABILITY,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createMonthlySalaryCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: '0-50',
                name: '0-50',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
            {
                code: '2',
                description: '51-200',
                name: '51-200',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
            {
                code: '3',
                description: '201-400',
                name: '201-400',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
            {
                code: '4',
                description: '401-800',
                name: '401-800',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
            {
                code: '5',
                description: '801-1000',
                name: '801-1000',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
            {
                code: '6',
                description: '1001-2000',
                name: '1001-2000',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
            {
                code: '7',
                description: '2001 o más',
                name: '2001 o más',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MONTHLY_SALARY,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createWorkingHoursIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Mañana (4 horas)',
                name: 'Mañana (4 horas)',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WORKING_HOURS
            },
            {
                code: '2',
                description: 'Vespertino (4 horas)',
                name: 'Vespertino (4 horas)',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WORKING_HOURS
            },
            {
                code: '3',
                description: 'Nocturna (4 horas)',
                name: 'Nocturna (4 horas)',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WORKING_HOURS
            },
            {
                code: '4',
                description: 'Día completo (8 horas)',
                name: 'Día completo (8 horas)',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WORKING_HOURS
            },
            {
                code: '5',
                description: 'Velada Completa (8 horas)',
                name: 'Velada Completa (8 horas)',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WORKING_HOURS
            },
            {
                code: '6',
                description: 'Otros',
                name: 'Otros',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WORKING_HOURS
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createChildrenTotalCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Numero de hijos',
                name: '1',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CHILDREN_TOTAL,
            },
            {
                code: '2',
                description: 'Numero de hijos',
                name: '2',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CHILDREN_TOTAL,
            },
            {
                code: '3',
                description: 'Numero de hijos',
                name: '3',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CHILDREN_TOTAL,
            },
            {
                code: '4',
                description: 'Numero de hijos',
                name: '4',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CHILDREN_TOTAL,
            },
            {
                code: '5',
                description: 'Numero de hijos',
                name: '5',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CHILDREN_TOTAL,
            },
            {
                code: '6',
                description: 'Numero de hijos',
                name: '6 o más',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CHILDREN_TOTAL,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createUniversityCarrerIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'En su trayectoria universitaria ha realizado:',
                name: 'Cambio de Universidad',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.UNIVERSITY_CAREER
            },
            {
                code: '2',
                description: 'En su trayectoria universitaria ha realizado:',
                name: 'Cambio de carrera',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.UNIVERSITY_CAREER
            },
            {
                code: '3',
                description: 'En su trayectoria universitaria ha realizado:',
                name: 'Segunda matrícula',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.UNIVERSITY_CAREER
            },
            {
                code: '4',
                description: 'En su trayectoria universitaria ha realizado:',
                name: 'Tercera matrícula',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.UNIVERSITY_CAREER
            },
            {
                code: '5',
                description: 'En su trayectoria universitaria ha realizado:',
                name: 'Realizo reingreso',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.UNIVERSITY_CAREER
            },
            {
                code: '6',
                description: 'En su trayectoria universitaria ha realizado:',
                name: 'No aplica',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.UNIVERSITY_CAREER
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createDegreeSuperiorIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Técnico',
                name: 'Técnico',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DEGREE_SUPERIOR
            },
            {
                code: '2',
                description: 'Tecnológico',
                name: 'Tecnológico',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DEGREE_SUPERIOR
            },
            {
                code: '3',
                description: 'Tercer nivel',
                name: 'Tercer nivel',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DEGREE_SUPERIOR
            },
            {
                code: '4',
                description: 'Cuarto nivel',
                name: 'Cuarto nivel',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DEGREE_SUPERIOR
            },
            {
                code: '5',
                description: 'Otro',
                name: 'Otro',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.DEGREE_SUPERIOR
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createTypeStudyOtherCareerIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Público',
                name: 'Público',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_STUDY_OTHER_CAREER
            },
            {
                code: '2',
                description: 'Particular',
                name: 'Particular',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_STUDY_OTHER_CAREER
            },
            {
                code: '3',
                description: 'Beca',
                name: 'Beca',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_STUDY_OTHER_CAREER
            },
            {
                code: '4',
                description: 'Otro',
                name: 'Otro',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_STUDY_OTHER_CAREER
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createElectronicDeviceIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '2',
                description: 'Computadora de Escritorio',
                name: 'Computadora de Escritorio',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRONIC_DEVICE
            },
            {
                code: '3',
                description: 'Tablet',
                name: 'Tablet',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRONIC_DEVICE
            },
            {
                code: '4',
                description: 'Celular',
                name: 'Celular',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRONIC_DEVICE
            },
            {
                code: '5',
                description: 'Laptop',
                name: 'Laptop',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRONIC_DEVICE
            },
            {
                code: '6',
                description: 'Otro',
                name: 'Otro',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRONIC_DEVICE
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createInternetTypeIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Acceso Telefónico o ADSL',
                name: 'Acceso Telefónico o ADSL',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
            {
                code: '2',
                description: 'Vía Satélite',
                name: 'Vía Satélite',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
            {
                code: '3',
                description: 'Estandar WI-FI',
                name: 'Estandar WI-FI',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
            {
                code: '4',
                description: 'Datos Móviles',
                name: 'Datos Móviles',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
            {
                code: '5',
                description: 'Fibra Óptica',
                name: 'Fibra Óptica',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
            {
                code: '6',
                description: 'Linea Eléctrica',
                name: 'Linea Eléctrica',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
            {
                code: '7',
                description: 'Otro',
                name: 'Otro',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.INTERNET_TYPE
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createMembersHouseNumberCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Integrantes conforman el núcleo familiar',
                name: '1',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '2',
                description: 'Integrantes conforman el núcleo familiar',
                name: '2',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '3',
                description: 'Integrantes conforman el núcleo familiar',
                name: '3',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '4',
                description: 'Integrantes conforman el núcleo familiar',
                name: '4',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '5',
                description: 'Integrantes conforman el núcleo familiar',
                name: '5',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '6',
                description: 'Integrantes conforman el núcleo familiar',
                name: '6',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '7',
                description: 'Integrantes conforman el núcleo familiar',
                name: '7',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '8',
                description: 'Integrantes conforman el núcleo familiar',
                name: '8',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
            {
                code: '9',
                description: 'Integrantes conforman el núcleo familiar',
                name: '9 o más',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.MEMBER_HOUSE_NUMBER,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createFamilyPropiertiesIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Propiedades de la familia',
                name: 'Terrenos',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_PROPERTIES
            },
            {
                code: '2',
                description: 'Propiedades de la familia',
                name: 'Casa',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_PROPERTIES
            },
            {
                code: '3',
                description: 'Propiedades de la familia',
                name: 'Local comercial',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_PROPERTIES
            },
            {
                code: '4',
                description: 'Propiedades de la familia',
                name: 'Bienes',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_PROPERTIES
            },
            {
                code: '5',
                description: 'Propiedades de la familia',
                name: 'Otros',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_PROPERTIES
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createFamilyKinshipCatastrophicIllnessIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Familiar con enefermedad catastrofica',
                name: 'Mamá',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
            },
            {
                code: '2',
                description: 'Familiar con enefermedad catastrofica',
                name: 'Papá',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
            },
            {
                code: '3',
                description: 'Familiar con enefermedad catastrofica',
                name: 'Esposo/a',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
            },
            {
                code: '4',
                description: 'Familiar con enefermedad catastrofica',
                name: 'Hermano/a',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
            },
            {
                code: '5',
                description: 'Familiar con enefermedad catastrofica',
                name: 'Hijo/a',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
            },
            {
                code: '6',
                description: 'Familiar con enefermedad catastrofica',
                name: 'Otros',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.FAMILY_KINSHIP_CATASTROPHIC_ILLNESS
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createWaterServiceTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Servicio de agua',
                name: 'Agua potable',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
            {
                code: '2',
                description: 'Servicio de agua',
                name: 'Agua Lluvia',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
            {
                code: '3',
                description: 'Servicio de agua',
                name: 'Agua de pozo',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
            {
                code: '4',
                description: 'Servicio de agua',
                name: 'Agua de cisterna',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
            {
                code: '5',
                description: 'Servicio de agua',
                name: 'Agua de rio o de ojo de agua',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
            {
                code: '6',
                description: 'Servicio de agua',
                name: 'Agua entubada',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
            {
                code: '7',
                description: 'Servicio de agua',
                name: 'Otros',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.WATER_SERVICE_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createElectricServiceBlackoutCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Frecuencia de apagones',
                name: '1 vez a la semana',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRIC_SERVICE_BLACKOUT,
            },
            {
                code: '2',
                description: 'Frecuencia de apagones',
                name: '3 veces a la semana',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRIC_SERVICE_BLACKOUT,
            },
            {
                code: '3',
                description: 'Frecuencia de apagones',
                name: 'De 2 a 4 veces al mes',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRIC_SERVICE_BLACKOUT,
            },
            {
                code: '4',
                description: 'Frecuencia de apagones',
                name: 'Con frecuencia',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRIC_SERVICE_BLACKOUT,
            },
            {
                code: '5',
                description: 'Frecuencia de apagones',
                name: 'No aplica',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ELECTRIC_SERVICE_BLACKOUT,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createSewerageServiceTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Tipo de Alcantarillado',
                name: 'Alcantarillado estandar',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SEWERAGE_SERVICE_TYPE,
            },
            {
                code: '2',
                description: 'Tipo de Alcantarillado',
                name: 'Fosa septica',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SEWERAGE_SERVICE_TYPE,
            },
            {
                code: '3',
                description: 'Tipo de Alcantarillado',
                name: 'Tuberia a rio o quebrada',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SEWERAGE_SERVICE_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createEconomicContributionIdCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Contribución Economica para el estudiante',
                name: 'Padres',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ECONOMIC_CONTRIBUTION
            },
            {
                code: '2',
                description: 'Contribución Economica para el estudiante',
                name: 'Abuelos',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ECONOMIC_CONTRIBUTION
            },
            {
                code: '3',
                description: 'Contribución Economica para el estudiante',
                name: 'Familiares',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ECONOMIC_CONTRIBUTION
            },
            {
                code: '4',
                description: 'Contribución Economica para el estudiante',
                name: 'Sueldo propio',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ECONOMIC_CONTRIBUTION
            },
            {
                code: '5',
                description: 'Contribución Economica para el estudiante',
                name: 'Otras',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ECONOMIC_CONTRIBUTION
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createConsumeNewsTypeCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Radio',
                name: 'Radio',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONSUME_NEWS_TYPE,
            },
            {
                code: '2',
                description: 'Televisión',
                name: 'Televisión',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONSUME_NEWS_TYPE,
            },
            {
                code: '3',
                description: 'Redes Sociales',
                name: 'Redes Sociales',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONSUME_NEWS_TYPE,
            },
            {
                code: '4',
                description: 'Internet',
                name: 'Internet',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONSUME_NEWS_TYPE,
            },
            {
                code: '5',
                description: 'Periodico/Revistas',
                name: 'Periodico/Revistas',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONSUME_NEWS_TYPE,
            },
            {
                code: '6',
                description: 'Otros',
                name: 'Otros',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.CONSUME_NEWS_TYPE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createTypeGenderViolenceCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Física',
                name: 'Física',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_GENDER_VIOLENCE,
            },
            {
                code: '2',
                description: 'Emocional',
                name: 'Emocional',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_GENDER_VIOLENCE,
            },
            {
                code: '3',
                description: 'Psicológica',
                name: 'Psicológica',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_GENDER_VIOLENCE,
            },
            {
                code: '4',
                description: 'Económica',
                name: 'Económica',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_GENDER_VIOLENCE,
            },
            {
                code: '5',
                description: 'Sexual',
                name: 'Sexual',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_GENDER_VIOLENCE,
            },
            {
                code: '6',
                description: 'Otros',
                name: 'Otros',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_GENDER_VIOLENCE,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createPandemicPsychologicalEffectCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Ansiedad',
                name: 'Ansiedad',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '2',
                description: 'Estrés',
                name: 'Estrés',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '3',
                description: 'Depresión',
                name: 'Depresión',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '4',
                description: 'Soledad',
                name: 'Soledad',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '5',
                description: 'Agotamiento emocional y mental',
                name: 'Agotamiento emocional y mental',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '6',
                description: 'Abuso de sustancias',
                name: 'Abuso de sustancias',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '7',
                description: 'Cambios de comportamiento social',
                name: 'Cambios de comportamiento social',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
            {
                code: '8',
                description: 'Otro',
                name: 'Otro',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.PANDEMIC_PSYCHOLOGICAL_EFFECT,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createTypeInjuriesCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Me cortaba',
                name: 'Me cortaba',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_INJURIES,
            },
            {
                code: '2',
                description: 'Me quemaba la piel',
                name: 'Me quemaba la piel',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_INJURIES,
            },
            {
                code: '3',
                description: 'Me golpeaba',
                name: 'Me golpeaba',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_INJURIES,
            },
            {
                code: '4',
                description: 'Me sacaba el cabello',
                name: 'Me sacaba el cabello',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_INJURIES,
            },
            {
                code: '5',
                description: 'Ingería unas pastillas o jarabe',
                name: 'Ingería unas pastillas o jarabe',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_INJURIES,
            },
            {
                code: '6',
                description: 'Otro',
                name: 'Otro',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_INJURIES,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createTypeDiscriminationCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Edad',
                name: 'Edad',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '2',
                description: 'Género',
                name: 'Género',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '3',
                description: 'Origen étnico',
                name: 'Origen étnico',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '4',
                description: 'Discapacidad',
                name: 'Discapacidad',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '5',
                description: 'Orientación Sexual',
                name: 'Orientación Sexual',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '6',
                description: 'Religioso',
                name: 'Religioso',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '7',
                description: 'Político',
                name: 'Político',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
            {
                code: '8',
                description: 'Otro',
                name: 'Otro',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.TYPE_DISCRIMINATION,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createSocialGroupCatalogues() {
        const catalogues: CreateCatalogueDto[] = [];
        catalogues.push(
            {
                code: '1',
                description: 'Góticos',
                name: 'Góticos',
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '2',
                description: 'Rockeros',
                name: 'Rockeros',
                sort: 2,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '3',
                description: 'Hipsters',
                name: 'Hipsters',
                sort: 3,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '4',
                description: 'Emos',
                name: 'Emos',
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '5',
                description: 'Punks',
                name: 'Punks',
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '6',
                description: 'Rastafaris',
                name: 'Rastafaris',
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '7',
                description: 'Otakus',
                name: 'Otakus',
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '8',
                description: 'Skaters',
                name: 'Skaters',
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP,
            },
            {
                code: '9',
                description: 'Reggaetoneros',
                name: 'Reggaetoneros',
                sort: 9,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP
            },
            {
                code: '10',
                description: 'Hip-Hop',
                name: 'Hip-Hop',
                sort: 10,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP
            },
            {
                code: '11',
                description: 'Ninguno',
                name: 'Ninguno',
                sort: 11,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP
            },
            {
                code: '12',
                description: 'Otro',
                name: 'Otro',
                sort: 12,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.SOCIAL_GROUP
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createFileTypeNewStudentsCatalogues() {
        const catalogues: SeedCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'identification_requirement',
                description: 'Copia de cédula de ciudadanía o pasaporte en el caso de extranjeros. (formato pdf)',
                name: 'Copia de cédula de ciudadanía o pasaporte en el caso de extranjeros. (formato pdf)',
                required: true,
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT,
            },
            {
                code: 'payment',
                description: 'Factura',
                name: 'Factura',
                required: false,
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT,
            },
            {
                code: 'quota_acceptance',
                description: 'Comprobante de aceptación de cupo en el Sistema Nacional de Nivelación y Admisión.',
                name: 'Comprobante de aceptación de cupo en el Sistema Nacional de Nivelación y Admisión.',
                required: true,
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT,
            },
            {
                code: 'photo',
                description: 'Foto actualizada en formato JPG, con fondo blanco y sin ningún accesorio que cubra el rostro',
                name: 'Foto actualizada en formato JPG, con fondo blanco y sin ningún accesorio que cubra el rostro',
                required: true,
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT,
            },
            {
                code: 'title_bachelor',
                description: 'Copia del título de bachiller, o Acta de Grado, o el certificado de registro de título de bachiller',
                name: 'Copia del título de bachiller, o Acta de Grado, o el certificado de registro de título de bachiller',
                required: true,
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT,
            },
            {
                code: 'disability_card',
                description: 'Carnet de Discapacidad',
                name: 'Carnet de Discapacidad',
                required: false,
                sort: 8,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_NEW_STUDENT,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }

    private async createFileTypeOldStudentsCatalogues() {
        const catalogues: SeedCatalogueDto[] = [];
        catalogues.push(
            {
                code: 'identification_requirement',
                description: 'Copia de cédula de ciudadanía o pasaporte en el caso de extranjeros. (formato pdf)',
                name: 'Copia de cédula de ciudadanía o pasaporte en el caso de extranjeros. (formato pdf)',
                required: true,
                sort: 1,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_OLD_STUDENT,
            },
            {
                code: 'payment',
                description: 'Factura, caso de perdida de gratuidad',
                name: 'Factura, caso de perdida de gratuidad',
                required: false,
                sort: 4,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_OLD_STUDENT,
            },
            {
                code: 'quota_acceptance',
                description: 'Comprobante de aceptación de cupo en el Sistema Nacional de Nivelación y Admisión',
                name: 'Comprobante de aceptación de cupo en el Sistema Nacional de Nivelación y Admisión',
                required: true,
                sort: 5,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_OLD_STUDENT,
            },
            {
                code: 'photo',
                description: 'Foto actualizada en formato JPG, con fondo blanco y sin ningún accesorio que cubra el rostro',
                name: 'Foto actualizada en formato JPG, con fondo blanco y sin ningún accesorio que cubra el rostroa',
                required: true,
                sort: 6,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_OLD_STUDENT,
            },
            {
                code: 'disability_card',
                description: 'Carnet del CONADIS en caso de discapacidad',
                name: 'Carnet del CONADIS en caso de discapacidad',
                required: false,
                sort: 7,
                state: CatalogueStateEnum.ENABLED,
                type: CatalogueTypeEnum.ENROLLMENT_FILE_TYPE_OLD_STUDENT,
            },
        );

        for (const catalogue of catalogues) {
            await this.catalogueService.create(catalogue);
        }
    }}
