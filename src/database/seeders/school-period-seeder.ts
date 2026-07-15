import {Injectable} from '@nestjs/common';
import {SeedSchoolPeriodDto} from '@core/dto';
import {CatalogueEntity} from 'src/modules/core/entities/catalogue.entity';
import {CataloguesService, InstitutionsService, SchoolPeriodsService} from '@core/services';
import {CatalogueTypeEnum} from '@shared/enums';
import * as XLSX from "xlsx";
import {join} from "path";

@Injectable()
export class SchoolPeriodSeeder {
    constructor(private schoolsPeriod: SchoolPeriodsService,
                private cataloguesService: CataloguesService,
                private institutionsService: InstitutionsService) {
    }

    async run() {
        await this.createSchoolPeriod();
    }

    private async createSchoolPeriod() {
        const schoolPeriods: SeedSchoolPeriodDto[] = [];
        const catalogues = await this.cataloguesService.findCache();
        const institution = ((await this.institutionsService.findAll()).data)[0];

        const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/school_periods.xlsx'));

        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        for (const item of dataExcel) {
            const state = catalogues.find((catalogue: CatalogueEntity) => catalogue.code === item['state'] && catalogue.type === CatalogueTypeEnum.SCHOOL_PERIODS_STATE);

            const schoolPeriod: SeedSchoolPeriodDto = {
                code: item['code'],
                codeSniese: item['code'],
                isVisible: true,
                name: item['name'],
                shortName: item['short_name'],
                startedAt: new Date(item['started_at']),
                endedAt: new Date(item['ended_at']),
                ordinaryStartedAt: new Date(item['ordinary_started_at']),
                ordinaryEndedAt: new Date(item['ordinary_ended_at']),
                extraOrdinaryStartedAt: new Date(item['extraOrdinary_started_at']),
                extraOrdinaryEndedAt: new Date(item['extraOrdinary_ended_at']),
                especialStartedAt: new Date(item['especial_started_at']),
                especialEndedAt: new Date(item['especial_ended_at']),
                state,
            };
            schoolPeriods.push(schoolPeriod);
        }

        for (const item of schoolPeriods) {
            await this.schoolsPeriod.create(item);
        }
    }
}
