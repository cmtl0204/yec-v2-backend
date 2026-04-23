import { Inject, Injectable, Res } from '@nestjs/common';
import {EnrollmentEntity, StudentEntity} from '@core/entities';
import {differenceInYears, format} from 'date-fns';
import {StudentSqlService} from './student-sql.service';
import * as XLSX from 'xlsx';
import {join} from 'path';
import {TDocumentDefinitions} from "pdfmake/interfaces";
import {PrinterService} from "./printer.service";
import {studentCardReport} from "../templates/student-card.report";
import { ConfigType } from '@nestjs/config';
import { config } from '@config';


const {PDFDocument} = require('pdfkit-table-ts');
const blobStream = require('blob-stream');

@Injectable()
export class StudentReportsService {
    private imageHeaderPath = './resources/images/reports/header.png';
    private imageFooterPath = `./resources/images/reports/footer.png`;
    private imageHeaderWidth = 90;
    private imageHeaderHeight = 45;

    constructor(
        private readonly studentSqlService: StudentSqlService,
        private readonly printerService: PrinterService,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
    ) {
    }

    async generateSocioeconomicForm(id: string) {
        const response = (await this.studentSqlService.findSocioeconomicForm(id)) as StudentEntity;

        try {
            const doc = new PDFDocument({
                size: 'A4',
                bufferPages: true,
                align: 'center',
            });


            //Documento
            const textX = 40;
            const textY = 80;
            const textW = 500;
            const fontsize = 9;

            doc.font('Helvetica-Bold');
            doc.fontSize('10');

            doc.rect(textX, textY + 20, textW, 675); //Rectangulo grande
            doc.rect(textX + 180, textY + 20, 0.1, 50);//Fila 1
            doc.rect(textX, textY + 45, textW, 0.1);
            doc.rect(textX + 400, textY + 45, 0.1, 25);
            doc.rect(textX, textY + 70, textW, 0.1);//Fila 3
            doc.rect(textX, textY + 95, textW, 0.1);
            doc.rect(textX + 290, textY + 70, 0.1, 75);//Fila 6
            doc.rect(textX, textY + 120, textW, 0.1);
            doc.rect(textX + 145, textY + 120, 0.1, 50);
            doc.rect(textX + 380, textY + 120, 0.1, 25);//Fila 8
            doc.rect(textX, textY + 145, textW, 0.1);//Fila 10
            doc.rect(textX + 315, textY + 145, 0.1, 25);
            doc.rect(textX, textY + 170, textW, 0.1);//Fila 14
            doc.rect(textX + 245, textY + 170, 0.1, 125);
            doc.rect(textX, textY + 195, textW, 0.1);//Fila 15
            doc.rect(textX, textY + 220, textW, 0.1);//Fila 16
            doc.rect(textX + 245, textY + 245, textW - 245, 0.1);
            doc.rect(textX, textY + 270, textW, 0.1);//Fila 17
            doc.rect(textX, textY + 295, textW, 0.1);//Fila 20
            doc.rect(textX + 135, textY + 295, 0.1, 25);
            doc.rect(textX + 275, textY + 295, 0.1, 25);
            doc.rect(textX, textY + 320, textW, 0.1);//Fila 22.2
            doc.rect(textX + 170, textY + 320, 0.1, 25);
            doc.rect(textX + 330, textY + 320, 0.1, 25);
            doc.rect(textX, textY + 345, textW, 0.1);//Fila 21
            doc.rect(textX + 245, textY + 345, 0.1, 25);
            doc.rect(textX, textY + 370, textW, 0.1);//Fila 23 piso
            doc.rect(textX + 170, textY + 370, 0.1, 25);
            doc.rect(textX + 280, textY + 370, 0.1, 25);
            doc.rect(textX, textY + 395, textW, 0.1);//Fila 26
            doc.rect(textX + 250, textY + 395, 0.1, 25);
            doc.rect(textX, textY + 420, textW, 0.1);//Fila 27
            doc.rect(textX + 150, textY + 420, 0.1, 25);
            doc.rect(textX, textY + 445, textW, 0.1);//Fila 28
            doc.rect(textX + 150, textY + 445, 0.1, 25);
            doc.rect(textX + 330, textY + 445, 0.1, 25);
            doc.rect(textX, textY + 470, textW, 0.1);//Fila 30
            doc.rect(textX + 220, textY + 470, 0.1, 75);
            doc.rect(textX, textY + 495, textW, 0.1);//Fila 31.1
            doc.rect(textX, textY + 520, textW, 0.1);//Fila 39
            doc.rect(textX, textY + 545, textW, 0.1);//Fila 40
            doc.rect(textX, textY + 575, textW, 0.1);//Fila "LUGAR DE RESIDENCIA"
            doc.rect(textX + 65, textY + 575, 0.1, 35);
            doc.rect(textX + 142, textY + 575, 0.1, 35);
            doc.rect(textX + 287, textY + 575, 0.1, 35);
            doc.rect(textX, textY + 610, textW, 0.1);//Fila 41
            doc.rect(textX + 225, textY + 610, 0.1, 27);
            doc.rect(textX, textY + 637, textW, 0.1);//Fila 45
            doc.rect(textX + 250, textY + 637, 0.1, 30);
            doc.rect(textX, textY + 667, textW, 0.1);//Fila 46 PISO
            doc.rect(textX + 195, textY + 667, 0.1, 27);
            doc.rect(textX + 345, textY + 667, 0.1, 27);
            doc.stroke();

            doc.fontSize('9');

            doc.text('1. Tipo de documento:', textX + 5, textY + 30);
            doc.text('2. Apellidos y nombres del estudiante:', textX + 190, textY + 30);// Sigueinte fila

            doc.text('3. Número de documento:', textX + 5, textY + 55);
            doc.text('4. Fecha de nacimiento:', textX + 190, textY + 55);
            doc.text('5. Edad:', textX + 405, textY + 55);// Sigueinte fila

            doc.text('6. Correo electrónico institucional: ', textX + 5, textY + 77);
            doc.text('8. Correo electrónico personal: ', textX + 5, textY + 102);// Sigueinte fila

            doc.text('7. No. Celular:', textX + 300, textY + 77);
            doc.text('9. No. Convencional:', textX + 300, textY + 102);// Sigueinte fila

            doc.text('10. Estado civil:', textX + 5, textY + 128);
            doc.text('11. Nacionalidad:', textX + 150, textY + 128);
            doc.text('12. Sexo:', textX + 295, textY + 128);
            doc.text('13. Genero:', textX + 385, textY + 128);// Sigueinte fila

            doc.text('14. Autoidentificación:', textX + 5, textY + 148);
            doc.text('14.1 Nacionalidad indigena:', textX + 150, textY + 148);
            doc.text('14.2 Pueblo al que pertenece:', textX + 320, textY + 148); // Sigueinte fila

            doc.text('15. Habla alguna lengua ancestral:', textX + 5, textY + 178);
            doc.text('15.1 Indique la lengua ancestral:', textX + 250, textY + 178);// Sigueinte fila

            doc.text('16. Habla alguna lengua extranjera:', textX + 5, textY + 203);
            doc.text('16.1 Indique la lengua extranjera:', textX + 250, textY + 203);// Sigueinte fila

            doc.text('17. Nombre contacto de emergencia:', textX + 5, textY + 230);
            doc.text('18. Número contacto de emergencia:', textX + 250, textY + 227);
            doc.text('19. Parentesco:', textX + 250, textY + 253);// Sigueinte fila

            doc.text('20. ¿El estudiante trabaja?:', textX + 5, textY + 278);
            doc.text('20.1 Cargo que desempeña:', textX + 250, textY + 278);// Sigueinte fila

            doc.text('20.2 Sueldo mensual:', textX + 5, textY + 298);
            doc.text('20.3 Horario de trabajo:', textX + 140, textY + 298);
            doc.text('20.4 Domicilio de trabajo:', textX + 280, textY + 298);// Sigueinte fila

            doc.text('21. Tiene hijos:', textX + 5, textY + 328);
            doc.text('21.1 Cuantos hijos :', textX + 175, textY + 328);
            doc.text('22. Es jefe de hogar:', textX + 335, textY + 328); // Sigueinte fila

            doc.text('23. Esta afiliado al seguro social:', textX + 5, textY + 353);
            doc.text('24. Posee seguro de salud privada:', textX + 250, textY + 353);// Sigueinte fila

            doc.text('26. Tiene alguna discapacidad:', textX + 5, textY + 378);
            doc.text('26.1 Tipo:', textX + 180, textY + 378);
            doc.text('26.2 Porcentaje de discapacidad:', textX + 300, textY + 378);// Sigueinte fila

            doc.text('27. Tiene alguna enfermedad catastrófica:', textX + 5, textY + 403);
            doc.text('27.1 Tipo de enfermedad:', textX + 255, textY + 403);// Sigueinte fila

            doc.text('28. Tipo de colegio:', textX + 5, textY + 428);
            doc.text('29. En su trayectoria universitaria a realizado:', textX + 160, textY + 428);// Sigueinte fila

            doc.text('30. Posee otro título:', textX + 5, textY + 453);
            doc.text('30.1 Que título posee:', textX + 155, textY + 453);
            doc.text('31. Estudia otra carrera:', textX + 340, textY + 453);// Sigueinte fila

            doc.text('31.1 Nombre de la carrera:', textX + 5, textY + 478);
            doc.text('31.2 Tipo de carrera:', textX + 230, textY + 478);// Sigueinte fila

            doc.text('39. Cuenta con equipo tecnológico :', textX + 5, textY + 503);
            doc.text('39.1 Dispositivo tecnológico :', textX + 230, textY + 503);// Sigueinte fila

            doc.text('40. Posee cobertura a internet:', textX + 5, textY + 528);
            doc.text('40.1 Tipo de cobertura que utiliza:', textX + 230, textY + 528);// Sigueinte fila

            doc.text('Lugar de procedencia', textX + 200, textY + 555);//CAMBIO DE SECCION

            doc.text('41. País :', textX + 5, textY + 580);
            doc.text('42. Provincia:', textX + 70, textY + 580);
            doc.text('43. Cantón:', textX + 145, textY + 580);
            doc.text('44. Parroquia:', textX + 290, textY + 580);// Sigueinte fila

            doc.text('45. Comunidad de procedencia:', textX + 5, textY + 622);
            doc.text('45.1 Referencia de procedencia:', textX + 230, textY + 616);//SIGUIENTE FILA

            doc.text('46. Calle principal:', textX + 5, textY + 648);
            doc.text('47. Calle secundaria:', textX + 255, textY + 648);//SIGUIENTE FILA

            doc.text('48. Número de casa:', textX + 5, textY + 678);
            doc.text('49. Longitud:', textX + 200, textY + 678);
            doc.text('50. Latitud:', textX + 350, textY + 678);

            if (response) {

                doc.font('Times-Roman');
                doc.fontSize('9');

                doc.text(response?.user.identificationType?.name, textX + 105, textY + 30);
                doc.text(response?.user.identification, textX + 120, textY + 55);
                doc.text(`${response?.user.name} ${response?.user.lastname}`, textX + 360, textY + 25);
                doc.text(response?.user.birthdate, textX + 305, textY + 55);
                doc.text(this.calculateAge(response?.user.birthdate), textX + 450, textY + 55); //variable de la edad (esta con dato quemado) // Sigueinte fila
                doc.text(`${response?.user.email}`, textX + 155, textY + 77);
                doc.text(`${response?.user.personalEmail}`, textX + 140, textY + 102); // Sigueinte fila
                doc.text(`${response?.user.cellPhone}`, textX + 365, textY + 77);
                doc.text(`${response?.user.phone}`, textX + 395, textY + 102); // Sigueinte fila
                doc.text(`${response?.user.maritalStatus?.name}`, textX + 75, textY + 128);
                doc.text(`${response?.user.nationality?.name}`, textX + 225, textY + 128);
                doc.text(response?.user.sex?.name, textX + 340, textY + 128);
                doc.text(response?.user.gender?.name, textX + 439, textY + 128);// Sigueinte fila
                doc.text(response?.user.ethnicOrigin?.name, textX + 65, textY + 160);
                doc.text(response?.informationStudent.indigenousNationality?.name, textX + 210, textY + 160);
                doc.text(response?.informationStudent.town?.name, textX + 410, textY + 160); // Sigueinte fila
                doc.text(response?.informationStudent.isAncestralLanguage?.name, textX + 160, textY + 178);
                doc.text(response?.informationStudent.ancestralLanguageName?.name, textX + 392, textY + 178);// Sigueinte fila
                doc.text(response?.informationStudent.isForeignLanguage?.name, textX + 160, textY + 202);
                doc.text(response?.informationStudent.foreignLanguageName?.name, textX + 395, textY + 202); // Sigueinte fila
                doc.text(response?.informationStudent.contactEmergencyName, textX + 75, textY + 250);
                doc.text(response?.informationStudent.contactEmergencyPhone, textX + 415, textY + 227);
                doc.text(response?.informationStudent.contactEmergencyKinship?.name, textX + 330, textY + 253); // Sigueinte fila
                doc.text(response?.informationStudent.isWork?.name, textX + 130, textY + 278);
                doc.text(response?.informationStudent.workPosition, textX + 375, textY + 278); // Sigueinte fila
                doc.text(response?.informationStudent.monthlySalary?.name, textX + 83, textY + 310);
                doc.text(response?.informationStudent.workingHours?.name, textX + 170, textY + 310);
                doc.text(response?.informationStudent.workAddress, textX + 330, textY + 310); // Sigueinte fila
                doc.text(response?.informationStudent.isHasChildren?.name, textX + 90, textY + 328);
                doc.text(response?.informationStudent.childrenTotal, textX + 275, textY + 328);
                doc.text(response?.informationStudent.isHouseHead.name, textX + 440, textY + 328); // Sigueinte fila
                doc.text(response?.informationStudent.isSocialSecurity?.name, textX + 160, textY + 353);
                doc.text(response?.informationStudent.isPrivateSecurity?.name, textX + 410, textY + 353);// Sigueinte fila
                doc.text(response?.informationStudent.isDisability?.name, textX + 145, textY + 378);
                doc.text(response?.informationStudent.disabilityType?.name, textX + 225, textY + 378);
                doc.text(response?.informationStudent.disabilityPercentage, textX + 450, textY + 378);// Sigueinte fila
                doc.text(response?.informationStudent.isCatastrophicIllness?.name, textX + 195, textY + 403);
                doc.text(response?.informationStudent.catastrophicIllness, textX + 365, textY + 403); // Sigueinte fila
                doc.text(response?.informationStudent.typeSchool?.name, textX + 90, textY + 428);
                doc.text(response?.informationStudent.universityCareer?.name, textX + 360, textY + 428);// Sigueinte fila
                doc.text(response?.informationStudent.isDegreeSuperior?.name, textX + 100, textY + 453);
                doc.text(response?.informationStudent.degreeSuperior?.name, textX + 250, textY + 453);
                doc.text(response?.informationStudent.isStudyOtherCareer?.name, textX + 450, textY + 453);// Sigueinte fila
                doc.text(response?.informationStudent.nameStudyOtherCareer, textX + 125, textY + 478);
                doc.text(response?.informationStudent.typeStudyOtherCareer?.name, textX + 340, textY + 478);// Sigueinte fila
                doc.text(response?.informationStudent.isElectronicDevice?.name, textX + 165, textY + 503);
                doc.text(response?.informationStudent.electronicDevice?.name, textX + 360, textY + 503);// Sigueinte fila
                doc.text(response?.informationStudent.isInternet?.name, textX + 145, textY + 528);
                doc.text(response?.informationStudent.internetType?.name, textX + 380, textY + 528);// Sigueinte fila

                doc.fontSize('7.5');
                doc.text(response?.user.originAddress?.country?.name, textX + 5, textY + 595);
                doc.text(response?.user.originAddress?.province?.name, textX + 68, textY + 595);
                doc.text(response?.user.originAddress?.canton?.name, textX + 145, textY + 595);
                doc.text(response?.user.originAddress?.parish?.name, textX + 290, textY + 595);//SIGUIENTE FILA

                doc.fontSize('9');
                doc.text(response?.user.originAddress?.community, textX + 148, textY + 622);
                doc.text(response?.user.originAddress?.reference, textX + 230, textY + 626);//SIGUIENTE FILA

                doc.text(response?.user.originAddress?.mainStreet, textX + 90, textY + 648);
                doc.text(response?.user.originAddress?.secondaryStreet, textX + 355, textY + 648);//SIGUIENTE FILA
                doc.text(response?.user.originAddress?.number, textX + 95, textY + 678);
                doc.text(response?.user.originAddress?.longitude, textX + 260, textY + 678);
                doc.text(response?.user.originAddress?.latitude, textX + 400, textY + 678);
            }

            doc.addPage();
            doc.rect(textX, textY, textW, 675); //Rectangulo grande
            doc.rect(textX, textY + 30, textW, 0.1);//LUGAR E RESIDENCIA
            doc.rect(textX + 65, textY + 30, 0.1, 35);
            doc.rect(textX + 142, textY + 30, 0.1, 35);
            doc.rect(textX + 287, textY + 30, 0.1, 35);
            doc.rect(textX, textY + 65, textW, 0.1);//FILA 51
            doc.rect(textX + 225, textY + 65, 0.1, 25);
            doc.rect(textX, textY + 90, textW, 0.1);//FILA 55
            doc.rect(textX + 225, textY + 90, 0.1, 25);
            doc.rect(textX, textY + 115, textW, 0.1);//FILA 56
            doc.rect(textX + 185, textY + 115, 0.1, 25);
            doc.rect(textX + 335, textY + 115, 0.1, 25);
            doc.rect(textX, textY + 140, textW, 0.1);//FILA 58
            doc.rect(textX + 255, textY + 140, 0.1, 75);
            doc.rect(textX, textY + 165, textW, 0.1);//FILA 61
            doc.rect(textX, textY + 190, textW, 0.1);//FILA 63 Y 64
            doc.rect(textX, textY + 215, textW, 0.1);//FILA 65
            doc.rect(textX, textY + 240, textW, 0.1);//FILA 66
            doc.rect(textX + 170, textY + 240, 0.1, 25);
            doc.rect(textX, textY + 265, textW, 0.1);//FILA 66.1
            doc.rect(textX, textY + 290, textW, 0.1);//FILA 67
            doc.rect(textX + 210, textY + 290, 0.1, 25);
            doc.rect(textX, textY + 315, textW, 0.1);//FILA 67.1
            doc.rect(textX + 245, textY + 315, 0.1, 25);
            doc.rect(textX, textY + 340, textW, 0.1);//FILA 68
            doc.rect(textX + 290, textY + 340, 0.1, 25);
            doc.rect(textX, textY + 365, textW, 0.1);//FILA 70 Y 71
            doc.rect(textX + 235, textY + 365, 0.1, 75);
            doc.rect(textX, textY + 390, textW, 0.1);//FILA 72 Y 73
            doc.rect(textX, textY + 415, textW, 0.1);//FILA 74 Y 74.1
            doc.rect(textX, textY + 440, textW, 0.1);//FILA 75 Y 76
            doc.rect(textX, textY + 465, textW, 0.1);//FILA 77
            doc.rect(textX + 235, textY + 465, 0.1, 25);
            doc.rect(textX, textY + 490, textW, 0.1);//FILA 78
            doc.rect(textX + 275, textY + 490, 0.1, 25);
            doc.rect(textX, textY + 515, textW, 0.1);//FILA 79
            doc.rect(textX + 215, textY + 515, 0.1, 25);
            doc.rect(textX, textY + 540, textW, 0.1);//FILA 81
            doc.rect(textX, textY + 565, textW, 0.1);//FILA 83
            doc.rect(textX + 215, textY + 565, 0.1, 50);
            doc.rect(textX, textY + 590, textW, 0.1);//FILA 84 Y 84.1
            doc.rect(textX, textY + 615, textW, 0.1);//FILA 85 Y 85.1
            doc.rect(textX + 137, textY + 615, 0.1, 25);
            doc.rect(textX + 325, textY + 615, 0.1, 25);
            doc.rect(textX, textY + 640, textW, 0.1);//FILA 86 Y 86.1
            doc.stroke();

            doc.font('Helvetica-Bold');
            doc.fontSize('10');

            doc.text('Lugar de residencia:', textX + 200, textY + 10); //LUGAR DE RESIDENCIA

            doc.text('51. País:', textX + 5, textY + 35);
            doc.text('52. Provincia:', textX + 70, textY + 35);
            doc.text('53. Cantón:', textX + 145, textY + 35);
            doc.text('54. Parroquia:', textX + 290, textY + 35);//SIGUIENTE FILA

            doc.text('55. Ciudad más cercana:', textX + 5, textY + 73);
            doc.text('55.1 Referencia:', textX + 230, textY + 73);//SIGUIENTE FILA

            doc.text('56. Calle principal:', textX + 5, textY + 99);
            doc.text('57. Calle secundaria:', textX + 230, textY + 99);//SIGUIENTE FILA

            doc.text('58. Número de casa:', textX + 5, textY + 124);
            doc.text('59. Longitud:', textX + 200, textY + 124);
            doc.text('60. Latitud:', textX + 350, textY + 124);//SIGUIENTE FILA

            doc.text('61. Ingresos del hogar:', textX + 5, textY + 149);
            doc.text('62. Número de miembros del hogar:', textX + 260, textY + 149);//SIGUIENTE FILA

            doc.text('63. Depende económicamente de otra persona:', textX + 5, textY + 175);
            doc.text('64. Dispone de vehículo propio:', textX + 260, textY + 175);//SIGUIENTE FILA

            doc.text('65. Tiene otras propiedades:', textX + 5, textY + 199);
            doc.text('65.1 Cuales:', textX + 260, textY + 199);//SIGUIENTE FILA

            doc.text('66. Algún miembro de su familia tiene una enfermedad catastrófica:', textX + 5, textY + 224);//SIGUIENTE FILA

            doc.text('66.1 Quién:', textX + 5, textY + 249);
            doc.text('66.2 Tipo de enfermedad:', textX + 175, textY + 249);//SIGUIENTE FILA

            doc.text('67. Algún miembro de su familia presenta alguna discapacidad:', textX + 5, textY + 274);//SIGUIENTE FILA

            doc.text('67.1 Porcentaje de discapacidad:', textX + 5, textY + 299);
            doc.text('67.2 Especifique quién:', textX + 215, textY + 299);//SIGUIENTE FILA

            doc.text('68. Con quién vive el estudiante:', textX + 5, textY + 324);
            doc.text('69. Tipo de vivienda:', textX + 250, textY + 324);//SIGUIENTE FILA

            doc.text('70. La vivienda en la que habita es:', textX + 5, textY + 349);
            doc.text('71. Tipo de techo:', textX + 300, textY + 349);//SIGUIENTE FILA

            doc.text('72. Tipo de piso:', textX + 5, textY + 374);
            doc.text('73. Tipo de pared:', textX + 240, textY + 374);//SIGUIENTE FILA

            doc.text('74. Posee servicio básico de agua:', textX + 5, textY + 400);
            doc.text('74.1 Que tipo de agua consume:', textX + 240, textY + 400);//SIGUIENTE FILA

            doc.text('75. Posee luz en su domicilio:', textX + 5, textY + 425);
            doc.text('76. Frecuencia de apagones:', textX + 240, textY + 425);//SIGUIENTE FILA

            doc.text('77. Posee servicio de teléfono:', textX + 5, textY + 448);//SIGUIENTE FILA

            doc.text('78. Posee servicio de alcantarillado:', textX + 5, textY + 473);
            doc.text('78.1 Tipo de alcantarillado:', textX + 240, textY + 473);//SIGUIENTE FILA

            doc.text('79. Para sus estudios recibe aportes de:', textX + 5, textY + 500);
            doc.text('80. Bono, beca ó ayuda económica:', textX + 280, textY + 500);//SIGUIENTE FILA

            doc.text('81. Consumo noticias:', textX + 5, textY + 525);
            doc.text('82. Algún miembro de su familia es emigrante:', textX + 220, textY + 525);//SIGUIENTE FILA

            doc.text('83. Qué efectos psicosociales le dejó la pandemia (COVID-19):', textX + 5, textY + 550);

            doc.text('84. Victima de violencia de género:', textX + 5, textY + 575);
            doc.text('84.1 Tipo de violencia:', textX + 220, textY + 575);//SIGUIENTE FILA

            doc.text('85. Ha intentado hacerse daño:', textX + 5, textY + 600);
            doc.text('85.1 Tipo de autolesiones:', textX + 220, textY + 600);//SIGUIENTE FILA

            doc.text('86. Ha sido discriminado:', textX + 4, textY + 625);
            doc.text('86.1 Cúal es el motivo:', textX + 140, textY + 625);
            doc.text('87. Tribu urbana:', textX + 330, textY + 625);//SIGUIENTE FILA

            doc.text('88. Información adicional del estudiante:', textX + 5, textY + 644);

            if (response) {

                doc.font('Times-Roman');

                doc.fontSize('7.5');
                doc.text(response?.user.residenceAddress?.country.name, textX + 5, textY + 53);
                doc.text(response?.user.residenceAddress?.province?.name, textX + 68, textY + 53);
                doc.text(response?.user.residenceAddress?.canton?.name, textX + 145, textY + 53);
                doc.text(response?.user.residenceAddress?.parish?.name, textX + 290, textY + 53); //siguiente fila

                doc.fontSize('9');
                doc.text(response?.user.residenceAddress?.nearbyCity, textX + 125, textY + 73);// (consultar ciudad mas cercana)
                doc.text(response?.user.residenceAddress?.reference, textX + 310, textY + 71);//siguiente fila

                doc.text(response?.user.residenceAddress?.mainStreet, textX + 100, textY + 99);
                doc.text(response?.user.residenceAddress?.secondaryStreet, textX + 340, textY + 99);//SIGUIENTE FILA

                doc.text(response?.user.residenceAddress?.number, textX + 110, textY + 124);
                doc.text(response?.user.residenceAddress?.longitude, textX + 270, textY + 124);
                doc.text(response?.user.residenceAddress?.latitude, textX + 410, textY + 124);//SIGUIENTE FILA

                doc.text(response?.informationStudent.familyIncome?.name, textX + 120, textY + 149);//(CONSULTAR)
                doc.text(response?.informationStudent.membersHouseNumber, textX + 435, textY + 149);//SIGUIENTE FILA

                doc.text(response?.informationStudent.isDependsEconomically?.name, textX + 235, textY + 175);
                doc.text(response?.informationStudent.isFamilyVehicle?.name, textX + 425, textY + 175);//SIGUIENTE FILA

                doc.text(response?.informationStudent.isFamilyProperties?.name, textX + 150, textY + 199);
                doc.text(response?.informationStudent.familyProperties?.name, textX + 330, textY + 199);//SIGUIENTE FILA

                doc.text(response?.informationStudent.isFamilyCatastrophicIllness?.name, textX + 330, textY + 224);//SIGUIENTE FILA

                doc.text(response?.informationStudent.familyKinshipCatastrophicIllness?.name, textX + 65, textY + 249);
                doc.text(response?.informationStudent.familyCatastrophicIllness, textX + 300, textY + 249);//SIGUIENTE FILA (NO GUARDA EN BASE)

                doc.text(response?.informationStudent.isFamilyDisability?.name, textX + 330, textY + 274);//SIGUIENTE FILA (NO GUARDA EN BASE)

                doc.text(response?.informationStudent.familyDisabilityPercentage, textX + 170, textY + 299);
                doc.text(response?.informationStudent.familyKinshipDisability?.name, textX + 340, textY + 299);//SIGUIENTE FILA (NO GUARDA EN BASE)

                doc.text(response?.informationStudent.studentLive?.name, textX + 160, textY + 324);
                doc.text(response?.informationStudent.homeType?.name, textX + 350, textY + 324);//Siguiente fila

                doc.text(response?.informationStudent.homeOwnership?.name, textX + 180, textY + 349);
                doc.text(response?.informationStudent.homeRoof?.name, textX + 390, textY + 349);//Siguiente fila

                doc.text(response?.informationStudent.homeFloor?.name, textX + 90, textY + 374);
                doc.text(response?.informationStudent.homeWall?.name, textX + 330, textY + 374); //sigueinte fila

                doc.text(response?.informationStudent.isWaterService?.name, textX + 190, textY + 400);
                doc.text(response?.informationStudent.waterServiceType?.name, textX + 400, textY + 400);//sigueinte fila

                doc.text(response?.informationStudent.isElectricService?.name, textX + 150, textY + 424);
                doc.text(response?.informationStudent.electricServiceBlackout?.name, textX + 380, textY + 424);//Siguiente fila

                doc.text(response?.informationStudent.isPhoneService?.name, textX + 180, textY + 445);

                doc.text(response?.informationStudent.isSewerageService?.name, textX + 190, textY + 473);
                doc.text(response?.informationStudent.sewerageServiceType?.name, textX + 380, textY + 473);//sigueinte fila

                doc.text(response?.informationStudent.economicContribution?.name, textX + 200, textY + 500);
                doc.text(response?.informationStudent.isFamilyEconomicAid?.name, textX + 455, textY + 500);// (consultar variable)

                doc.text(response?.informationStudent.consumeNewsType?.name, textX + 120, textY + 525);
                doc.text(response?.informationStudent.isFamilyEmigrant?.name, textX + 450, textY + 525);

                doc.text(response?.informationStudent.pandemicPsychologicalEffect?.name, textX + 310, textY + 550);

                doc.text(response?.informationStudent.isGenderViolence?.name, textX + 170, textY + 575);
                doc.text(response?.informationStudent.typeGenderViolence?.name, textX + 330, textY + 575);

                doc.text(response?.informationStudent.isInjuries?.name, textX + 160, textY + 600);
                doc.text(response?.informationStudent.typeInjuries?.name, textX + 350, textY + 600);

                doc.text(response?.informationStudent.isDiscrimination?.name, textX + 126, textY + 625);
                doc.text(response?.informationStudent.typeDiscrimination?.name, textX + 250, textY + 625);
                doc.text(response?.informationStudent.socialGroup?.name, textX + 410, textY + 625);

                doc.text(response?.informationStudent.additionalInformation, textX + 5, textY + 656);

            }

            const pages = doc.bufferedPageRange();
            const currentDate = format(new Date(), 'yyyy-MM-dd H:mm:ss');

            for (let i = 0; i < pages.count; i++) {
                doc.switchToPage(i);

                //Header: Add page number
                const oldTopMargin = doc.page.margins.top;
                doc.page.margins.top = 10; //Dumb: Have to remove top margin in order to write into it

                doc.font('Helvetica-Bold');
                doc.fontSize('12');

                doc.text('FICHA SOCIOECONÓMICA',
                    35,
                    (oldTopMargin / 2) + 20, // Centered vertically in top margin
                    {align: 'center'},
                );
                doc.image(
                    this.imageHeaderPath,
                    25,
                    (oldTopMargin / 2), // Centered vertically in top margin
                    {
                        align: 'center',
                        width: this.imageHeaderWidth,
                        height: this.imageHeaderHeight,
                    },
                );

                doc.page.margins.top = oldTopMargin; // ReProtect top margin

                //Footer: Add page number
                const oldBottomMargin = doc.page.margins.bottom;
                doc.page.margins.bottom = 0; //Dumb: Have to remove bottom margin in order to write into it

                doc
                  .fontSize('6')
                  .text(
                    `Dir. García Moreno S4-35 y Ambato, TELF: +593 99 550 6245 MAIL: yavirac@yavirac.edu.ec`,
                    50,
                    doc.page.height - oldBottomMargin / 2 - 20,
                    { align: 'center' },
                  );

                doc.text(`Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac`, 20, doc.page.height - oldBottomMargin / 2 - 10, { align: 'center' });

                doc
                    .text(
                        `Página ${i + 1} de ${pages.count} - Fecha Impresión (${currentDate})`,
                        20,
                        doc.page.height - (oldBottomMargin / 2),
                        {align: 'center'},
                    );

                doc.page.margins.bottom = oldBottomMargin; // ReProtect bottom margin
            }

            return doc;
        } catch (error) {
            throw new Error;
        }
    }

    async generateSocioeconomicFormAll(@Res() res: Response, schoolPeriodId: string) {
        const data = (await this.studentSqlService.findSocioeconomicFormAll(schoolPeriodId)) as EnrollmentEntity[];

        const newWorkbook = XLSX.utils.book_new();
        const newSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Ficha Socio');
        const path = join(process.cwd(), 'storage/reports/students', Date.now() + '.xlsx'); //review path
        XLSX.writeFile(newWorkbook, path);

        return path;
    }

    async generateStudentCard(id: string, careerId: string, schoolPeriodId: string) {
        const data = (await this.studentSqlService.findStudentCard(id, careerId, schoolPeriodId)) as StudentEntity[];

        // console.log(data);

        try {
            return this.printerService.createPdf(studentCardReport(this.configService,data[0]));
        } catch (error) {
            throw new Error;
        }
    }

    calculateAge(birthdate: Date): number {
        return differenceInYears(new Date(), new Date(birthdate));
    }
}
