import { Inject, Injectable, Res } from '@nestjs/common';
import { CareersService, SubjectsService } from '@core/services';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CareerEntity, CatalogueEntity, EnrollmentEntity, EnrollmentStateEntity, StudentEntity } from '@core/entities';
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
  private background = `./resources/images/reports/background_v.png`;
  private imageHeaderWidth = 110;
  private imageHeaderHeight = 80;

  constructor(
    private readonly enrollmentSqlService: EnrollmentSqlService,
    private readonly careersService: CareersService,
    private readonly subjectsService: SubjectsService,
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly studentRepository: Repository<StudentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>,
  ) {}

  async generateEnrollmentCertificate(@Res() res: Response, id: string) {
    const enrollment = await this.enrollmentSqlService.findEnrollmentCertificateByEnrollment(id);

    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      align: 'center',
    });

    doc.pipe(res);
    const textX = 50;
    const textY = 120;
    const textW = 500;

    // Tamaño de la página
    const width = doc.page.width;
    const height = doc.page.height;

    // Dibujar como fondo
    doc.image(this.background, 0, 0, {
      width: width,
      height: height,
    });

    const enrollmentCode = `${enrollment.schoolPeriod.shortName}-${enrollment.career.acronym}-${enrollment.student.user.identification}`;
    const text = `Por medio del presente, en mi calidad de Coordinadora del Centro de Inglés Yavirac, CERTIFICO que, de conformidad con el Sistema Integral Académico, el/la estudiante  ${enrollment.student.user.name} ${enrollment.student.user.lastname} con el número de identificación ${enrollment.student.user.identification}, se encuentra legalmente matriculado/a, en el ciclo ${enrollment.schoolPeriod.name}, en el siguiente nivel:`;
    const currentDate = new Date();
    const day = format(currentDate, 'd', { locale: es }); // Formato numérico del día
    const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const fechaCompleta = `${formattedDate.replace('dd', day)}`;
    //Inicio del Documento
    // doc.image(this.imageHeaderPath, 35, 20, {
    //   align: 'center',
    //   width: this.imageHeaderWidth,
    //   height: this.imageHeaderHeight,
    // });

    doc.moveDown(3);
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('CERTIFICADO DE MATRÍCULA', textX + 110);
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
        enrollmentDetail.workday.name,
        enrollmentDetail.enrollmentDetailStates[0].state.name,
      ];
      rows.push(list);
    });

    const table = {
      headers: ['Código', 'Asignatura', 'Nivel', 'Num. Matr', 'Paralelo', 'Horario', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [60, 150, 60, 60, 40, 80, 50] });

    const qrData = `http://localhost:3000/api/v1/enrollment-reports/${enrollment.studentId}/certificate`;
    const qrImageBuffer = await qr.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 1,
      scale: 6,
    });

    // doc.image(qrImageBuffer, textX + 180, textY + 390, { width: 100 });

    doc
      .font('Helvetica')
      .fontSize(11)
      .text('MSc. LORENA MALDONADO MORENO', textX + 135, textY + 575);
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('COORDINADORA DEL CENTRO DE INGLÉS YAVIRAC', textX + 110, textY + 595);
    doc.moveDown();

    //Footer: Add page number
    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it

    doc
      .fontSize('7')
      .text(`Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec`, 50, doc.page.height - oldBottomMargin / 2 - 40, {
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

    // Tamaño de la página
    const width = doc.page.width;
    const height = doc.page.height;

    // Dibujar como fondo
    doc.image(this.background, 0, 0, {
      width: width,
      height: height,
    });

    const text = `Nombre: ${enrollment.student.user.name} ${enrollment.student.user.lastname}; Cedula: ${enrollment.student.user.identification}; Carrera: ${enrollment.career.name}; Ciclo: ${enrollment.schoolPeriod.name}.`;
    const currentDate = new Date();
    const day = format(currentDate, 'd', { locale: es }); // Formato numérico del día
    const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const fechaCompleta = `${formattedDate.replace('dd', day)}`;
    //Inicio del Documento

    doc.moveDown();
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.text(`Quito, ${fechaCompleta}`, textX + 320);
    doc.moveDown(2);
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('REPORTE DE MATRÍCULA', textX + 100);
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
        enrollmentDetail.workday.name,
        enrollmentDetail.enrollmentDetailStates[0].state.name,
      ];
      rows.push(list);
    });

    const table = {
      headers: ['Código', 'Asignatura', 'Nivel', 'Num. Matr.', 'Paralelo', 'Horario', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [60, 150, 60, 60, 40, 80, 50] });

    doc.moveDown();
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.text(`NOTA: ESTE DOCUMENTO ES ÚNICAMENTE INFORMATIVO, NO TIENE NINGUNA VALIDEZ LEGAL`, textX, textY + 560);

    //Footer: Add page number
    const oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it

    doc
      .fontSize('6')
      .text(`Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec`, 50, doc.page.height - oldBottomMargin / 2 - 25, {
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
    });

    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      align: 'center',
    });

    const textX = 50;
    const textY = 80;
    const textW = 500;

    // Tamaño de la página
    const width = doc.page.width;
    const height = doc.page.height;

    doc.image(this.background, 0, 0, {
      width: width,
      height: height,
    });

    doc.image(this.imageHeaderPath, (doc.page.width - 50) / 2, 135, {
      width: 50,
      height: 50,
    });

    doc.pipe(res);

    const career = `${careers.name}`;

    doc.moveDown('3');

    doc.font('Times-Roman').fontSize('18').text(career, {
      align: 'center',
    });

    doc.moveDown('3');

    doc.font('Helvetica-Bold').fontSize('20').text(`RÉCORD ACADÉMICO`, {
      align: 'center',
    });

    doc.moveDown();

    doc
      .font('Times-Roman')
      .fontSize('12')
      .text(
        `El ${career} certifica que ${student.user.name} ${student.user.lastname}, con cédula de ciudadanía ${student.user.identification}, ha obtenido las siguientes calificaciones durante su permanencia en este centro: `,
        {
          align: 'justify',
        },
      );

    const currentDate = new Date();
    let formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: es });

    const finalGrade = [];

    enrollments.forEach(enrollment => {
      enrollment.enrollmentDetails.forEach(enrollmentDetail => {
        const list = [enrollmentDetail.finalGrade];
        finalGrade.push(list);
      });
    });

    doc.moveDown('2');

    const rows = [];

    enrollments.forEach(enrollment => {
      enrollment.enrollmentDetails.forEach(enrollmentDetail => {
        const state =
          enrollmentDetail.observation != null
            ? `${enrollmentDetail.academicState?.name}\n${enrollmentDetail.observation}`
            : enrollmentDetail.academicState?.name;

        const list = [enrollmentDetail.subject.name, enrollment.schoolPeriod.shortName, enrollmentDetail.finalGrade, enrollmentDetail.finalAttendance, state];
        rows.push(list);
      });
    });

    const table = {
      headers: ['Nivel', 'Periodo', 'Promedio', 'Asistencia', 'Estado'],
      rows: rows,
    };

    await doc.table(table, { align: 'center', columnsSize: [80, 100, 80, 80, 100] });

    doc.moveDown();
    doc.x = doc.page.margins.left;

    doc.font('Times-Roman').fontSize('12').text(`Es todo cuanto se puede informar.`, {
      align: 'left',
      continue: true,
    });

    doc.moveDown();

    doc.font('Times-Roman').fontSize('12').text(`Quito, ${formattedDate}`, {
      align: 'left',
    });

    const pageWidth = doc.page.width;
    const margin = 50;
    const textWidth = pageWidth - margin * 2;

    // Posición cerca del final de la hoja
    const y = doc.page.height - 150;

    doc.font('Times-Roman').fontSize(12).text('MSc. Lorena Maldonado Moreno', margin, y, {
      width: textWidth,
      align: 'center',
    });

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('COORDINADORA YAVIRAC ENGLISH CENTER', margin, y + 20, {
        width: textWidth,
        align: 'center',
      });

    doc.font('Times-Roman').fontSize('8').text(`Información tomada de los repositorios digitales emitidos por los docentes del YEC`, {
      align: 'center',
    });


    formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss", { locale: es });

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(`Generado por el sistema SISYEC el ${formattedDate}`, margin, y + 65, {
        width: textWidth,
        align: 'right',
      });

    doc.end();
  }
}
