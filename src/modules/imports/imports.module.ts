import {Global, Module} from '@nestjs/common';
import {DatabaseModule} from '@database';
import {GradesController, MigrationController} from './controllers';
import {GradesService} from './services/grades.service';
import {TeachersController} from './controllers';
import {TeachersService} from './services/teachers.service';
import {EnrollmentsController} from './controllers/enrollments.controller';
import {EnrollmentsService} from './services/enrollments.service';
import {SubjectsController} from './controllers/subjects.controller';
import {SubjectsService} from './services/subjects.service';
import {StudentsService} from './services/students.service';
import {StudentsController} from './controllers/students.controller';
import {RolesService} from '@auth/services';
import {TeacherDistributionsController} from './controllers/teacher-distributions.controller';
import {TeacherDistributionsService} from './services/teacher-distributions.service';
import {EnrollmentSubjectsService} from "./services/enrollment-subjects.service";
import {EnrollmentSubjectsController} from "./controllers/enrollment-subjects.controller";
import {CareerTeacherAssignmentsController} from "./controllers/career-teacher-assignments.controller";
import {CareerTeacherAssignmentsService} from "./services/career-teacher-assignments.service";
import {MigrationService} from "./services/migration.service";
import { PlacementTestsController } from './controllers/placement-tests.controller';
import { PlacementTestsService } from './services/placement-tests.service';


@Global()
@Module({
    imports: [DatabaseModule],
    controllers: [GradesController,
        TeachersController,
        EnrollmentsController,
        SubjectsController,
        StudentsController,
        TeacherDistributionsController,
        EnrollmentSubjectsController,
        CareerTeacherAssignmentsController,
        MigrationController,
      PlacementTestsController
    ],
    providers: [
        GradesService,
        TeachersService,
        EnrollmentsService,
        SubjectsService,
        StudentsService,
        RolesService,
        TeacherDistributionsService,
        EnrollmentSubjectsService,
        CareerTeacherAssignmentsService,
        MigrationService,
      PlacementTestsService
    ],
    exports: [],
})
export class ImportsModule {

}
