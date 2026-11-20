import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PBDClassRecord, PBDStudentRecord, Language, MasteryLevel } from '../types';
import {
  STUDENT_EFFORT_CONFIG,
  ASSESSMENT_METHODS_CONFIG,
  getDskpStatement,
  calculateUasaGrade,
} from '../data/pbdSampleData';

/**
 * Helper to render an individual student slip onto a jsPDF document page.
 */
function renderStudentSlipPage(
  doc: jsPDF,
  classRecord: PBDClassRecord,
  student: PBDStudentRecord,
  language: Language
) {
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const methodInfo =
    ASSESSMENT_METHODS_CONFIG[student.assessmentMethod] ||
    ASSESSMENT_METHODS_CONFIG['gabungan'];
  const statement =
    student.subjectStatement ||
    getDskpStatement(classRecord.subject, student.masteryLevel, language);

  const periodText =
    classRecord.reportingPeriod === 'pertengahan'
      ? 'PERTENGAHAN SESI AKADEMIK'
      : 'AKHIR SESI AKADEMIK';

  let currentY = 14;

  // --- 1. HEADER (Kementerian Pendidikan Malaysia) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('KEMENTERIAN PENDIDIKAN MALAYSIA', pageWidth / 2, currentY, { align: 'center' });

  currentY += 5;
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 204); // Deep Sky Blue
  doc.text('PELAPORAN PENTAKSIRAN BILIK DARJAH (PBD)', pageWidth / 2, currentY, { align: 'center' });

  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(`${periodText} · SESI ${classRecord.academicYear}`, pageWidth / 2, currentY, { align: 'center' });

  currentY += 3;
  // Decorative brand bars
  doc.setDrawColor(0, 153, 255); // #0099ff
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  doc.setDrawColor(204, 49, 14); // #cc310e (Amber Red)
  doc.setLineWidth(0.6);
  doc.line(margin + 50, currentY + 0.8, margin + contentWidth - 50, currentY + 0.8);

  currentY += 4;

  // --- 2. STUDENT & SCHOOL METADATA TABLE ---
  const metaBody: any[] = [
    [
      { content: 'NAMA MURID', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${student.studentName.toUpperCase()}`, styles: { fontStyle: 'bold', textColor: [15, 23, 42] } },
      { content: 'TINGKATAN / TAHUN', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${classRecord.yearGrade.toUpperCase()}` },
    ],
    [
      { content: 'NO. PENGENALAN', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${student.studentId}` },
      { content: 'KELAS', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${classRecord.className.toUpperCase()}` },
    ],
    [
      { content: 'JANTINA', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${student.gender === 'L' ? 'LELAKI' : 'PEREMPUAN'}` },
      { content: 'NAMA SEKOLAH', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${classRecord.schoolName.toUpperCase()}` },
    ],
    [
      { content: 'TARIKH PELAPORAN', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${student.dateRecorded}` },
      { content: 'KOD SEKOLAH', styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
      { content: `: ${classRecord.schoolCode.toUpperCase()}` },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: metaBody,
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 1.2,
      font: 'helvetica',
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 62 },
      2: { cellWidth: 34 },
      3: { cellWidth: 54 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // --- 3. MAIN PBD ASSESSMENT TABLE ---
  const includeUasa = classRecord.includeUasa;

  const tableHead = includeUasa
    ? [
        [
          { content: 'MATA PELAJARAN', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'PENTAKSIRAN BERTERUSAN', colSpan: 2, styles: { halign: 'center' } },
          { content: 'UJIAN AKHIR SESI AKADEMIK (UASA)', colSpan: 2, styles: { halign: 'center' } },
          { content: 'ULASAN GURU MATA PELAJARAN', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'USAHA MURID', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: 'TP', styles: { halign: 'center' } },
          { content: 'PENYATAAN TAHAP PENGUASAAN', styles: { halign: 'center' } },
          { content: 'SKOR (%)', styles: { halign: 'center' } },
          { content: 'GRED', styles: { halign: 'center' } },
        ],
      ]
    : [
        [
          { content: 'MATA PELAJARAN', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'PENTAKSIRAN BERTERUSAN', colSpan: 2, styles: { halign: 'center' } },
          { content: 'ULASAN GURU MATA PELAJARAN', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'USAHA MURID', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        ],
        [
          { content: 'TP', styles: { halign: 'center' } },
          { content: 'PENYATAAN TAHAP PENGUASAAN', styles: { halign: 'center' } },
        ],
      ];

  const subjectCellText = `${classRecord.subject}\n\nGuru: ${classRecord.teacherName}\nKaedah: ${methodInfo.label.bm}`;
  const uasaScoreText = student.uasaScore !== undefined ? `${student.uasaScore}%` : '-';
  const uasaGradeText = student.uasaGrade || '-';

  const effortColor: [number, number, number] =
    student.effort === 'SANGAT TINGGI' ? [0, 80, 160] : [30, 41, 59];

  const tableBody: any[] = includeUasa
    ? [
        [
          { content: subjectCellText, styles: { fontStyle: 'bold' } },
          {
            content: student.masteryLevel,
            styles: {
              halign: 'center',
              valign: 'middle',
              fontStyle: 'bold',
              fontSize: 12,
              textColor: [0, 102, 204],
            },
          },
          { content: statement, styles: { fontSize: 8, halign: 'justify' } },
          { content: uasaScoreText, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
          { content: uasaGradeText, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 10 } },
          { content: student.remarks || 'Murid memberi tumpuan baik sepanjang sesi pembelajaran.', styles: { fontSize: 8 } },
          {
            content: student.effort,
            styles: {
              halign: 'center',
              valign: 'middle',
              fontStyle: 'bold',
              fontSize: 8.5,
              textColor: effortColor,
            },
          },
        ],
      ]
    : [
        [
          { content: subjectCellText, styles: { fontStyle: 'bold' } },
          {
            content: student.masteryLevel,
            styles: {
              halign: 'center',
              valign: 'middle',
              fontStyle: 'bold',
              fontSize: 12,
              textColor: [0, 102, 204],
            },
          },
          { content: statement, styles: { fontSize: 8, halign: 'justify' } },
          { content: student.remarks || 'Murid memberi tumpuan baik sepanjang sesi pembelajaran.', styles: { fontSize: 8 } },
          {
            content: student.effort,
            styles: {
              halign: 'center',
              valign: 'middle',
              fontStyle: 'bold',
              fontSize: 8.5,
            },
          },
        ],
      ];

  const colStyles: Record<string, { cellWidth: number }> = includeUasa
    ? {
        '0': { cellWidth: 36 },
        '1': { cellWidth: 14 },
        '2': { cellWidth: 54 },
        '3': { cellWidth: 16 },
        '4': { cellWidth: 14 },
        '5': { cellWidth: 32 },
        '6': { cellWidth: 16 },
      }
    : {
        '0': { cellWidth: 42 },
        '1': { cellWidth: 16 },
        '2': { cellWidth: 72 },
        '3': { cellWidth: 34 },
        '4': { cellWidth: 18 },
      };

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: tableHead as any,
    body: tableBody as any,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 248, 255],
      textColor: [15, 23, 42],
      lineColor: [100, 116, 139],
      lineWidth: 0.2,
      font: 'helvetica',
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 1.8,
    },
    bodyStyles: {
      lineColor: [148, 163, 184],
      lineWidth: 0.2,
      font: 'helvetica',
      textColor: [30, 41, 59],
      cellPadding: 2.2,
    },
    columnStyles: colStyles as any,
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // --- 4. ULASAN GURU KELAS ---
  doc.setDrawColor(100, 116, 139);
  doc.setFillColor(253, 253, 254);
  doc.roundedRect(margin, currentY, contentWidth, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 102, 204);
  doc.text('ULASAN GURU KELAS:', margin + 3, currentY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const remarksText =
    classRecord.classTeacherRemarks ||
    'Murid menunjukkan potensi pembelajaran yang membanggakan serta sentiasa bermotivasi tinggi dalam aktiviti kelas.';
  const splitRemarks = doc.splitTextToSize(remarksText, contentWidth - 6);
  doc.text(splitRemarks, margin + 3, currentY + 9);

  currentY += 24;

  // --- 5. PETUNJUK USAHA MURID (KPM Standard Rubric) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('PETUNJUK USAHA MURID (PANDUAN KPM PBS 2025):', margin, currentY);

  currentY += 2;

  const effortTableHead = [
    [
      { content: 'SANGAT TINGGI', styles: { halign: 'center', fontStyle: 'bold', fillColor: [224, 243, 84], textColor: [0, 51, 102] } },
      { content: 'TINGGI', styles: { halign: 'center', fontStyle: 'bold', fillColor: [224, 242, 254], textColor: [0, 102, 204] } },
      { content: 'SEDERHANA', styles: { halign: 'center', fontStyle: 'bold', fillColor: [254, 243, 199], textColor: [146, 64, 14] } },
      { content: 'RENDAH', styles: { halign: 'center', fontStyle: 'bold', fillColor: [254, 226, 226], textColor: [153, 27, 27] } },
    ],
  ];

  const effortTableBody = [
    [
      { content: 'Murid menunjukkan daya usaha yang tinggi dan mampu berdikari.' },
      { content: 'Murid menunjukkan daya usaha yang tinggi dan memerlukan sokongan untuk terus maju.' },
      { content: 'Murid menunjukkan daya usaha dan memerlukan dorongan / sokongan.' },
      { content: 'Murid kurang daya usaha dan memerlukan lebih dorongan / bantuan.' },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: effortTableHead as any,
    body: effortTableBody as any,
    theme: 'grid',
    headStyles: {
      fontSize: 7.5,
      cellPadding: 1.2,
      lineColor: [148, 163, 184],
      lineWidth: 0.15,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 1.5,
      textColor: [71, 85, 105],
      lineColor: [148, 163, 184],
      lineWidth: 0.15,
    },
    columnStyles: {
      '0': { cellWidth: 45.5 },
      '1': { cellWidth: 45.5 },
      '2': { cellWidth: 45.5 },
      '3': { cellWidth: 45.5 },
    } as any,
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // --- 6. SIGNATURE & VERIFICATION BLOCK ---
  const colW = contentWidth / 3;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  // Column 1: Guru Mata Pelajaran
  doc.text('Disediakan Oleh:', margin, currentY);
  doc.line(margin, currentY + 16, margin + colW - 8, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text(classRecord.teacherName.toUpperCase(), margin, currentY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Guru Mata Pelajaran', margin, currentY + 23.5);

  // Column 2: Guru Kelas
  const col2X = margin + colW;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Disahkan Oleh:', col2X, currentY);
  doc.line(col2X, currentY + 16, col2X + colW - 8, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text((classRecord.classTeacherName || classRecord.teacherName).toUpperCase(), col2X, currentY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Guru Kelas', col2X, currentY + 23.5);

  // Column 3: Pentadbir / Penjaga
  const col3X = margin + colW * 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Pengesahan Pentadbir / Penjaga:', col3X, currentY);
  doc.line(col3X, currentY + 16, col3X + colW - 2, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.text('PENGETUA / GURU BESAR', col3X, currentY + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Cop Rasmi Sekolah', col3X, currentY + 23.5);

  // --- 7. FOOTER BAR ---
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `BaMuDi Digital Learning Companion · Dijana mengikut Standard Panduan PBS KPM 2025 · Tarikh Cetakan: ${new Date().toLocaleDateString('ms-MY')}`,
    pageWidth / 2,
    290,
    { align: 'center' }
  );
}

/**
 * Generates an official KPM-compliant Individual Student PBD Slip PDF.
 */
export function buildIndividualPbdSlipDoc(
  classRecord: PBDClassRecord,
  student: PBDStudentRecord,
  language: Language = 'bm'
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  renderStudentSlipPage(doc, classRecord, student, language);
  return doc;
}

/**
 * Downloads single individual student slip PDF.
 */
export function downloadIndividualStudentPbdPdf(
  classRecord: PBDClassRecord,
  student: PBDStudentRecord,
  language: Language = 'bm'
): void {
  const doc = buildIndividualPbdSlipDoc(classRecord, student, language);
  const cleanName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanPeriod = classRecord.reportingPeriod;
  doc.save(`Slip_PBD_${cleanName}_${cleanPeriod}.pdf`);
}

/**
 * Generates an official Class PBD Transit & Summary Report PDF.
 * Formatted in clean A4 Landscape with statistics, TP distribution, and full roster.
 */
export function buildClassPbdSummaryPdf(
  classRecord: PBDClassRecord,
  language: Language = 'bm'
): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 273mm

  const totalStudents = classRecord.students.length;
  const countTP3Plus = classRecord.students.filter((s) =>
    ['TP3', 'TP4', 'TP5', 'TP6'].includes(s.masteryLevel)
  ).length;
  const pctTP3Plus = totalStudents > 0 ? Math.round((countTP3Plus / totalStudents) * 100) : 0;

  const validScores = classRecord.students
    .map((s) => s.uasaScore)
    .filter((sc): sc is number => sc !== undefined && sc !== null && !isNaN(sc));
  const avgUasa = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  const avgGrade = calculateUasaGrade(avgUasa).grade;

  const tpCounts: Record<MasteryLevel, number> = {
    TP1: 0,
    TP2: 0,
    TP3: 0,
    TP4: 0,
    TP5: 0,
    TP6: 0,
  };
  classRecord.students.forEach((s) => {
    tpCounts[s.masteryLevel] = (tpCounts[s.masteryLevel] || 0) + 1;
  });

  let currentY = 12;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('KEMENTERIAN PENDIDIKAN MALAYSIA', pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 204);
  doc.text('REKOD TRANSIT & LAPORAN RUMUSAN PENTAKSIRAN BILIK DARJAH (PBD)', pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const periodStr = classRecord.reportingPeriod === 'pertengahan' ? 'PERTENGAHAN SESI AKADEMIK' : 'AKHIR SESI AKADEMIK';
  doc.text(
    `${classRecord.schoolName.toUpperCase()} (${classRecord.schoolCode}) · KELAS: ${classRecord.className.toUpperCase()} · ${classRecord.subject.toUpperCase()} · ${periodStr} (${classRecord.academicYear})`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 3;
  doc.setDrawColor(0, 153, 255);
  doc.setLineWidth(0.6);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 3.5;

  // Summary Analytics Banner Cards
  const statBoxW = contentWidth / 4;
  const statBoxH = 11;

  // Card 1: Total Students
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, statBoxW - 2, statBoxH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('JUMLAH MURID', margin + 3, currentY + 3.5);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalStudents} Orang`, margin + 3, currentY + 8.5);

  // Card 2: TP3+ Achieved
  const card2X = margin + statBoxW;
  doc.setFillColor(240, 248, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(card2X, currentY, statBoxW - 2, statBoxH, 1, 1, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(0, 102, 204);
  doc.text('MENCAPAI TAHAP MINIMUM (TP3-TP6)', card2X + 3, currentY + 3.5);
  doc.setFontSize(10);
  doc.text(`${countTP3Plus} (${pctTP3Plus}%)`, card2X + 3, currentY + 8.5);

  // Card 3: UASA Class Average
  const card3X = margin + statBoxW * 2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(card3X, currentY, statBoxW - 2, statBoxH, 1, 1, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('PURATA KELAS UASA', card3X + 3, currentY + 3.5);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${avgUasa}% (Gred ${avgGrade})`, card3X + 3, currentY + 8.5);

  // Card 4: TP Breakdown
  const card4X = margin + statBoxW * 3;
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(card4X, currentY, statBoxW, statBoxH, 1, 1, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(161, 98, 7);
  doc.text('TABURAN TAHAP PENGUASAAN (TP)', card4X + 3, currentY + 3.5);
  doc.setFontSize(8);
  doc.setTextColor(113, 63, 18);
  doc.text(
    `TP1:${tpCounts.TP1}  TP2:${tpCounts.TP2}  TP3:${tpCounts.TP3}  TP4:${tpCounts.TP4}  TP5:${tpCounts.TP5}  TP6:${tpCounts.TP6}`,
    card4X + 3,
    currentY + 8.5
  );

  currentY += statBoxH + 4;

  // Student Transit Table
  const tableData = classRecord.students.map((st, idx) => {
    const methodObj = ASSESSMENT_METHODS_CONFIG[st.assessmentMethod];
    return [
      (idx + 1).toString(),
      st.studentName.toUpperCase(),
      st.studentId,
      st.gender === 'L' ? 'L' : 'P',
      st.masteryLevel,
      classRecord.includeUasa && st.uasaScore !== undefined ? `${st.uasaScore}%` : '-',
      classRecord.includeUasa ? st.uasaGrade || '-' : '-',
      st.effort,
      methodObj ? methodObj.label.bm : st.assessmentMethod,
      st.remarks || '-',
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [
      [
        'BIL',
        'NAMA MURID',
        'NO. ID / MYKID',
        'JANTINA',
        'TAHAP (TP)',
        'SKOR UASA',
        'GRED',
        'USAHA MURID',
        'KAEDAH',
        'ULASAN GURU MATA PELAJARAN',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
      cellPadding: 1.8,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 1.6,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
    },
    columnStyles: {
      '0': { cellWidth: 9, halign: 'center' },
      '1': { cellWidth: 54, fontStyle: 'bold' },
      '2': { cellWidth: 26, halign: 'center' },
      '3': { cellWidth: 14, halign: 'center' },
      '4': { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      '5': { cellWidth: 18, halign: 'center' },
      '6': { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      '7': { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
      '8': { cellWidth: 22, halign: 'center' },
      '9': { cellWidth: 74 },
    } as any,
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw as string;
        if (val === 'TP6') {
          data.cell.styles.fillColor = [253, 242, 240]; // #fdf2f0 (soft amber red)
          data.cell.styles.textColor = [153, 36, 11]; // #99240b
        } else if (val === 'TP5' || val === 'TP4') {
          data.cell.styles.fillColor = [240, 248, 255];
          data.cell.styles.textColor = [0, 102, 204];
        } else if (val === 'TP1' || val === 'TP2') {
          data.cell.styles.fillColor = [254, 226, 226];
          data.cell.styles.textColor = [153, 27, 27];
        }
      }
    },
  });

  const finalTableY = (doc as any).lastAutoTable.finalY + 6;

  // Signatures on last page
  const pageH = doc.internal.pageSize.getHeight();
  const signY = finalTableY + 22 > pageH ? pageH - 22 : finalTableY;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  // Sign 1: Teacher
  doc.text('Disediakan Oleh (Guru Mata Pelajaran):', margin, signY);
  doc.line(margin, signY + 11, margin + 60, signY + 11);
  doc.setFont('helvetica', 'bold');
  doc.text(classRecord.teacherName.toUpperCase(), margin, signY + 14.5);

  // Sign 2: Head of School / Principal
  const sign2X = margin + 140;
  doc.setFont('helvetica', 'normal');
  doc.text('Disahkan Oleh (Pengetua / Guru Besar / PK Pentadbiran):', sign2X, signY);
  doc.line(sign2X, signY + 11, sign2X + 60, signY + 11);
  doc.setFont('helvetica', 'bold');
  doc.text('PENGETUA / GURU BESAR', sign2X, signY + 14.5);

  // Page numbering
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `BaMuDi Rekod Transit PBD KPM · Sesi ${classRecord.academicYear} · Halaman ${i} daripada ${pageCount}`,
      pageWidth / 2,
      202,
      { align: 'center' }
    );
  }

  return doc;
}

/**
 * Downloads Class Transit & Summary Report PDF.
 */
export function downloadClassPbdSummaryPdf(
  classRecord: PBDClassRecord,
  language: Language = 'bm'
): void {
  const doc = buildClassPbdSummaryPdf(classRecord, language);
  const cleanClass = classRecord.className.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanSubject = classRecord.subject.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Laporan_Transit_PBD_${cleanClass}_${cleanSubject}_${classRecord.reportingPeriod}.pdf`);
}

/**
 * Generates Batch compilation PDF of all individual student slips in the class.
 */
export function buildBatchAllStudentSlipsPdf(
  classRecord: PBDClassRecord,
  language: Language = 'bm'
): jsPDF {
  const masterDoc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  classRecord.students.forEach((student, idx) => {
    if (idx > 0) {
      masterDoc.addPage('a4', 'portrait');
    }
    renderStudentSlipPage(masterDoc, classRecord, student, language);
  });

  return masterDoc;
}

/**
 * Downloads Batch All Student Slips compilation PDF.
 */
export function downloadBatchAllStudentSlipsPdf(
  classRecord: PBDClassRecord,
  language: Language = 'bm'
): void {
  const doc = buildBatchAllStudentSlipsPdf(classRecord, language);
  const cleanClass = classRecord.className.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanSubject = classRecord.subject.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Semua_Slip_PBD_${cleanClass}_${cleanSubject}_${classRecord.reportingPeriod}.pdf`);
}
