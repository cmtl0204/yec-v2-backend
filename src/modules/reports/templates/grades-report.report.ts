import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { format } from 'date-fns';

export const gradesReportReport = (data: any): TDocumentDefinitions => {
  const schoolPeriod = data.teacherDistribution.schoolPeriod;
  const subject = data.teacherDistribution.subject;
  const academicPeriod = data.teacherDistribution.academicPeriod;
  const studentsTotal = data.teacherDistribution.studentsTotal;
  const teacherName = data.teacherDistribution.teacherName;
  const parallel = data.teacherDistribution.parallel;
  const teacherIdentification = data.teacherDistribution.teacherIdentification;
  const career = data.teacherDistribution.career;

  const rows = data.grades.map((grade: any) => {
    return [
      grade.Numero_Documento,
      grade.Apellidos,
      grade.Nombres,
      grade.Progreso,
      grade.Parcial1,
      grade.Parcial2,
      grade.Calificacion_Final,
      grade.Examen_Supletorio,
      grade.Estado_Academico,
    ];
  });

  return {
    pageOrientation: 'landscape', // 🔹 Cambia la hoja a horizontal

    // pageSize: {
    //   width: 960,
    //   height: 540,
    // },

    pageSize: 'A4',

    // pageMargins: [30, 0, 30, 0],

    header: {
      columns: [
        {
          image: './resources/images/reports/header.png',
          alignment: 'left',
          width: 50,
          height: 50,
          marginLeft: 30,
        },
        {
          text: 'INSTITUTO SUPERIOR TECNOLÓGICO DE TURISMO Y PATRIMONIO YAVIRAC',
          alignment: 'center',
          color: 'gray',
          marginTop: 20,
        },
      ],
    },

    footer: function (currentPage, pageCount) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'right',
        fontSize: 10,
        marginRight: 30,
      };
    },

    content: [
      {
        text: 'INFORME DE CALIFICACIONES',
        fontSize: 12,
        bold: true,
        alignment: 'center',
        marginTop: 30,
        marginBottom: 20,
      },

      {
        layout: {
          hLineWidth: () => 0, // Borde solo arriba y abajo
          vLineWidth: () => 0, // 🔹 Quita los bordes verticales
        },

        table: {
          widths: ['15%', 'auto'],

          body: [
            [
              { text: 'CARRERA:', bold: true },
              {
                text: subject.curriculum.career.name,
              },
            ],
            [
              { text: 'ASIGNATURA:', bold: true },
              {
                text: `${subject.code} - ${subject.name}`,
              },
            ],
            [{ text: 'CICLO:', bold: true }, { text: `${academicPeriod} - ${parallel}` }],
            [{ text: 'NUMERO DE ALUMNOS:', bold: true }, { text: studentsTotal }],
            [{ text: 'PROFESOR:', bold: true }, { text: `${teacherIdentification} - ${teacherName}` }],
            [{ text: 'PERIODO ACADÉMICO:', bold: true }, { text: schoolPeriod }],
          ],
        },

        fontSize: 10,
      },

      { text: 'DETALLE.–', marginTop: 20 },

      {
        table: {
          headerRows: 1,

          widths: [65, 120, 120, 50, 40, 40, 60, 80, 60],

          body: [
            [
              { text: 'IDENTIFICACIÓN', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'APELLIDOS', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'NOMBRES', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'PROGRESO', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'PARCIAL 1', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'PARCIAL 2', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'CALIFICACIÓN FINAL', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'EVALUACIÓN DE RECUPERACIÓN', bold: true, alignment: 'center', fillColor: '#dddddd' },
              { text: 'ESTADO ACADÉMICO', bold: true, alignment: 'center', fillColor: '#dddddd' },
            ],
            ...rows,
          ].map((row, rowIndex) => {
            // Aplicar color de fondo a las filas pares
            if (rowIndex > 0 && rowIndex % 2 === 0) {
              return row.map(cell => ({
                text: cell,
                fillColor: '#CCCCCC', // Color gris claro para filas pares
              }));
            }
            return row;
          }),
        },

        marginTop: 20,

        fontSize: 8,
      },

      { text: `EMITIDO: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, alignment: 'right' },

      {
        table: {
          widths: ['auto'], // Ancho de la tabla
          body: [
            [{ text: `${teacherName}`, alignment: 'center' }],
            [
              {
                text: 'PROFESOR DE LA ASIGNATURA',
                alignment: 'center',
              },
            ],
          ],
        },

        marginTop: 60,

        marginLeft: 390 - (teacherName.length > 25 ? teacherName.length * 4 : 100),

        layout: {
          hLineWidth: (i: number, node: any) => (i === 0 ? 1 : 0), // Borde solo arriba y abajo
          // hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length ? 1 : 0), // Borde solo arriba y abajo

          vLineWidth: function (i, node) {
            return 0; // Ocultar líneas verticales
          },
          hLineColor: function (i, node) {
            return '#000000'; // Color de la línea horizontal
          },
        },
      },
    ],
  };
};
