import {TDocumentDefinitions} from 'pdfmake/interfaces';
import {format} from "date-fns";
import {es} from "date-fns/locale";

export const integralEvaluationReport = (data: any): TDocumentDefinitions => {
    const schoolPeriod = data.schoolPeriod.name;
    const viceRector = `${data.viceRector.lastname} ${data.viceRector.name}`;
    const evaluated = `${data.evaluated.lastname} ${data.evaluated.name}`;

    let career = 'No tiene una carrera principal asignada';

    if (data.evaluated.teacher.careerToTeachers.length > 0) {
        career = data.evaluated.teacher.careerToTeachers[0].career.name;
    }

    return {
      pageSize: {
        width: 540,
        height: 960,
      },

      pageMargins: [0, 0, 0, 0],

      content: [
        {
          image: './resources/images/reports/header.png',
          width: 115,
          height: 100,
          absolutePosition: { y: 10 },
          alignment: 'center',
        },

        {
          text: 'VICERRECTORADO ACADÉMICO INTERCULTURAL Y COMUNITARIO',
          fontSize: 12,
          bold: true,
          absolutePosition: { y: 120 },
          alignment: 'center',
        },
        {
          text: 'REPORTE DE EVALUACIÓN INTEGRAL DE DESEMPEÑO DOCENTE',
          fontSize: 12,
          bold: true,
          absolutePosition: { y: 145 },
          alignment: 'center',
        },

        {
          layout: 'noBorders', // optional
          table: {
            widths: ['10%', 'auto'],

            body: [
              [
                {
                  width: '10%',
                  text: 'Proceso:',
                  bold: true,
                },
                {
                  text: 'Evaluación integral de desempeño del personal académico:',
                },
              ],
              [{ text: 'PAO:', bold: true }, { text: schoolPeriod }],
              [{ text: 'Docente:', bold: true }, { text: `${data.evaluated.lastname} ${data.evaluated.name}` }],
              [{ text: 'Carrera:', bold: true }, { text: career }],
              [{ text: 'Fecha:', bold: true }, { text: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es }) }],
            ],
          },
          absolutePosition: { x: 50, y: 180 },
          fontSize: 10,
        },

        {
          table: {
            headerRows: 1,
            widths: [280, 60, 60],

            body: [
              [
                '',
                { text: 'Cuantitativa', bold: true, alignment: 'center' },
                {
                  text: 'Cualitativa',
                  bold: true,
                  alignment: 'center',
                },
              ],
              [
                'Resultado evaluación de desempeño personal académico',
                {
                  text: data.totalScore,
                  alignment: 'center',
                },
                { text: data.quality, alignment: 'center' },
              ],
            ],
          },
          absolutePosition: { x: 50, y: 280 },

          fontSize: 10,
        },

        {
          absolutePosition: { x: 50, y: 330 },
          fontSize: 10,

          table: {
            headerRows: 1,
            widths: [280, 60, 60],

            body: [
              [
                { text: 'Evaluación del desempeño', bold: true },
                { text: '%', bold: true, alignment: 'center' },
                { text: 'Resultado', bold: true, alignment: 'center' },
              ],
              ['Cuestionario para la autoevaluación docente ', { text: '10%', alignment: 'center' }, { text: data.autoEvaluationScore, alignment: 'center' }],
              [
                'Cuestionario para la coevaluación por parte de pares académicos',
                {
                  text: '25%',
                  alignment: 'center',
                },
                { text: data.partnerEvaluationScore, alignment: 'center' },
              ],
              [
                'Cuestionario para hetero evaluación',
                {
                  text: '40%',
                  alignment: 'center',
                },
                { text: data.studentEvaluationScore, alignment: 'center' },
              ],
              [
                'Cuestionario para la evaluación de las autoridades al personal académico',
                {
                  text: '25%',
                  alignment: 'center',
                },
                { text: data.coordinatorEvaluationScore, alignment: 'center' },
              ],
              [
                { text: 'TOTAL', bold: true },
                { text: '100%', alignment: 'center' },
                {
                  text: data.totalScore,
                  alignment: 'center',
                },
              ],
              [
                {
                  border: [false, true, false, false],
                  colSpan: 3,
                  fontSize: 7,
                  alignment: 'justify',
                  text: 'De acuerdo al Reglamento de Carrera y Escalafón del profesor e investigador del Instituto Superior Tecnológico de Turismo y Patrimonio Yavirac, el artículo 129.- Reconsideración, señala que “el personal académico que esté en desacuerdo con los resultados de su evaluación, podrá solicitar la reconsideración de la resolución al director de la Comisión de Evaluación Interna, en el término de cinco días laborables”.',
                },
              ],
            ],
          },
        },

        {
          table: {
            headerRows: 1,
            widths: [100, 40],

            body: [
              [{ text: 'Acepto', bold: true }, ''],
              [{ text: 'Reconsideración', bold: true }, ''],
            ],
          },
          absolutePosition: { x: 50, y: 510 },
          fontSize: 11,
        },

        {
          layout: 'noBorders',

          table: {
            headerRows: 1,
            widths: [180, 180],

            body: [
              [
                {
                  text: viceRector,
                  alignment: 'center',
                },
                {
                  text: evaluated,
                  alignment: 'center',
                },
              ],
              [
                {
                  text: 'Vicerrectora Académica\nIntercultural y Comunitaria',
                  bold: true,
                  alignment: 'center',
                },
                {
                  text: 'Docente',
                  bold: true,
                  alignment: 'center',
                },
              ],
            ],
          },
          absolutePosition: { x: 100, y: 620 },
          fontSize: 11,
        },

        {
          table: {
            widths: [100, 100],

            body: [
              [
                {
                  colSpan: 2,
                  text: 'Equivalencia',
                  bold: true,
                  border: [false, false, false, false],
                },
                {
                  text: '',
                  border: [false, false, false, false],
                },
              ],
              [
                { text: 'CUANTITATIVA', bold: true },
                { text: 'CUALITATIVA', bold: true },
              ],
              ['95,00 - 100,00', 'Excelente'],
              ['80,00 - 94,99', 'Destacado'],
              ['70,00 - 79,99', 'Competente'],
              ['40,00 - 69,99', 'Básico'],
              ['20,00 - 39,99', 'Insatisfactorio'],
            ],
          },
          absolutePosition: { x: 50, y: 730 },
          fontSize: 8,
        },
      ],
    };
};
