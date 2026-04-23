import { Inject, Injectable, Res } from '@nestjs/common';
import { CareersService, SubjectsService } from '@core/services';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  CareerEntity, CatalogueEntity,
  EnrollmentEntity, EnrollmentStateEntity,
  StudentEntity,
} from '@core/entities';
import { UserEntity } from '@auth/entities';
import * as XLSX from 'xlsx';
import * as qr from 'qrcode';
import { join } from 'path';
import { CoreRepositoryEnum } from '@shared/enums';
import { EnrollmentSqlService } from './enrollment-sql.service';

const { PDFDocument } = require('pdfkit-table-ts');
const blobStream = require('blob-stream');

@Injectable()
export class EnrollmentReportsService {
  private imageHeaderPath = './resources/images/reports/header.png';
  private imageFooterPath = `./resources/images/reports/footer.png`;
  private imageHeaderWidth = 110;
  private imageHeaderHeight = 80;

  constructor(
    private readonly enrollmentSqlService: EnrollmentSqlService,
    private readonly careersService: CareersService,
    private readonly subjectsService: SubjectsService,
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly studentRepository: Repository<StudentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>) {
  }

  async generateEnrollmentCertificate(@Res() res: Response, id: string) {
    const enrollment = await this.enrollmentSqlService.findEnrollmentCertificateByEnrollment(id);

    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      align: 'center',
    });

    doc.pipe(res);
    const textX = 50;
    const textY = 80;
    const textW = 500;

    const enrollmentCode = `${enrollment.schoolPeriod.shortName}-${enrollment.career.acronym}-${enrollment.student.user.identification}`;
    const text = `Por medio del presente, en mi calidad de Secretaria General del Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac, CERTIFICO que, de conformidad con el Sistema Integral Académico, el/la estudiante  ${enrollment.student.user.name} ${enrollment.student.user.lastname} con el número de identificación ${enrollment.student.user.identification}, se encuentra legalmente matriculado en esta Institución de Educación Superior, en la carrera de  ${enrollment.career.name}, periodo académico ${enrollment.schoolPeriod.name}, en las siguientes asignaturas:`;
    const currentDate = new Date();
    const day = format(currentDate, 'd', { locale: es }); // Formato numérico del día
    const formattedDate = format(currentDate, 'dd \'de\' MMMM \'de\' yyyy', { locale: es });
    const fechaCompleta = `${formattedDate.replace('dd', day)}`;
    //Inicio del Documento
    doc.image(this.imageHeaderPath, 35, 20, {
      align: 'center',
      width: this.imageHeaderWidth,
      height: this.imageHeaderHeight,
    });


    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(18).text('CERTIFICADO DE MATRÍCULA', textX + 110);
    doc.moveDown();
    doc.font('Helvetica');
    doc.fontSize(11);
    doc.text(`Quito, ${fechaCompleta}`, textX + 330);
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.fontSize(11);
    doc.text('MATRICULA:  ' + enrollmentCode, textX);



    doc.font('Helvetica');
    doc.fontSize(11);
    doc.lineGap(6);
    doc.text(text, textX, textY + 130, {
      width: 460,
      align: 'justify',
    });
    doc.moveDown(2);

    const rows = [];

    enrollment.enrollmentDetails.forEach(enrollmentDetail => {
      const list = [
        enrollmentDetail.subject.code,
        enrollmentDetail.subject.name,
        enrollmentDetail.subject.academicPeriod.name,
        enrollmentDetail.number,
        enrollmentDetail.parallel.name,
        enrollmentDetail.enrollmentDetailStates[0].state.name,
      ];
      rows.push(list);
    });

    const table = {
      headers: ['Código', 'Asignatura', 'Nivel', 'Num.', 'Paralelo', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [50, 240, 50, 30, 40, 50] });

    const qrData = `http://localhost:3000/api/v1/enrollment-reports/${enrollment.studentId}/certificate`;
    const qrImageBuffer = await qr.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      scale: 6,
    });

    // doc.image(qrImageBuffer, textX + 180, textY + 390, { width: 100 });

    doc.font('Helvetica').fontSize(11).text('AB. ANA KARINA PERALTA VELASQUEZ', textX + 130, textY + 575);
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('SECRETARIA GENERAL', textX + 175, textY + 595);
    doc.moveDown();
    doc.text('INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO YAVIRAC', textX + 5, textY + 615, { align: 'center' });
    //doc.font('Helvetica').fontSize(8).text('Revisado por: A. M.', textX + 355, textY + 630);
    doc.moveDown();
    doc.font('Helvetica').fontSize(8).text('Revisado por: A. M.', textX + 355);
    //Footer: Add page number
    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it

    doc
      .fontSize('7')
      .text(`Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec`, 50, doc.page.height - oldBottomMargin / 2 - 20, {
        align: 'center',
      });

    doc.text(`Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac`, 20, doc.page.height - oldBottomMargin / 2 - 10, {
      align: 'center',
    });

    doc.end();
  }

  async generateEnrollmentApplication(@Res() res: Response, id: string) {
    const enrollment = await this.enrollmentSqlService.findEnrollmentCertificateByEnrollment(id);

    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      align: 'center',
    });

    doc.pipe(res);
    const textX = 50;
    const textY = 80;
    const textW = 500;

    const text = `Nombre: ${enrollment.student.user.name} ${enrollment.student.user.lastname}; Cedula: ${enrollment.student.user.identification}; Carrera: ${enrollment.career.name}; Ciclo: ${enrollment.schoolPeriod.name}.`;
    const currentDate = new Date();
    const day = format(currentDate, 'd', { locale: es }); // Formato numérico del día
    const formattedDate = format(currentDate, 'dd \'de\' MMMM \'de\' yyyy', { locale: es });
    const fechaCompleta = `${formattedDate.replace('dd', day)}`;
    //Inicio del Documento
    doc.image(this.imageHeaderPath, 35, 20, {
      align: 'center',
      width: this.imageHeaderWidth,
      height: this.imageHeaderHeight,
    });

    doc.moveDown();
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.text(`Quito, ${fechaCompleta}`, textX + 320);
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(18).text('REPORTE DE MATRÍCULA', textX + 100);
    doc.moveDown();

    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.lineGap(7);
    doc.text(`Nombre: ${enrollment.student.user.name} ${enrollment.student.user.lastname}`, textX, textY + 80);
    doc.text(`Cedula: ${enrollment.student.user.identification}`, textX, textY + 95);
    doc.text(`Carrera: ${enrollment.career.name}`, textX, textY + 110);
    doc.text(`Ciclo: ${enrollment.schoolPeriod.name}`, textX, textY + 125);
    doc.moveDown(2);

    const rows = [];

    enrollment.enrollmentDetails.forEach(enrollmentDetail => {
      const list = [
        enrollmentDetail.subject.code,
        enrollmentDetail.subject.name,
        enrollmentDetail.subject.academicPeriod.name,
        enrollmentDetail.number,
        enrollmentDetail.parallel.name,
        enrollmentDetail.enrollmentDetailStates[0].state.name,
      ];
      rows.push(list);
    });

    const table = {
      headers: ['Código', 'Asignatura', 'Nivel', 'Num.', 'Paralelo', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [60, 220, 60, 30, 40, 50] });

    doc.moveDown();
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.text(`NOTA: ESTE DOCUMENTO ES ÚNICAMENTE INFORMATIVO, NO TIENE NINGUNA VALIDEZ LEGAL`, textX, textY + 560)

    //Footer: Add page number
    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it

    doc
      .fontSize('6')
      .text(`Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec`, 50, doc.page.height - oldBottomMargin / 2 - 20, {
        align: 'center',
      });

    doc.text(`Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac`, 20, doc.page.height - oldBottomMargin / 2 - 10, {
      align: 'center',
    });

    doc.end();
  }

  async generateEnrollmentsByCareer(careerId: string, schoolPeriodId: string) {
    const data = await this.enrollmentSqlService.findEnrollmentsByCareer(careerId, schoolPeriodId);

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Estudiantes');
    const path = join(process.cwd(), 'storage/reports/enrollments', Date.now() + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }

  async generateEnrollmentsBySchoolPeriod(schoolPeriodId: string) {
    const data = await this.enrollmentSqlService.findEnrollmentsBySchoolPeriod(schoolPeriodId);

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Estudiantes');
    const path = join(process.cwd(), 'storage/reports/enrollments', Date.now() + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }

  async generateEnrollmentDetailsBySchoolPeriod(schoolPeriodId: string) {
    const data = await this.enrollmentSqlService.findEnrollmentDetailsBySchoolPeriod(schoolPeriodId);

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Estudiantes');
    const path = join(process.cwd(), 'storage/reports/enrollments', Date.now() + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }

  async generateAcademicRecordByStudent(@Res() res: Response, studentId: string, careerId: string) {
    const enrollments = await this.enrollmentSqlService.findAcademicRecordByStudent(studentId, careerId);
    const careers = await this.careersService.findOne(careerId);
    const student = await this.studentRepository.findOne({
        where: { id: studentId },
        relations: { user: true },
      },
    );


    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      align: 'center',
    });

    doc.image(this.imageHeaderPath, 35, 20, {
      align: 'center',
      width: this.imageHeaderWidth,
      height: this.imageHeaderHeight,
    });

    doc.moveDown('2');

    doc.pipe(res);
    const title = `INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO YAVIRAC`;
    const career = `${careers.name}`;
    doc
      .fontSize('12')
      .font('Helvetica-Bold')
      .text(title, {
        align: 'center',
      });

    doc.moveDown();

    doc
      .font('Times-Roman')
      .fontSize('9')
      .text(career, {
        align: 'center',
      });

    doc.moveDown();

    doc
      .font('Times-Roman')
      .fontSize('8')
      .text(careers.codeSniese, {
        align: 'center',
      });

    doc.moveDown();

    doc
      .font('Times-Roman')
      .fontSize('9')
      .text(`PROGRAMA DE RECONOCIMIENTO DE TRAYECTORIAS DE LOS CONOCIMIENTOS Y EXPERIENCIAS DE LAS SABIAS Y SABIOS 
    `, {
        align: 'center',
      });

    doc.moveDown();

    doc
      .font('Helvetica-Bold')
      .fontSize('20')
      .text(`RÉCORD ACADÉMICO`, {
        align: 'center',
      });

    doc.moveDown();

    doc
      .font('Times-Bold')
      .fontSize('10')
      .text(`Nombre: `, {
        continued: true,
      })
      .font('Times-Roman')
      .text(`${student.user.name} ${student.user.lastname}`);

    doc
      .font('Times-Bold')
      .fontSize('10')
      .text(`Cédula: `, {
        continued: true,
      })
      .font('Times-Roman')
      .text(student.user.identification);

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd \'de\' MMMM \'de\' yyyy', { locale: es });
    doc
      .font('Times-Bold')
      .fontSize('10')
      .text(`Fecha: `, {
        continued: true,
      })
      .font('Times-Roman')
      .text(formattedDate);

    const finalGrade = [];

    enrollments.forEach(enrollment => {
      enrollment.enrollmentDetails.forEach(enrollmentDetail => {


        const list = [
          enrollmentDetail.finalGrade,
        ];
        finalGrade.push(list);
      });
    });

    doc
      .font('Times-Bold')
      .fontSize('10')
      .text(`Promedio: `, {
        continued: true,
      })
      .font('Times-Roman')
      .text(finalGrade[0]);

    doc.moveDown('2');

    const rows = [];

    enrollments.forEach(enrollment => {
      enrollment.enrollmentDetails.forEach(enrollmentDetail => {


        const list = [
          enrollment.schoolPeriod.shortName,
          enrollmentDetail.subject.code,
          enrollmentDetail.subject.name,
          enrollmentDetail.subject.academicPeriod.name,
          enrollmentDetail.number,
          enrollmentDetail.grades,
          enrollmentDetail.enrollmentDetailState.state.name,
        ];
        rows.push(list);
      });
    });

    const table = {
      headers: ['PAO', 'Código Asignatura', 'Asignatura', 'Nivel', 'Num. Matrícula', 'Calificación', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [40, 60, 160, 50, 50, 50, 50] });

    doc.moveDown();

    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    const sectionWidth = doc.page.width / 2 - 50;
    const sectionHeight = 20;

    const yPositionSections = doc.page.height - oldBottomMargin / 2 - 100;

    doc.font('Times-Bold').fontSize('12').text('DIRECCIÓN DE CARRERA', 50, yPositionSections, { width: sectionWidth, align: 'center' });

    doc
      .font('Times-Bold')
      .fontSize('12')
      .text(
        'SECRETARIA DE CARRERA',
        doc.page.width / 2 + 50,
        yPositionSections,
        { width: sectionWidth, align: 'left' }, // Modificado para centrar
      );

    doc
      .font('Times-Bold')
      .fontSize('12')
      .text(
        `INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO YAVIRAC`,
        doc.page.width / 4 - 70,
        yPositionSections + sectionHeight + 10,
        { align: 'center' },
      );

    doc
      .fontSize('7')
      .text(
        `Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac`,
        80,
        doc.page.height - oldBottomMargin / 2 - 40,
        { align: 'center' },
      );

    doc.end();
  }
}