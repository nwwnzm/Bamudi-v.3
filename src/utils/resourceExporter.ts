import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import pptxgen from 'pptxgenjs';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType,
} from 'docx';
import { Language } from '../types';

export type SupportedExportFormat = 'docx' | 'pdf' | 'pptx';

/**
 * Trigger browser file download from Blob
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ============================================================================
// 1. RESOURCE 1: Rubrik Penilaian Pembentangan Kumpulan Murid (PAK-21)
// ============================================================================

export interface RubricCriterion {
  id: string;
  name: { bm: string; en: string };
  weight: string;
  levels: {
    level4: { bm: string; en: string }; // Cemerlang (4)
    level3: { bm: string; en: string }; // Baik (3)
    level2: { bm: string; en: string }; // Memuaskan (2)
    level1: { bm: string; en: string }; // Perlu Bimbingan (1)
  };
}

export const PRESENTATION_RUBRIC_DATA: {
  title: { bm: string; en: string };
  subtitle: { bm: string; en: string };
  instructions: { bm: string; en: string };
  criteria: RubricCriterion[];
} = {
  title: {
    bm: 'RUBRIK PENILAIAN PEMBENTANGAN KUMPULAN (PAK-21)',
    en: 'STUDENT GROUP PRESENTATION RUBRIC (21ST CENTURY SKILLS)',
  },
  subtitle: {
    bm: 'Format Penilaian Autentik Pembelajaran Berasaskan Murid · Selaras Amalan PAK-21 & TS25',
    en: 'Authentic Student-Centered Assessment Matrix · Aligned with PAK-21 & TS25 Practices',
  },
  instructions: {
    bm: 'Arahan: Tandakan (/) pada tahap penguasaan murid bagi setiap kriteria. Jumlahkan skor dan catatkan maklum balas deskriptif untuk penambahbaikan.',
    en: 'Instructions: Mark (/) the performance level for each criterion. Sum total score and provide descriptive feedback for student growth.',
  },
  criteria: [
    {
      id: 'kandungan',
      name: {
        bm: '1. Kandungan & Ketepatan Fakta',
        en: '1. Content & Factual Accuracy',
      },
      weight: '25%',
      levels: {
        level4: {
          bm: 'Maklumat sangat tepat, mendalam, tersusun rapi, dan disokong fakta/bukti yang kukuh serta contoh kontekstual.',
          en: 'Content is exceptionally accurate, insightful, well-organized, and supported by robust evidence and relevant examples.',
        },
        level3: {
          bm: 'Maklumat tepat dan jelas dengan penerangan yang memadai serta contoh yang bersesuaian.',
          en: 'Content is accurate and clear with adequate explanations and appropriate contextual examples.',
        },
        level2: {
          bm: 'Maklumat mencukupi tetapi terdapat sedikit kekeliruan konsep atau fakta asas yang kurang jelas.',
          en: 'Content is basic; contains minor misconceptions or vague explanations needing teacher guidance.',
        },
        level1: {
          bm: 'Maklumat tidak lengkap, banyak kesilapan konsep, atau tersasar daripada tajuk yang ditetapkan.',
          en: 'Content is incomplete, inaccurate, or off-topic with minimal understanding shown.',
        },
      },
    },
    {
      id: 'penyampaian',
      name: {
        bm: '2. Kejelasan & Gaya Penyampaian',
        en: '2. Delivery & Communication Clarity',
      },
      weight: '25%',
      levels: {
        level4: {
          bm: 'Suara jelas, intonasi bertenaga, sebutan baku, kontak mata konsisten, penuh keyakinan dan memukau audiens.',
          en: 'Loud and clear voice, varied tone, confident eye contact, clear pronunciation, engaging the audience effectively.',
        },
        level3: {
          bm: 'Suara jelas dan lancar, kontak mata baik, yakin dan mampu mengekalkan minat audiens sepanjang masa.',
          en: 'Clear and fluent voice, good eye contact, confident demeanour, and sustained audience attention.',
        },
        level2: {
          bm: 'Suara adakalanya perlahan/teragak-agak, banyak bergantung pada nota bacaan, kontak mata terhad.',
          en: 'Voice occasionally soft or hesitant, heavy reliance on reading notes, limited eye contact.',
        },
        level1: {
          bm: 'Suara sukar didengari, membaca slaid sepenuhnya tanpa kontak mata, kurang berkeyakinan.',
          en: 'Inaudible or monotone, reads entirely from slides/paper, avoids eye contact.',
        },
      },
    },
    {
      id: 'kerjasama',
      name: {
        bm: '3. Kerjasama & Keterlibatan Pasukan',
        en: '3. Teamwork & Equal Participation',
      },
      weight: '25%',
      levels: {
        level4: {
          bm: 'Semua ahli memainkan peranan aktif dan seimbang; peralihan antara pembentang sangat lancar dan saling menyokong.',
          en: 'All members actively and equally participate; seamless handoffs and evident mutual support among peers.',
        },
        level3: {
          bm: 'Majoriti ahli terlibat aktif dalam pembentangan; pembahagian tugas jelas dan saling melengkapi.',
          en: 'Most members actively present; clear division of roles with positive group synergy.',
        },
        level2: {
          bm: 'Penglibatan tidak seimbang (didominasi 1–2 ahli sahaja); ahli lain kelihatan pasif semasa rakan membentang.',
          en: 'Unequal contribution (dominated by 1–2 students); others appear passive or disengaged.',
        },
        level1: {
          bm: 'Tiada kerjasama jelas; hanya seorang ahli berucap manakala ahli lain tidak mengambil bahagian.',
          en: 'Lack of teamwork; single presenter with no observable collaboration or coordination.',
        },
      },
    },
    {
      id: 'kreativiti_visual',
      name: {
        bm: '4. Kreativiti Alat Bantuan Visual',
        en: '4. Visual Aids & Creative Media',
      },
      weight: '15%',
      levels: {
        level4: {
          bm: 'Bahan visual/slaid/carta sangat menarik, kemas, ringkas, kontras warna harmoni, dan menyokong pemahaman konsep.',
          en: 'Visuals/slides/posters are highly attractive, clean, uncluttered, contrasting, and directly amplify understanding.',
        },
        level3: {
          bm: 'Bahan visual kemas dan membantu penerangan; susun atur teks dan grafik mudah dibaca dari jauh.',
          en: 'Visuals are neat and effective; text and layout are legible from a distance.',
        },
        level2: {
          bm: 'Bahan visual padat dengan ayat panjang, saiz fon terlalu kecil, atau gambar kurang relevan.',
          en: 'Visuals contain cluttered walls of text, small fonts, or marginally relevant graphics.',
        },
        level1: {
          bm: 'Tiada bahan bantuan visual atau bahan yang disediakan comot dan tidak dapat dibaca.',
          en: 'No visual aids used or materials are illegible and distract from the presentation.',
        },
      },
    },
    {
      id: 'soal_jawab',
      name: {
        bm: '5. Sesi Soal Jawab & Hujah Kritis',
        en: '5. Q&A Engagement & Critical Thinking',
      },
      weight: '10%',
      levels: {
        level4: {
          bm: 'Menjawab soalan guru dan rakan dengan pantas, yakin, berhemah, serta memberikan justifikasi bernas.',
          en: 'Answers questions promptly, confidently, respectfully, and provides insightful supporting rationale.',
        },
        level3: {
          bm: 'Mampu menjawab soalan dengan tepat dan sopan; menunjukkan penguasaan topik yang baik.',
          en: 'Answers questions accurately and politely; demonstrates solid topic mastery.',
        },
        level2: {
          bm: 'Menjawab soalan dengan bantuan/bimbingan minima guru; jawapan agak terhad.',
          en: 'Answers questions with teacher prompting; responses are brief or somewhat hesitant.',
        },
        level1: {
          bm: 'Tidak dapat menjawab soalan rakan/guru atau enggan memberi maklum balas.',
          en: 'Unable or unwilling to answer audience/teacher questions.',
        },
      },
    },
  ],
};

/**
 * Generate native OpenXML .docx for Presentation Rubric
 */
export async function generatePresentationRubricDocx(language: Language): Promise<Blob> {
  const isBm = language === 'bm';
  const data = PRESENTATION_RUBRIC_DATA;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // ~20mm
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.title[language],
                bold: true,
                size: 28, // 14pt
                color: '0066CC',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: data.subtitle[language],
                bold: true,
                size: 19, // 9.5pt
                color: '334155',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `BaMuDi Digital Companion · ${isBm ? 'Bahan Bantu Mengajar PAK-21 & TS25' : 'Classroom Assessment Matrix'}`,
                italics: true,
                size: 17,
                color: '64748B',
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: isBm ? 'Nama Kumpulan / Tajuk: ' : 'Group / Topic: ', bold: true }),
                          new TextRun({ text: '________________________________' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: isBm ? 'Kelas: ' : 'Class: ', bold: true }),
                          new TextRun({ text: '__________________' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: isBm ? 'Ahli Kumpulan: ' : 'Team Members: ', bold: true }),
                          new TextRun({ text: '1. _______________  2. _______________' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: isBm ? 'Tarikh: ' : 'Date: ', bold: true }),
                          new TextRun({ text: '__________________' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: isBm ? 'Ahli Kumpulan (Samb.): ' : 'Members (Cont.): ', bold: true }),
                          new TextRun({ text: '3. _______________  4. _______________' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: isBm ? 'Mata Pelajaran: ' : 'Subject: ', bold: true }),
                          new TextRun({ text: '__________________' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            spacing: { before: 200, after: 160 },
            children: [
              new TextRun({
                text: data.instructions[language],
                italics: true,
                size: 17,
                color: '475569',
              }),
            ],
          }),

          // Rubric Matrix Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '007ACC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Kriteria & Wajaran' : 'Criteria & Weight', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '007ACC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tahap 4: Cemerlang (4)' : 'Level 4: Excellent (4)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '007ACC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tahap 3: Baik (3)' : 'Level 3: Good (3)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '007ACC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tahap 2: Memuaskan (2)' : 'Level 2: Fair (2)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '007ACC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tahap 1: Bimbingan (1)' : 'Level 1: Needs Support (1)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '007ACC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Skor' : 'Score', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              ...data.criteria.map(
                (c) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                        children: [
                          new Paragraph({ children: [new TextRun({ text: c.name[language], bold: true })] }),
                          new Paragraph({ children: [new TextRun({ text: `[${isBm ? 'Wajaran' : 'Weight'}: ${c.weight}]`, size: 16, color: '0284C7' })] }),
                        ],
                      }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c.levels.level4[language], size: 17 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c.levels.level3[language], size: 17 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c.levels.level2[language], size: 17 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c.levels.level1[language], size: 17 })] })] }),
                      new TableCell({
                        shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '___ / 4', bold: true })] })],
                      }),
                    ],
                  })
              ),
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 5,
                    shading: { type: ShadingType.CLEAR, fill: 'EEF2FF' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: isBm ? 'JUMLAH SKOR KESELURUHAN (Maksimum 20):' : 'TOTAL OVERALL SCORE (Max 20):',
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'EEF2FF' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: '___ / 20', bold: true, color: '0066CC', size: 22 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 240 } }),

          // Feedback table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Kekuatan & Aspek Cemerlang:' : 'Strengths & Highlights:', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '\n\n' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Cadangan Penambahbaikan (Deskriptif):' : 'Suggestions for Improvement:', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: '\n\n' })] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 360 } }),

          // Signature lines
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________' })] }),
                      new Paragraph({ children: [new TextRun({ text: isBm ? 'Tandatangan Guru Pentaksir' : 'Teacher Assessor Signature', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: `${isBm ? 'Nama:' : 'Name:'} __________________________` })] }),
                    ],
                  }),
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '________________________________________' })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: isBm ? 'Tandatangan Ketua Kumpulan Murid' : 'Student Group Leader Signature', bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${isBm ? 'Nama:' : 'Name:'} __________________________` })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240 },
            children: [
              new TextRun({
                text: 'BaMuDi · Bahan Murid Digital · Templat Boleh Diubah Suai Sedia Digunakan',
                size: 15,
                color: '94A3B8',
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Generate PDF for Presentation Rubric
 */
export function generatePresentationRubricPdf(language: Language): Blob {
  const isBm = language === 'bm';
  const data = PRESENTATION_RUBRIC_DATA;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm

  let currentY = 12;

  // Header Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 102, 204);
  doc.text(data.title[language], pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(data.subtitle[language], pageWidth / 2, currentY, { align: 'center' });

  currentY += 3.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `BaMuDi Educational Companion · ${isBm ? 'Bahan PdP PAK-21 & TS25' : 'Classroom Assessment Matrix'}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 2.5;
  // Decorative line
  doc.setDrawColor(0, 153, 255);
  doc.setLineWidth(0.7);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 3.5;

  // Metadata Table
  const metaBody = [
    [
      { content: isBm ? 'KUMPULAN / TAJUK:' : 'GROUP / TOPIC:', styles: { fontStyle: 'bold' } },
      { content: '____________________________' },
      { content: isBm ? 'KELAS:' : 'CLASS:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
    [
      { content: isBm ? 'AHLI KUMPULAN:' : 'MEMBERS:', styles: { fontStyle: 'bold' } },
      { content: '1. ____________  2. ____________' },
      { content: isBm ? 'TARIKH:' : 'DATE:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
    [
      { content: isBm ? 'AHLI (SAMB.):' : 'MEMBERS (CONT):', styles: { fontStyle: 'bold' } },
      { content: '3. ____________  4. ____________' },
      { content: isBm ? 'SUBJEK:' : 'SUBJECT:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: metaBody as any,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
      textColor: [15, 23, 42],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 32, fillColor: [248, 250, 252] },
      1: { cellWidth: 78 },
      2: { cellWidth: 22, fillColor: [248, 250, 252] },
      3: { cellWidth: 54 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 3.5;

  // Instructions
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(data.instructions[language], margin, currentY, { maxWidth: contentWidth });

  currentY += 4.5;

  // Rubric Matrix Table
  const rubricHead = [
    [
      isBm ? 'Kriteria & Wajaran' : 'Criteria & Weight',
      isBm ? 'Cemerlang (4)' : 'Excellent (4)',
      isBm ? 'Baik (3)' : 'Good (3)',
      isBm ? 'Memuaskan (2)' : 'Fair (2)',
      isBm ? 'Bimbingan (1)' : 'Needs Support (1)',
      isBm ? 'Skor' : 'Score',
    ],
  ];

  const rubricRows = data.criteria.map((c) => [
    `${c.name[language]}\n[${isBm ? 'Wajaran' : 'Weight'}: ${c.weight}]`,
    c.levels.level4[language],
    c.levels.level3[language],
    c.levels.level2[language],
    c.levels.level1[language],
    '__ / 4',
  ]);

  rubricRows.push([
    isBm ? 'JUMLAH SKOR KESELURUHAN (Maks: 20):' : 'TOTAL OVERALL SCORE (Max: 20):',
    '',
    '',
    '',
    '',
    '__ / 20',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: rubricHead,
    body: rubricRows,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 122, 204],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
      cellPadding: 1.8,
    },
    styles: {
      fontSize: 6.8,
      cellPadding: 1.6,
      textColor: [15, 23, 42],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      valign: 'top',
    },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: 'bold', fillColor: [241, 245, 249] },
      1: { cellWidth: 35 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 29 },
      5: { cellWidth: 14, halign: 'center', fontStyle: 'bold', valign: 'middle' },
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.row.index === rubricRows.length - 1) {
        hookData.cell.styles.fillColor = [238, 242, 255];
        hookData.cell.styles.fontStyle = 'bold';
        if (hookData.column.index === 0) {
          hookData.cell.styles.halign = 'right';
          (hookData.cell as any).colSpan = 5;
        }
      }
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Feedback Table
  const feedbackHead = [[isBm ? 'MAKLUM BALAS GURU & REFLEKSI' : 'TEACHER FEEDBACK & REFLECTION']];
  const feedbackBody = [
    [`${isBm ? 'Kekuatan / Aspek Cemerlang:' : 'Key Strengths:'}\n\n`],
    [`${isBm ? 'Cadangan Penambahbaikan (Deskriptif):' : 'Areas for Growth:'}\n\n`],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: feedbackHead,
    body: feedbackBody,
    theme: 'grid',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [30, 41, 59],
      fontStyle: 'bold',
      fontSize: 7.2,
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // Signature Block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  doc.text('________________________________________', margin, currentY);
  doc.text('________________________________________', margin + contentWidth, currentY, { align: 'right' });

  currentY += 3.5;
  doc.setFont('helvetica', 'bold');
  doc.text(isBm ? 'Tandatangan Guru Penilai' : 'Assessor Teacher Signature', margin, currentY);
  doc.text(isBm ? 'Tandatangan Ketua Murid' : 'Student Leader Signature', margin + contentWidth, currentY, { align: 'right' });

  // Footer branding
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `BaMuDi · ${isBm ? 'Bahan Murid Digital – Templat Pentaksiran Bilik Darjah' : 'Digital Classroom Assessment Template'} · Dokumen Mesra Cetak A4`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  return doc.output('blob');
}

// ============================================================================
// 2. RESOURCE 2: Lembaran Kerja Inkuiri Sains Berasaskan Eksperimen
// ============================================================================

export interface ScienceInquiryData {
  title: { bm: string; en: string };
  subtitle: { bm: string; en: string };
  instructions: { bm: string; en: string };
  sections: {
    problemStatement: { title: { bm: string; en: string }; prompt: { bm: string; en: string } };
    hypothesis: { title: { bm: string; en: string }; prompt: { bm: string; en: string } };
    variables: {
      title: { bm: string; en: string };
      manipulated: { bm: string; en: string };
      responding: { bm: string; en: string };
      constant: { bm: string; en: string };
    };
    apparatus: { title: { bm: string; en: string }; prompt: { bm: string; en: string } };
    procedure: { title: { bm: string; en: string }; prompt: { bm: string; en: string } };
    observation: {
      title: { bm: string; en: string };
      tableHeaders: {
        col1: { bm: string; en: string };
        col2: { bm: string; en: string };
        col3: { bm: string; en: string };
      };
    };
    analysis: {
      title: { bm: string; en: string };
      q1: { bm: string; en: string };
      q2: { bm: string; en: string };
    };
    conclusion: { title: { bm: string; en: string }; prompt: { bm: string; en: string } };
  };
}

export const SCIENCE_INQUIRY_DATA: ScienceInquiryData = {
  title: {
    bm: 'LEMBARAN PENYIASATAN SAINTIFIK & INKUIRI SAINS',
    en: 'SCIENTIFIC INQUIRY & EXPERIMENTAL INVESTIGATION WORKSHEET',
  },
  subtitle: {
    bm: 'Berasaskan Kerangka Kaedah Saintifik KSSR & KSSM · Format Pembelajaran Berasaskan Inkuiri',
    en: 'Based on KSSR & KSSM Scientific Method Framework · Inquiry-Based Learning Format',
  },
  instructions: {
    bm: 'Arahan: Lengkapkan setiap bahagian penyiasatan ini secara individu atau bersama rakan kumpulan mengikut langkah kaedah saintifik.',
    en: 'Instructions: Complete each section individually or collaboratively following the systematic steps of scientific method.',
  },
  sections: {
    problemStatement: {
      title: {
        bm: '1. Pernyataan Masalah (Problem Statement)',
        en: '1. Problem Statement',
      },
      prompt: {
        bm: 'Apakah persoalan saintifik yang ingin dijawab melalui eksperimen ini?',
        en: 'What scientific question are you investigating in this experiment?',
      },
    },
    hypothesis: {
      title: {
        bm: '2. Hipotesis (Hypothesis)',
        en: '2. Hypothesis',
      },
      prompt: {
        bm: 'Semakin (bertambah / berkurang) __________________________, semakin (bertambah / berkurang) __________________________.',
        en: 'The more / less __________________________, the more / less __________________________.',
      },
    },
    variables: {
      title: {
        bm: '3. Pemboleh Ubah (Variables)',
        en: '3. Variables Identification',
      },
      manipulated: {
        bm: '(a) Dimanipulasikan (PM) / Manipulated Variable: __________________________________________________',
        en: '(a) Manipulated / Independent Variable: __________________________________________________',
      },
      responding: {
        bm: '(b) Bergerak Balas (PB) / Responding Variable: __________________________________________________',
        en: '(b) Responding / Dependent Variable: __________________________________________________',
      },
      constant: {
        bm: '(c) Dimalarkan (PMal) / Controlled Variable: __________________________________________________',
        en: '(c) Controlled / Constant Variable: __________________________________________________',
      },
    },
    apparatus: {
      title: {
        bm: '4. Radas, Bahan & Susunan Eksperimen (Apparatus & Setup)',
        en: '4. Apparatus, Materials & Diagram Setup',
      },
      prompt: {
        bm: 'Senaraikan radas dan lakar susunan eksperimen berlabel dalam ruangan yang disediakan:',
        en: 'List apparatus and sketch the labeled experimental setup in the box provided:',
      },
    },
    procedure: {
      title: {
        bm: '5. Langkah & Prosedur Utama (Key Procedures)',
        en: '5. Key Procedures & Safety Precautions',
      },
      prompt: {
        bm: '1. ____________________________________________________________________________________\n2. ____________________________________________________________________________________\n3. ____________________________________________________________________________________',
        en: '1. ____________________________________________________________________________________\n2. ____________________________________________________________________________________\n3. ____________________________________________________________________________________',
      },
    },
    observation: {
      title: {
        bm: '6. Jadual Perekodan Data & Pemerhatian (Data Table)',
        en: '6. Observation & Data Recording Table',
      },
      tableHeaders: {
        col1: {
          bm: 'Pemboleh Ubah Dimanipulasi (Unit)',
          en: 'Manipulated Variable (Unit)',
        },
        col2: {
          bm: 'Bacaan 1 / Bacaan 2 / Purata',
          en: 'Trial 1 / Trial 2 / Average',
        },
        col3: {
          bm: 'Pemerhatian / Catatan Kualitatif',
          en: 'Observation / Qualitative Notes',
        },
      },
    },
    analysis: {
      title: {
        bm: '7. Analisis Data & Perbincangan (Data Analysis)',
        en: '7. Data Analysis & Discussion',
      },
      q1: {
        bm: '(a) Nyatakan corak perubahan atau hubungan antara pemboleh ubah dalam graf/jadual anda:',
        en: '(a) State the pattern of change or relationship between the variables observed in your data:',
      },
      q2: {
        bm: '(b) Apakah langkah berjaga-jaga yang diambil untuk mendapatkan bacaan yang jitu?',
        en: '(b) What precautions were taken to ensure precise and accurate measurements?',
      },
    },
    conclusion: {
      title: {
        bm: '8. Kesimpulan & Refleksi (Conclusion)',
        en: '8. Conclusion & Reflection',
      },
      prompt: {
        bm: 'Adakah hipotesis diterima? Rumusan: ____________________________________________________________________________',
        en: 'Is the hypothesis accepted? Summary: ____________________________________________________________________________',
      },
    },
  },
};

/**
 * Generate native OpenXML .docx for Science Inquiry Worksheet
 */
export async function generateScienceInquiryDocx(language: Language): Promise<Blob> {
  const isBm = language === 'bm';
  const data = SCIENCE_INQUIRY_DATA;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.title[language],
                bold: true,
                size: 26,
                color: '0369A1',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: data.subtitle[language],
                bold: true,
                size: 18,
                color: '334155',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `BaMuDi · ${isBm ? 'Lembaran Kerja Inkuiri Sains Bilik Darjah' : 'Science Classroom Investigation Sheet'}`,
                italics: true,
                size: 16,
                color: '64748B',
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Nama Murid: ' : 'Student Name: ', bold: true }), new TextRun({ text: '____________________________' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Kelas: ' : 'Class: ', bold: true }), new TextRun({ text: '____________' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Kumpulan: ' : 'Group: ', bold: true }), new TextRun({ text: '____________' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tarikh: ' : 'Date: ', bold: true }), new TextRun({ text: '____________' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tajuk Eksperimen / SK: ' : 'Experiment Title / Topic: ', bold: true }), new TextRun({ text: '________________________________________________' })] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // 1. Problem Statement
          new Paragraph({
            children: [new TextRun({ text: data.sections.problemStatement.title[language], bold: true, color: '0284C7' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: data.sections.problemStatement.prompt[language], size: 18 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: '___________________________________________________________________________________________\n___________________________________________________________________________________________' })],
            spacing: { after: 180 },
          }),

          // 2. Hypothesis
          new Paragraph({
            children: [new TextRun({ text: data.sections.hypothesis.title[language], bold: true, color: '0284C7' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: data.sections.hypothesis.prompt[language], size: 18 })],
            spacing: { after: 180 },
          }),

          // 3. Variables
          new Paragraph({
            children: [new TextRun({ text: data.sections.variables.title[language], bold: true, color: '0284C7' })],
          }),
          new Paragraph({ children: [new TextRun({ text: data.sections.variables.manipulated[language], size: 18 })] }),
          new Paragraph({ children: [new TextRun({ text: data.sections.variables.responding[language], size: 18 })] }),
          new Paragraph({ children: [new TextRun({ text: data.sections.variables.constant[language], size: 18 })], spacing: { after: 180 } }),

          // 4. Apparatus & Diagram
          new Paragraph({
            children: [new TextRun({ text: data.sections.apparatus.title[language], bold: true, color: '0284C7' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: data.sections.apparatus.prompt[language], size: 18 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'FCFCFD' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 300, after: 300 },
                        children: [
                          new TextRun({
                            text: isBm ? '[ Ruang Lakaran Radas Eksperimen Berlabel ]' : '[ Labeled Apparatus Diagram Area ]',
                            color: '94A3B8',
                            italics: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // 5. Observation Table
          new Paragraph({
            children: [new TextRun({ text: data.sections.observation.title[language], bold: true, color: '0284C7' })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'E0F2FE' }, children: [new Paragraph({ children: [new TextRun({ text: data.sections.observation.tableHeaders.col1[language], bold: true, color: '0369A1' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'E0F2FE' }, children: [new Paragraph({ children: [new TextRun({ text: data.sections.observation.tableHeaders.col2[language], bold: true, color: '0369A1' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'E0F2FE' }, children: [new Paragraph({ children: [new TextRun({ text: data.sections.observation.tableHeaders.col3[language], bold: true, color: '0369A1' })] })] }),
                ],
              }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '1.' })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '2.' })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] }),
              new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '3.' })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // 6. Analysis & Discussion
          new Paragraph({
            children: [new TextRun({ text: data.sections.analysis.title[language], bold: true, color: '0284C7' })],
          }),
          new Paragraph({ children: [new TextRun({ text: data.sections.analysis.q1[language], size: 18 })] }),
          new Paragraph({ children: [new TextRun({ text: '___________________________________________________________________________________________\n___________________________________________________________________________________________' })] }),
          new Paragraph({ children: [new TextRun({ text: data.sections.analysis.q2[language], size: 18 })] }),
          new Paragraph({ children: [new TextRun({ text: '___________________________________________________________________________________________\n___________________________________________________________________________________________' })], spacing: { after: 180 } }),

          // 7. Conclusion
          new Paragraph({
            children: [new TextRun({ text: data.sections.conclusion.title[language], bold: true, color: '0284C7' })],
          }),
          new Paragraph({
            children: [new TextRun({ text: data.sections.conclusion.prompt[language], size: 18 })],
            spacing: { after: 180 },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240 },
            children: [
              new TextRun({
                text: 'BaMuDi · Lembaran Inkuiri Sains Sedia Digunakan · Boleh Diubah Suai',
                size: 15,
                color: '94A3B8',
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Generate PDF for Science Inquiry Worksheet
 */
export function generateScienceInquiryPdf(language: Language): Blob {
  const isBm = language === 'bm';
  const data = SCIENCE_INQUIRY_DATA;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 12;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(2, 132, 199);
  doc.text(data.title[language], pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(data.subtitle[language], pageWidth / 2, currentY, { align: 'center' });

  currentY += 3;
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.7);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 3.5;

  // Student Meta Table
  const metaBody = [
    [
      { content: isBm ? 'NAMA MURID:' : 'STUDENT NAME:', styles: { fontStyle: 'bold' } },
      { content: '____________________________' },
      { content: isBm ? 'KELAS:' : 'CLASS:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
    [
      { content: isBm ? 'KUMPULAN:' : 'GROUP:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
      { content: isBm ? 'TARIKH:' : 'DATE:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
    [
      { content: isBm ? 'TAJUK PENYIASATAN:' : 'EXPERIMENT TITLE:', styles: { fontStyle: 'bold' } },
      { content: '____________________________________________________________________' },
      { content: isBm ? 'GURU:' : 'TEACHER:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: metaBody as any,
    theme: 'grid',
    styles: {
      fontSize: 7.2,
      cellPadding: 1.4,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 32, fillColor: [248, 250, 252] },
      1: { cellWidth: 78 },
      2: { cellWidth: 22, fillColor: [248, 250, 252] },
      3: { cellWidth: 54 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 3.5;

  const renderBox = (title: string, prompt: string, boxHeight: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(2, 132, 199);
    doc.text(title, margin, currentY);

    currentY += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    doc.text(prompt, margin, currentY, { maxWidth: contentWidth });

    currentY += 3.5;

    if (boxHeight > 0) {
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(250, 250, 252);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.roundedRect(margin, currentY, contentWidth, boxHeight, 1.5, 1.5, 'FD');
      doc.setLineDashPattern([], 0);
      currentY += boxHeight + 3;
    }
  };

  renderBox(data.sections.problemStatement.title[language], data.sections.problemStatement.prompt[language], 10);
  renderBox(data.sections.hypothesis.title[language], data.sections.hypothesis.prompt[language], 10);

  // Variables
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(2, 132, 199);
  doc.text(data.sections.variables.title[language], margin, currentY);
  currentY += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  doc.text(data.sections.variables.manipulated[language], margin + 2, currentY);
  currentY += 3.2;
  doc.text(data.sections.variables.responding[language], margin + 2, currentY);
  currentY += 3.2;
  doc.text(data.sections.variables.constant[language], margin + 2, currentY);
  currentY += 4;

  // Apparatus
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(2, 132, 199);
  doc.text(data.sections.apparatus.title[language], margin, currentY);
  currentY += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  doc.text(data.sections.apparatus.prompt[language], margin, currentY);
  currentY += 3;

  doc.setDrawColor(148, 163, 184);
  doc.setFillColor(253, 253, 254);
  doc.setLineDashPattern([2, 2], 0);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    isBm
      ? '[ Ruang Lakaran Susunan Radas & Bahan Saintifik Berlabel ]'
      : '[ Space for Labeled Apparatus Setup Diagram ]',
    pageWidth / 2,
    currentY + 13,
    { align: 'center' }
  );

  currentY += 27;

  // Data Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(2, 132, 199);
  doc.text(data.sections.observation.title[language], margin, currentY);
  currentY += 2.5;

  const obsHead = [
    [
      data.sections.observation.tableHeaders.col1[language],
      data.sections.observation.tableHeaders.col2[language],
      data.sections.observation.tableHeaders.col3[language],
    ],
  ];

  const obsRows = [
    ['1.', '', ''],
    ['2.', '', ''],
    ['3.', '', ''],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: obsHead,
    body: obsRows,
    theme: 'grid',
    headStyles: {
      fillColor: [224, 242, 254],
      textColor: [3, 105, 161],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
      cellPadding: 1.5,
    },
    styles: {
      fontSize: 7,
      cellPadding: 2.2,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 68 },
      2: { cellWidth: 68 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 3.5;

  renderBox(data.sections.analysis.title[language], data.sections.analysis.q1[language], 8);
  renderBox(data.sections.conclusion.title[language], data.sections.conclusion.prompt[language], 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `BaMuDi · ${isBm ? 'Lembaran Kerja Inkuiri Sains Sekolah' : 'Classroom Science Inquiry Worksheet'} · Format Cetak A4 Standard`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  return doc.output('blob');
}

// ============================================================================
// 3. RESOURCE 3: Pek Lembaran Peta Pemikiran i-Think (8 Peta Visual)
// ============================================================================

export interface IThinkMapDefinition {
  id: string;
  name: { bm: string; en: string };
  purpose: { bm: string; en: string };
  thinkingProcess: { bm: string; en: string };
  promptText: { bm: string; en: string };
}

export const ITHINK_MAPS: IThinkMapDefinition[] = [
  {
    id: 'circle',
    name: { bm: '1. Peta Bulatan (Circle Map)', en: '1. Circle Map' },
    purpose: { bm: 'Sumbang saran idea & mendefinisikan mengikut konteks', en: 'Brainstorming ideas & defining in context' },
    thinkingProcess: { bm: 'Mendefinisikan Mengikut Konteks', en: 'Defining in Context' },
    promptText: { bm: 'Tulis topik/konsep di bulatan tengah. Tulis semua idea, fakta atau pengetahuan berkaitan di bulatan luar.', en: 'Write topic in inner circle. Write all related facts, knowledge and ideas in outer circle.' },
  },
  {
    id: 'bubble',
    name: { bm: '2. Peta Buih (Bubble Map)', en: '2. Bubble Map' },
    purpose: { bm: 'Menerangkan kualiti, sifat atau ciri menggunakan kata adjektif', en: 'Describing qualities, traits and characteristics using adjectives' },
    thinkingProcess: { bm: 'Menerangkan Ciri / Sifat', en: 'Describing Qualities' },
    promptText: { bm: 'Tulis nama objek/watak di bulatan tengah. Tulis kata adjektif atau ciri-ciri khusus di buih-buih sekeliling.', en: 'Write character/object in central bubble. Write descriptive adjectives in surrounding bubbles.' },
  },
  {
    id: 'double-bubble',
    name: { bm: '3. Peta Buih Berganda (Double Bubble Map)', en: '3. Double Bubble Map' },
    purpose: { bm: 'Membanding dan membezakan dua konsep, objek atau peristiwa', en: 'Comparing and contrasting two concepts, objects or events' },
    thinkingProcess: { bm: 'Membanding & Membeza', en: 'Comparing & Contrasting' },
    promptText: { bm: 'Tulis persamaan di buih tengah yang menghubungkan kedua-duanya. Tulis perbezaan unik di buih luar.', en: 'Write similarities in connected center bubbles. Write unique differences in outer bubbles.' },
  },
  {
    id: 'tree',
    name: { bm: '4. Peta Pokok (Tree Map)', en: '4. Tree Map' },
    purpose: { bm: 'Mengelaskan dan mengkategorikan maklumat kepada kumpulan', en: 'Classifying and grouping information into structured categories' },
    thinkingProcess: { bm: 'Membuat Pengelasan & Kategori', en: 'Classifying & Categorizing' },
    promptText: { bm: 'Tulis tajuk utama di bahagian atas. Tulis subkategori di cawangan kedua, dan contoh-contoh di bawah.', en: 'Write main topic at top. Write subcategories in second branch, and specific examples below.' },
  },
  {
    id: 'brace',
    name: { bm: '5. Peta Dakap (Brace Map)', en: '5. Brace Map' },
    purpose: { bm: 'Menganalisis hubungan bahagian kepada keseluruhan objek fizikal', en: 'Analyzing part-to-whole relationships of physical objects' },
    thinkingProcess: { bm: 'Hubungan Bahagian-Keseluruhan', en: 'Part-Whole Relationships' },
    promptText: { bm: 'Tulis nama keseluruhan objek fizikal di sebelah kiri, diikuti komponen utama dan bahagian-bahagian kecil.', en: 'Write whole physical object on the left, followed by major components and subparts.' },
  },
  {
    id: 'flow',
    name: { bm: '6. Peta Alir (Flow Map)', en: '6. Flow Map' },
    purpose: { bm: 'Menyusun urutan peringkat, kronologi sejarah atau proses kerja', en: 'Sequencing stages, historical chronologies or process steps' },
    thinkingProcess: { bm: 'Urutan & Peringkat Proses', en: 'Sequencing & Process Steps' },
    promptText: { bm: 'Tulis peringkat pertama dalam kotak awal. Ikuti anak panah untuk menulis langkah berikutnya secara berurutan.', en: 'Write first step in initial box. Follow arrows to record subsequent steps in sequence.' },
  },
  {
    id: 'multi-flow',
    name: { bm: '7. Peta Pelbagai Alir (Multi-Flow Map)', en: '7. Multi-Flow Map' },
    purpose: { bm: 'Menganalisis punca (sebab) dan akibat (kesan) sesuatu peristiwa', en: 'Analyzing cause-and-effect relationships of an event' },
    thinkingProcess: { bm: 'Sebab & Akibat (Punca & Kesan)', en: 'Cause & Effect Analysis' },
    promptText: { bm: 'Tulis peristiwa utama di kotak tengah. Tulis punca/sebab di sebelah kiri, dan kesan/akibat di sebelah kanan.', en: 'Write major event in center. Write causes on left side, and effects/consequences on right side.' },
  },
  {
    id: 'bridge',
    name: { bm: '8. Peta Titi (Bridge Map)', en: '8. Bridge Map' },
    purpose: { bm: 'Mengaplikasikan analogi dan mencari hubungan faktor perkaitan', en: 'Seeing analogies and applying relating factors across pairs' },
    thinkingProcess: { bm: 'Melihat Analogi & Hubungan', en: 'Seeing Analogies & Relationships' },
    promptText: { bm: 'Nyatakan faktor perkaitan (Relating Factor). Isikan pasangan konsep yang berkongsi perkaitan yang sama.', en: 'State relating factor. Fill concept pairs that share the exact same relationship.' },
  },
];

/**
 * Generate 8-Page Vector PDF for i-Think Templates Pack
 */
export function generateIThinkPdf(language: Language): Blob {
  const isBm = language === 'bm';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  ITHINK_MAPS.forEach((map, idx) => {
    if (idx > 0) doc.addPage();

    // 1. Header Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text(map.name[language], pageWidth / 2, 16, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(
      `${isBm ? 'Proses Pemikiran:' : 'Thinking Process:'} ${map.thinkingProcess[language]} · ${map.purpose[language]}`,
      pageWidth / 2,
      21.5,
      { align: 'center' }
    );

    // Decorative brand line
    doc.setDrawColor(0, 153, 255);
    doc.setLineWidth(0.7);
    doc.line(margin, 24.5, margin + contentWidth, 24.5);

    // 2. Student Meta Box
    const metaBody = [
      [
        { content: isBm ? 'NAMA MURID:' : 'STUDENT NAME:', styles: { fontStyle: 'bold' } },
        { content: '________________________________' },
        { content: isBm ? 'KELAS:' : 'CLASS:', styles: { fontStyle: 'bold' } },
        { content: '____________' },
      ],
      [
        { content: isBm ? 'MATA PELAJARAN:' : 'SUBJECT:', styles: { fontStyle: 'bold' } },
        { content: '________________________________' },
        { content: isBm ? 'TARIKH:' : 'DATE:', styles: { fontStyle: 'bold' } },
        { content: '____________' },
      ],
    ];

    autoTable(doc, {
      startY: 27,
      margin: { left: margin, right: margin },
      body: metaBody as any,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 1.5, lineColor: [203, 213, 225], lineWidth: 0.2 },
      columnStyles: {
        0: { cellWidth: 32, fillColor: [248, 250, 252] },
        1: { cellWidth: 80 },
        2: { cellWidth: 20, fillColor: [248, 250, 252] },
        3: { cellWidth: 50 },
      },
    });

    const startY = (doc as any).lastAutoTable.finalY + 4;

    // Prompt instructions
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(map.promptText[language], margin, startY, { maxWidth: contentWidth });

    // 3. Frame of Reference (Bingkai Rujukan) Outer Box
    const frameY = startY + 5;
    const frameHeight = pageHeight - frameY - 20;

    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(254, 254, 255);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, frameY, contentWidth, frameHeight, 2, 2, 'FD');

    // Frame of reference label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      isBm ? 'BINGKAI RUJUKAN (Sumber Maklumat / Rujukan Murid)' : 'FRAME OF REFERENCE (Sources of Knowledge / Perspectives)',
      margin + 4,
      frameY + 5
    );

    // 4. Draw Specific Diagram vector shapes for each map type
    const canvasCenterX = pageWidth / 2;
    const canvasCenterY = frameY + frameHeight / 2 + 2;

    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);

    if (map.id === 'circle') {
      // Circle Map: Inner circle + Outer circle
      doc.setFillColor(240, 249, 255);
      doc.circle(canvasCenterX, canvasCenterY, 68, 'FD');
      doc.setFillColor(255, 255, 255);
      doc.circle(canvasCenterX, canvasCenterY, 26, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(3, 105, 161);
      doc.text(isBm ? '[ Topik / Konsep ]' : '[ Core Topic ]', canvasCenterX, canvasCenterY - 1, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(isBm ? '(Idea / Fakta Kontekstual)' : '(Ideas / Facts in Context)', canvasCenterX, canvasCenterY - 48, { align: 'center' });
    } else if (map.id === 'bubble') {
      // Bubble Map: Center circle + 6 outer circles with connecting lines
      const radius = 17;
      const dist = 52;
      const angles = [0, 60, 120, 180, 240, 300];

      // Lines
      angles.forEach((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = canvasCenterX + dist * Math.cos(rad);
        const y = canvasCenterY + dist * Math.sin(rad);
        doc.line(canvasCenterX, canvasCenterY, x, y);
      });

      // Outer circles
      doc.setFillColor(255, 255, 255);
      angles.forEach((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = canvasCenterX + dist * Math.cos(rad);
        const y = canvasCenterY + dist * Math.sin(rad);
        doc.circle(x, y, radius, 'FD');
      });

      // Center circle
      doc.setFillColor(224, 242, 254);
      doc.circle(canvasCenterX, canvasCenterY, 22, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(3, 105, 161);
      doc.text(isBm ? '[ Objek / Topik ]' : '[ Topic / Concept ]', canvasCenterX, canvasCenterY + 1, { align: 'center' });
    } else if (map.id === 'double-bubble') {
      // Double bubble: 2 main concept bubbles + 3 center similarity bubbles + 4 outer difference bubbles
      const leftX = canvasCenterX - 45;
      const rightX = canvasCenterX + 45;

      // Connecting lines
      [-32, 0, 32].forEach((offsetY) => {
        doc.line(leftX, canvasCenterY, canvasCenterX, canvasCenterY + offsetY);
        doc.line(rightX, canvasCenterY, canvasCenterX, canvasCenterY + offsetY);
      });
      [-38, 38].forEach((offsetY) => {
        doc.line(leftX, canvasCenterY, leftX - 35, canvasCenterY + offsetY);
        doc.line(rightX, canvasCenterY, rightX + 35, canvasCenterY + offsetY);
      });

      // Center similarity bubbles
      doc.setFillColor(254, 243, 199); // warm amber
      [-32, 0, 32].forEach((offsetY) => {
        doc.circle(canvasCenterX, canvasCenterY + offsetY, 13, 'FD');
      });

      // Outer difference bubbles
      doc.setFillColor(255, 255, 255);
      [-38, 38].forEach((offsetY) => {
        doc.circle(leftX - 35, canvasCenterY + offsetY, 12, 'FD');
        doc.circle(rightX + 35, canvasCenterY + offsetY, 12, 'FD');
      });

      // Two Main Concepts
      doc.setFillColor(224, 242, 254);
      doc.circle(leftX, canvasCenterY, 20, 'FD');
      doc.circle(rightX, canvasCenterY, 20, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(3, 105, 161);
      doc.text(isBm ? 'Konsep A' : 'Concept A', leftX, canvasCenterY + 1, { align: 'center' });
      doc.text(isBm ? 'Konsep B' : 'Concept B', rightX, canvasCenterY + 1, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(180, 83, 9);
      doc.text(isBm ? 'Persamaan' : 'Similar', canvasCenterX, canvasCenterY + 1, { align: 'center' });
    } else if (map.id === 'tree') {
      // Tree Map: Top box -> 3 branches -> 3 leaves each
      const topY = frameY + 24;
      doc.setFillColor(224, 242, 254);
      doc.roundedRect(canvasCenterX - 40, topY, 80, 14, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(3, 105, 161);
      doc.text(isBm ? '[ Tajuk / Kategori Utama ]' : '[ Main Classification ]', canvasCenterX, topY + 9, { align: 'center' });

      // Trunk line
      doc.line(canvasCenterX, topY + 14, canvasCenterX, topY + 24);
      doc.line(canvasCenterX - 55, topY + 24, canvasCenterX + 55, topY + 24);

      // 3 Categories
      [-55, 0, 55].forEach((offsetX) => {
        const branchX = canvasCenterX + offsetX;
        doc.line(branchX, topY + 24, branchX, topY + 32);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(branchX - 24, topY + 32, 48, 12, 1, 1, 'FD');
        doc.line(branchX, topY + 44, branchX, topY + 52);

        // Subitems list box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(branchX - 25, topY + 52, 50, 60, 1, 1, 'FD');
      });
    } else if (map.id === 'flow') {
      // Flow Map: 4 main process stages + sub-stages
      const boxW = 36;
      const boxH = 48;
      const gap = 8;
      const startX = margin + (contentWidth - (boxW * 4 + gap * 3)) / 2;
      const flowY = canvasCenterY - 26;

      for (let i = 0; i < 4; i++) {
        const curX = startX + i * (boxW + gap);
        doc.setFillColor(240, 249, 255);
        doc.roundedRect(curX, flowY, boxW, boxH, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(2, 132, 199);
        doc.text(`${isBm ? 'Langkah' : 'Step'} ${i + 1}`, curX + boxW / 2, flowY + 7, { align: 'center' });

        // Sub-stage box below
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(curX, flowY + boxH + 8, boxW, 26, 1.5, 1.5, 'FD');
        doc.line(curX + boxW / 2, flowY + boxH, curX + boxW / 2, flowY + boxH + 8);

        // Arrow to next box
        if (i < 3) {
          const arrowX = curX + boxW + gap / 2;
          doc.line(curX + boxW, flowY + boxH / 2, curX + boxW + gap, flowY + boxH / 2);
          doc.line(curX + boxW + gap - 2, flowY + boxH / 2 - 2, curX + boxW + gap, flowY + boxH / 2);
          doc.line(curX + boxW + gap - 2, flowY + boxH / 2 + 2, curX + boxW + gap, flowY + boxH / 2);
        }
      }
    } else if (map.id === 'multi-flow') {
      // Multi-Flow: Center Event + 3 Causes (Left) + 3 Effects (Right)
      const eventW = 50;
      const eventH = 40;
      const eventY = canvasCenterY - eventH / 2;

      // Center Event Box
      doc.setFillColor(224, 242, 254);
      doc.roundedRect(canvasCenterX - eventW / 2, eventY, eventW, eventH, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(3, 105, 161);
      doc.text(isBm ? '[ Peristiwa Utama ]' : '[ Central Event ]', canvasCenterX, canvasCenterY, { align: 'center' });

      // Causes (Left) & Effects (Right)
      const sideBoxW = 48;
      const sideBoxH = 26;
      [-36, 0, 36].forEach((offsetY) => {
        const y = canvasCenterY + offsetY - sideBoxH / 2;

        // Left cause box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin + 8, y, sideBoxW, sideBoxH, 1.5, 1.5, 'FD');
        doc.line(margin + 8 + sideBoxW, y + sideBoxH / 2, canvasCenterX - eventW / 2, canvasCenterY);

        // Right effect box
        doc.roundedRect(margin + contentWidth - sideBoxW - 8, y, sideBoxW, sideBoxH, 1.5, 1.5, 'FD');
        doc.line(canvasCenterX + eventW / 2, canvasCenterY, margin + contentWidth - sideBoxW - 8, y + sideBoxH / 2);
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(isBm ? 'PUNCA / SEBAB' : 'CAUSES', margin + 8 + sideBoxW / 2, canvasCenterY - 44, { align: 'center' });
      doc.text(isBm ? 'KESAN / AKIBAT' : 'EFFECTS', margin + contentWidth - sideBoxW / 2 - 8, canvasCenterY - 44, { align: 'center' });
    } else if (map.id === 'brace') {
      // Brace Map: Whole -> Major Parts -> Subparts
      const startX = margin + 8;
      doc.setFillColor(224, 242, 254);
      doc.roundedRect(startX, canvasCenterY - 18, 42, 36, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(3, 105, 161);
      doc.text(isBm ? 'Objek Fizikal\n(Keseluruhan)' : 'Whole Object\n(Physical)', startX + 21, canvasCenterY - 3, { align: 'center' });

      // Big Brace
      const braceX = startX + 46;
      doc.setLineWidth(1);
      doc.line(braceX, canvasCenterY - 45, braceX + 6, canvasCenterY - 45);
      doc.line(braceX, canvasCenterY - 45, braceX, canvasCenterY + 45);
      doc.line(braceX, canvasCenterY + 45, braceX + 6, canvasCenterY + 45);
      doc.line(braceX, canvasCenterY, braceX - 4, canvasCenterY);

      // 3 Major Component Boxes
      [-34, 0, 34].forEach((offsetY) => {
        const y = canvasCenterY + offsetY - 11;
        doc.setLineWidth(0.5);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(braceX + 10, y, 46, 22, 1.5, 1.5, 'FD');

        // Smaller brace to subparts
        const subBraceX = braceX + 59;
        doc.line(subBraceX, y, subBraceX + 3, y);
        doc.line(subBraceX, y, subBraceX, y + 22);
        doc.line(subBraceX, y + 22, subBraceX + 3, y + 22);

        // Subpart write box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(subBraceX + 6, y - 2, 52, 26, 1, 1, 'FD');
      });
    } else if (map.id === 'bridge') {
      // Bridge Map: Bridge line with relating factors
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(3, 105, 161);
      doc.text(
        `${isBm ? 'Faktor Perkaitan (Relating Factor):' : 'Relating Factor:'} _____________________________________________`,
        margin + 8,
        canvasCenterY - 40
      );

      // Draw 3 Bridges
      const bridgeW = 52;
      const startBX = margin + (contentWidth - bridgeW * 3) / 2;
      for (let i = 0; i < 3; i++) {
        const curBX = startBX + i * bridgeW;
        const bY = canvasCenterY + 10;

        doc.setLineWidth(0.8);
        doc.line(curBX, bY, curBX + 18, bY);
        doc.line(curBX + 18, bY, curBX + 26, bY - 14);
        doc.line(curBX + 26, bY - 14, curBX + 34, bY);
        doc.line(curBX + 34, bY, curBX + bridgeW, bY);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(isBm ? 'sama seperti' : 'as', curBX + 26, bY - 16, { align: 'center' });

        // Pair input boxes
        doc.setLineWidth(0.4);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(curBX + 2, bY - 32, 22, 18, 1, 1, 'FD');
        doc.roundedRect(curBX + 2, bY + 8, 22, 18, 1, 1, 'FD');
      }
    }

    // Page footer branding
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `BaMuDi · ${isBm ? 'Pek Peta Pemikiran i-Think' : 'i-Think Visual Thinking Maps Pack'} · Halaman ${idx + 1} / 8`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  });

  return doc.output('blob');
}

// ============================================================================
// 4. RESOURCE 4: Templat Slaid Pengajaran Minimalis & Kontras Tinggi (PPTX)
// ============================================================================

/**
 * Generate native editable 16:9 PowerPoint Presentation (.pptx)
 */
export async function generateTeachingSlidesPptx(language: Language): Promise<Blob> {
  const isBm = language === 'bm';
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9'; // 10" x 5.625" (16:9 Widescreen)

  // Color Palette
  const C_NAVY = '0F172A';
  const C_SKY = '0099FF';
  const C_DARKBLUE = '0066CC';
  const C_SLATE = '475569';
  const C_LIGHTBG = 'F8FAFC';
  const C_CARD = 'FFFFFF';

  // SLIDE 1: Title Hook & Topic
  const slide1 = pptx.addSlide();
  slide1.background = { color: 'F0F7FF' };

  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.25,
    h: '100%',
    fill: { color: C_SKY },
  });

  slide1.addText(isBm ? 'BAHAN PENGAJARAN & PEMBELAJARAN (PdP)' : 'CLASSROOM TEACHING & LEARNING SLIDE', {
    x: 0.8,
    y: 0.8,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    fontFace: 'Arial',
    color: C_DARKBLUE,
    bold: true,
  });

  slide1.addText(
    isBm
      ? '[ TAJUK PENGAJARAN KELAS ANDA DI SINI ]'
      : '[ INSERT YOUR LESSON TOPIC TITLE HERE ]',
    {
      x: 0.8,
      y: 1.4,
      w: 8.5,
      h: 1.6,
      fontSize: 28,
      fontFace: 'Arial',
      color: C_NAVY,
      bold: true,
      valign: 'top',
    }
  );

  slide1.addText(
    isBm
      ? 'Subtopik / Standard Pembelajaran: [Taip kod SP di sini]\nNama Guru: [Nama Anda]  |  Kelas: [Nama Kelas]  |  Tarikh: [Tarikh]'
      : 'Subtopic / Standard: [Enter Code Here]\nTeacher: [Your Name]  |  Class: [Class Name]  |  Date: [Date]',
    {
      x: 0.8,
      y: 3.3,
      w: 8.5,
      h: 1.0,
      fontSize: 14,
      fontFace: 'Calibri',
      color: C_SLATE,
    }
  );

  slide1.addText('BaMuDi Educational Companion · Format Minimalis 16:9 Kontras Tinggi', {
    x: 0.8,
    y: 5.0,
    w: 8.5,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Calibri',
    color: '94A3B8',
  });

  // SLIDE 2: Learning Intentions & Success Criteria (OP & KK)
  const slide2 = pptx.addSlide();
  slide2.background = { color: C_LIGHTBG };

  slide2.addText(isBm ? 'OBJEKTIF PEMBELAJARAN & KRITERIA KEJAYAAN' : 'LEARNING INTENTIONS & SUCCESS CRITERIA', {
    x: 0.8,
    y: 0.5,
    w: 8.5,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    color: C_NAVY,
    bold: true,
  });

  // OP Card
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.3,
    w: 4.0,
    h: 3.6,
    fill: { color: C_CARD },
    line: { color: 'BAE6FD', width: 1.5 },
  });
  slide2.addText(isBm ? 'Objektif Pembelajaran (OP)' : 'Learning Objectives (LO)', {
    x: 1.0,
    y: 1.5,
    w: 3.6,
    h: 0.4,
    fontSize: 15,
    fontFace: 'Arial',
    color: C_DARKBLUE,
    bold: true,
  });
  slide2.addText(
    isBm
      ? 'Pada akhir pengajaran dan pembelajaran, murid dapat:\n\n1. [Objektif 1 - e.g. Menerangkan konsep...]\n\n2. [Objektif 2 - e.g. Mengaplikasikan formula...]\n\n3. [Objektif 3 - e.g. Menganalisis kesan...]'
      : 'By the end of this lesson, students will be able to:\n\n1. [Objective 1 - e.g. Explain the core concept...]\n\n2. [Objective 2 - e.g. Apply the framework...]\n\n3. [Objective 3 - e.g. Compare differences...]',
    {
      x: 1.0,
      y: 2.0,
      w: 3.6,
      h: 2.7,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C_NAVY,
      valign: 'top',
    }
  );

  // KK Card
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 5.2,
    y: 1.3,
    w: 4.0,
    h: 3.6,
    fill: { color: C_CARD },
    line: { color: 'BBF7D0', width: 1.5 },
  });
  slide2.addText(isBm ? 'Kriteria Kejayaan (KK)' : 'Success Criteria (SC)', {
    x: 5.4,
    y: 1.5,
    w: 3.6,
    h: 0.4,
    fontSize: 15,
    fontFace: 'Arial',
    color: '15803D',
    bold: true,
  });
  slide2.addText(
    isBm
      ? 'Saya berjaya sekiranya saya dapat:\n\n[  ] Menyatakan sekurang-kurangnya 3 ciri utama dengan tepat.\n\n[  ] Menjawab 4 daripada 5 soalan latihan lisan dengan betul.\n\n[  ] Bekerjasama dalam kumpulan menyiapkan tugasan ringkas.'
      : 'I achieve success when I can:\n\n[  ] State at least 3 key characteristics accurately.\n\n[  ] Answer 4 out of 5 formative quiz items correctly.\n\n[  ] Actively contribute in small-group investigation.',
    {
      x: 5.4,
      y: 2.0,
      w: 3.6,
      h: 2.7,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C_NAVY,
      valign: 'top',
    }
  );

  // SLIDE 3: Core Concept Visual Breakdown
  const slide3 = pptx.addSlide();
  slide3.background = { color: C_LIGHTBG };

  slide3.addText(isBm ? 'Penerokaan Konsep Utama' : 'Core Concept Exploration', {
    x: 0.8,
    y: 0.5,
    w: 8.5,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    color: C_NAVY,
    bold: true,
  });

  const cards = [
    { title: isBm ? '1. Fakta / Asas' : '1. Foundation', desc: isBm ? 'Penerangan ringkas konsep asas berfokus (maksimum 20 perkataan).' : 'Concise definition of the foundational concept (max 20 words).' },
    { title: isBm ? '2. Contoh Situasi' : '2. Real Context', desc: isBm ? 'Aplikasi harian atau fenomena dunia sebenar yang relevan dengan murid.' : 'Real-world application or classroom scenario connected to students.' },
    { title: isBm ? '3. Analisis Kritis' : '3. Key Takeaway', desc: isBm ? 'Soalan pendorong KBAT untuk mencabar minda murid menghubung kait idea.' : 'Higher-order thinking prompt pushing students to evaluate implications.' },
  ];

  cards.forEach((card, idx) => {
    const xPos = 0.8 + idx * 2.85;
    slide3.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.4,
      w: 2.65,
      h: 3.4,
      fill: { color: C_CARD },
      line: { color: 'E2E8F0', width: 1 },
    });
    slide3.addText(card.title, {
      x: xPos + 0.2,
      y: 1.7,
      w: 2.25,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      color: C_DARKBLUE,
      bold: true,
    });
    slide3.addText(card.desc, {
      x: xPos + 0.2,
      y: 2.3,
      w: 2.25,
      h: 2.2,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C_SLATE,
      valign: 'top',
    });
  });

  // SLIDE 4: Collaborative Student Activity (PAK-21)
  const slide4 = pptx.addSlide();
  slide4.background = { color: 'EFF6FF' };

  slide4.addText(isBm ? 'AKTIVITI KOLABORATIF: FIKIR-PASANG-KONGSI' : 'COLLABORATIVE ACTIVITY: THINK-PAIR-SHARE', {
    x: 0.8,
    y: 0.6,
    w: 8.5,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    color: C_DARKBLUE,
    bold: true,
  });

  const acts = [
    { step: isBm ? 'Langkah 1: FIKIR (2 Minit)' : 'Step 1: THINK (2 Mins)', detail: isBm ? 'Secara individu, catatkan jawapan anda pada kertas nota.' : 'Individually write your thoughts on sticky notes.' },
    { step: isBm ? 'Langkah 2: PASANG (3 Minit)' : 'Step 2: PAIR (3 Mins)', detail: isBm ? 'Bandingkan jawapan dengan rakan sebelah. Cari persamaan & perbezaan.' : 'Discuss with shoulder partner. Compare similarities & contrasts.' },
    { step: isBm ? 'Langkah 3: KONGSI (5 Minit)' : 'Step 3: SHARE (5 Mins)', detail: isBm ? 'Wakil pasangan kongsikan intipati jawapan kepada seluruh kelas.' : 'Share paired consensus highlights with the whole classroom.' },
  ];

  acts.forEach((a, idx) => {
    const yPos = 1.4 + idx * 1.15;
    slide4.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 8.4,
      h: 0.95,
      fill: { color: C_CARD },
      line: { color: 'BFDBFE', width: 1 },
    });
    slide4.addText(a.step, {
      x: 1.1,
      y: yPos + 0.15,
      w: 3.0,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Arial',
      color: C_DARKBLUE,
      bold: true,
    });
    slide4.addText(a.detail, {
      x: 4.2,
      y: yPos + 0.15,
      w: 4.8,
      h: 0.6,
      fontSize: 12,
      fontFace: 'Calibri',
      color: C_NAVY,
      valign: 'middle',
    });
  });

  // SLIDE 5: Exit Ticket / Formative Check
  const slide5 = pptx.addSlide();
  slide5.background = { color: C_LIGHTBG };

  slide5.addText(isBm ? 'TIKET KELUAR / REFLEKSI BILIK DARJAH' : 'EXIT TICKET / FORMATIVE CHECK-IN', {
    x: 0.8,
    y: 0.6,
    w: 8.5,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Arial',
    color: C_NAVY,
    bold: true,
  });

  const exitPrompts = [
    { num: '1', prompt: isBm ? 'Satu perkara baharu yang paling menarik saya pelajari hari ini:' : 'One fascinating new insight I gained today:' },
    { num: '2', prompt: isBm ? 'Satu perkara yang saya masih perlukan bantuan atau penerangan lanjut:' : 'One concept I still need clarification or support with:' },
  ];

  exitPrompts.forEach((p, idx) => {
    const yPos = 1.4 + idx * 1.7;
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 8.4,
      h: 1.4,
      fill: { color: C_CARD },
      line: { color: 'E2E8F0', width: 1 },
    });
    slide5.addText(`${p.num}. ${p.prompt}`, {
      x: 1.1,
      y: yPos + 0.2,
      w: 7.8,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Arial',
      color: C_DARKBLUE,
      bold: true,
    });
    slide5.addText('____________________________________________________________________________________', {
      x: 1.1,
      y: yPos + 0.8,
      w: 7.8,
      h: 0.3,
      fontSize: 11,
      fontFace: 'Calibri',
      color: 'CBD5E1',
    });
  });

  // SLIDE 6: Summary & Closing
  const slide6 = pptx.addSlide();
  slide6.background = { color: '0F172A' }; // Dark sleek theme for closing

  slide6.addText(isBm ? 'TERIMA KASIH! SELESAI PEMBELAJARAN HARI INI.' : 'THANK YOU! LESSON CONCLUDED.', {
    x: 0.8,
    y: 1.8,
    w: 8.5,
    h: 0.8,
    fontSize: 26,
    fontFace: 'Arial',
    color: 'FFFFFF',
    bold: true,
    align: 'center',
  });

  slide6.addText(
    isBm
      ? 'Teruskan mengulang kaji dan bawa semangat inkuiri ke kelas seterusnya!\n\nBaMuDi · Learn · Create · Teach'
      : 'Keep exploring and bring inquiry curiosity into our next session!\n\nBaMuDi · Learn · Create · Teach',
    {
      x: 0.8,
      y: 2.8,
      w: 8.5,
      h: 1.2,
      fontSize: 14,
      fontFace: 'Calibri',
      color: '94A3B8',
      align: 'center',
    }
  );

  const buffer = (await pptx.write({ outputType: 'arraybuffer' })) as ArrayBuffer;
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
}

/**
 * Generate 16:9 Landscape PDF Handout for Teaching Slides
 */
export function generateTeachingSlidesPdf(language: Language): Blob {
  const isBm = language === 'bm';
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 265mm

  const slides = [
    {
      title: isBm ? 'Slaid 1: Tajuk Pembelajaran & Pengenalan' : 'Slide 1: Lesson Topic & Hook',
      desc: isBm ? 'Tajuk fokus pengajaran berserta maklumat guru, kelas dan tarikh.' : 'Topic title hook with teacher, grade and date metadata.',
    },
    {
      title: isBm ? 'Slaid 2: Objektif Pembelajaran & Kriteria Kejayaan (OP & KK)' : 'Slide 2: Learning Intentions & Success Criteria',
      desc: isBm ? 'Paparan dwi-kad jelas untuk memandu murid memahami sasaran PdP hari ini.' : 'Dual-card layout detailing learning intentions and measurable student success benchmarks.',
    },
    {
      title: isBm ? 'Slaid 3: Pembangunan Konsep Utama (Maksimum 25 Perkataan)' : 'Slide 3: Concept Progression Breakdown',
      desc: isBm ? 'Tiga kad modular: Fakta Asas, Contoh Kontekstual, dan Analisis Kritis KBAT.' : 'Three modular cards: Core Foundation, Real-world Context, and Higher-Order Critical Analysis.',
    },
    {
      title: isBm ? 'Slaid 4: Aktiviti Kolaboratif Murid (Think-Pair-Share)' : 'Slide 4: Collaborative Student Activity',
      desc: isBm ? 'Tiga fasa berstruktur: Fikir Individu (2 min), Pasang (3 min), Kongsi Bersama (5 min).' : 'Three structured phases: Think Individually (2 min), Pair Up (3 min), Share to Classroom (5 min).',
    },
    {
      title: isBm ? 'Slaid 5: Tiket Keluar / Semakan Pentaksiran Bilik Darjah' : 'Slide 5: Formative Exit Ticket & Reflection',
      desc: isBm ? 'Semakan kefahaman formatif dan refleksi segera sebelum kelas tamat.' : 'Formative knowledge check and instant pupil self-reflection before lesson dismissal.',
    },
    {
      title: isBm ? 'Slaid 6: Penutup & Pesanan Ulang Kaji' : 'Slide 6: Conclusion & Encouragement',
      desc: isBm ? 'Slaid penutup bertenaga dengan dorongan pembelajaran sepanjang hayat.' : 'High-impact closing slide reinforcing ongoing inquiry and lifelong learning motivation.',
    },
  ];

  slides.forEach((s, idx) => {
    if (idx > 0) doc.addPage();

    // Slide Outline Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 3, 3, 'FD');

    // Header bar
    doc.setFillColor(0, 102, 204);
    doc.roundedRect(margin, margin, contentWidth, 20, 3, 3, 'F');
    doc.rect(margin, margin + 10, contentWidth, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(s.title, margin + 8, margin + 13);

    // Slide Body Content Handout Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(
      isBm ? 'Panduan Penggunaan Slaid & Pengisian Bahan:' : 'Slide Blueprint & Pedagogical Notes:',
      margin + 10,
      margin + 36
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(51, 65, 85);
    doc.text(s.desc, margin + 10, margin + 46, { maxWidth: contentWidth - 20 });

    // Classroom space for teacher notes
    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(255, 255, 255);
    doc.setLineDashPattern([2, 2], 0);
    doc.roundedRect(margin + 10, margin + 60, contentWidth - 20, pageHeight - margin * 2 - 76, 2, 2, 'FD');
    doc.setLineDashPattern([], 0);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(
      isBm
        ? '[ Ruangan Catatan Tambahan Guru / Soalan Interaktif Semasa Mengajar ]'
        : '[ Teacher Lesson Notes & Interactive Discussion Prompts ]',
      pageWidth / 2,
      margin + 100,
      { align: 'center' }
    );

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `BaMuDi · Slaid Pengajaran 16:9 · Halaman ${idx + 1} / ${slides.length}`,
      pageWidth / 2,
      pageHeight - margin + 6,
      { align: 'center' }
    );
  });

  return doc.output('blob');
}

// ============================================================================
// 5. RESOURCE 5: Rubrik Penilaian Pembelajaran Berasaskan Projek (PBL / STEM)
// ============================================================================

export interface StemPblPhase {
  phase: string;
  weight: string;
  name: { bm: string; en: string };
  criteria: {
    name: { bm: string; en: string };
    tpLevel: string;
    descriptors: {
      cemerlang: { bm: string; en: string }; // 4
      baik: { bm: string; en: string }; // 3
      memuaskan: { bm: string; en: string }; // 2
      bimbingan: { bm: string; en: string }; // 1
    };
  }[];
}

export const STEM_PBL_DATA: {
  title: { bm: string; en: string };
  subtitle: { bm: string; en: string };
  instructions: { bm: string; en: string };
  phases: StemPblPhase[];
} = {
  title: {
    bm: 'RUBRIK PENILAIAN PEMBELAJARAN BERASASKAN PROJEK (PBL / STEM)',
    en: 'PROJECT-BASED LEARNING (PBL / STEM) COMPREHENSIVE ASSESSMENT RUBRIC',
  },
  subtitle: {
    bm: 'Penilaian Holistik 4 Fasa Projek: Inkuiri, Rekaan Prototaip, Pengujian & Pembentangan Impak',
    en: 'Holistic 4-Phase Project Assessment: Inquiry, Prototype Design, Testing & Impact Presentation',
  },
  instructions: {
    bm: 'Arahan: Pentaksir menilai pencapaian murid atau kumpulan berdasarkan 4 fasa kitaran reka bentuk STEM. Skor dinilai mengikut wajaran fasa.',
    en: 'Instructions: Assess student or team performance across the 4 STEM design phases. Compute weighted score for holistic reporting.',
  },
  phases: [
    {
      phase: 'Fasa 1',
      weight: '20%',
      name: { bm: 'Pengenalpastian Masalah & Pelan Projek', en: 'Problem Definition & Project Workplan' },
      criteria: [
        {
          name: { bm: 'Pernyataan Masalah & Analisis Keperluan', en: 'Problem Identification & Need Analysis' },
          tpLevel: 'TP1 - TP2',
          descriptors: {
            cemerlang: { bm: 'Masalah dunia sebenar dihuraikan secara sangat jelas disokong data & empati mendalam.', en: 'Real-world problem defined clearly with strong contextual evidence and deep empathy.' },
            baik: { bm: 'Masalah dikenal pasti dengan baik dan relevan dengan kehidupan harian murid.', en: 'Problem identified well and relevant to students daily real-world context.' },
            memuaskan: { bm: 'Masalah dinyatakan secara umum tanpa penerangan bukti yang kukuh.', en: 'Problem stated generically with limited supporting evidence.' },
            bimbingan: { bm: 'Masalah kabur atau tidak berkaitan dengan tema projek STEM.', en: 'Problem unclear or disconnected from the STEM project scope.' },
          },
        },
      ],
    },
    {
      phase: 'Fasa 2',
      weight: '30%',
      name: { bm: 'Prototaip, Kreativiti & Integrasi STEM', en: 'Prototyping, Ingenuity & STEM Integration' },
      criteria: [
        {
          name: { bm: 'Inovasi Rekaan & Integrasi Disiplin STEM', en: 'Design Innovation & STEM Discipline Synergy' },
          tpLevel: 'TP3 - TP4',
          descriptors: {
            cemerlang: { bm: 'Rekaan sangat inovatif, mengintegrasikan sekurang-kurangnya 3 elemen STEM secara lancar.', en: 'Highly innovative design seamlessly fusing at least 3 distinct STEM disciplines.' },
            baik: { bm: 'Rekaan kemas, berfungsi baik dengan gabungan 2 elemen STEM yang jelas.', en: 'Neat functional design with clear integration of 2 STEM disciplines.' },
            memuaskan: { bm: 'Rekaan meniru model sedia ada dengan modifikasi yang minima.', en: 'Design replicates existing models with minimal novel modifications.' },
            bimbingan: { bm: 'Rekaan tidak siap atau tiada integrasi disiplin STEM yang dapat diperhatikan.', en: 'Incomplete design lacking observable STEM subject integration.' },
          },
        },
      ],
    },
    {
      phase: 'Fasa 3',
      weight: '25%',
      name: { bm: 'Ujian Keberkesanan & Penambahbaikan Data', en: 'Testing Verification & Iterative Data' },
      criteria: [
        {
          name: { bm: 'Kaedah Pengujian & Perekodan Data Eksperimen', en: 'Scientific Testing & Iterative Data Logging' },
          tpLevel: 'TP4 - TP5',
          descriptors: {
            cemerlang: { bm: 'Ujian dilakukan berulang kali dengan perekodan data terperinci berserta modifikasi lelaran.', en: 'Repeated testing with detailed data logging and evidence-based design iterations.' },
            baik: { bm: 'Ujian dijalankan secara bersistem dan data direkodkan dengan kemas.', en: 'Systematic testing conducted with well-organized data records.' },
            memuaskan: { bm: 'Ujian hanya dibuat sekali tanpa pengulangan untuk mengesahkan kestabilan.', en: 'Single trial testing conducted with no repeatability verification.' },
            bimbingan: { bm: 'Tiada bukti pengujian atau data ujian tidak dapat disahkan.', en: 'No empirical testing evidence or unverified observations.' },
          },
        },
      ],
    },
    {
      phase: 'Fasa 4',
      weight: '25%',
      name: { bm: 'Pembentangan Impak, Nilai & Refleksi', en: 'Pitching, Impact & Metacognitive Reflection' },
      criteria: [
        {
          name: { bm: 'Penyampaian Hujah, Kebolehlaksanaan & Etika', en: 'Pitch Delivery, Feasibility & Sustainability' },
          tpLevel: 'TP5 - TP6',
          descriptors: {
            cemerlang: { bm: 'Pembentangan sangat meyakinkan; impak sosial/alam sekitar dihuraikan dengan matang.', en: 'Compelling pitch; social/environmental sustainability articulated with maturity.' },
            baik: { bm: 'Penyampaian jelas dan hujah disokong bukti produk prototaip sebenar.', en: 'Clear delivery and sound arguments supported by physical prototype evidence.' },
            memuaskan: { bm: 'Penerangan ringkas dan kurang keyakinan semasa menjawab soalan penilaian.', en: 'Basic explanation with noticeable hesitation during assessor Q&A.' },
            bimbingan: { bm: 'Tidak bersedia membentang atau gagal menjelaskan fungsi produk.', en: 'Unprepared to pitch or unable to demonstrate product functionality.' },
          },
        },
      ],
    },
  ],
};

/**
 * Generate native OpenXML .docx for STEM/PBL Rubric
 */
export async function generateStemPblDocx(language: Language): Promise<Blob> {
  const isBm = language === 'bm';
  const data = STEM_PBL_DATA;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.title[language],
                bold: true,
                size: 26,
                color: '047857', // Emerald green
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: data.subtitle[language],
                bold: true,
                size: 18,
                color: '334155',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `BaMuDi · ${isBm ? 'Bahan Pentaksiran Bilik Darjah KSSR & KSSM' : 'Classroom Project Assessment Framework'}`,
                italics: true,
                size: 16,
                color: '64748B',
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tajuk Projek STEM: ' : 'STEM Project Title: ', bold: true }), new TextRun({ text: '________________________________' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Kelas: ' : 'Class: ', bold: true }), new TextRun({ text: '____________' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Nama Kumpulan: ' : 'Team Name: ', bold: true }), new TextRun({ text: '________________________________' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Tarikh: ' : 'Date: ', bold: true }), new TextRun({ text: '____________' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ columnSpan: 2, shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Ahli Pasukan: ' : 'Team Members: ', bold: true }), new TextRun({ text: '1. ______________  2. ______________  3. ______________  4. ______________' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // Rubric Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: '059669' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Fasa & Kriteria Projek' : 'Phase & Project Criteria', bold: true, color: 'FFFFFF' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: '059669' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Cemerlang (4)' : 'Excellent (4)', bold: true, color: 'FFFFFF' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: '059669' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Baik (3)' : 'Good (3)', bold: true, color: 'FFFFFF' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: '059669' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Memuaskan (2)' : 'Fair (2)', bold: true, color: 'FFFFFF' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: '059669' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Bimbingan (1)' : 'Needs Support (1)', bold: true, color: 'FFFFFF' })] })] }),
                  new TableCell({ shading: { type: ShadingType.CLEAR, fill: '059669' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Skor' : 'Score', bold: true, color: 'FFFFFF' })] })] }),
                ],
              }),
              ...data.phases.flatMap((phase) =>
                phase.criteria.map(
                  (crit) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          shading: { type: ShadingType.CLEAR, fill: 'F0FDF4' },
                          children: [
                            new Paragraph({ children: [new TextRun({ text: `${phase.phase}: ${phase.name[language]}`, bold: true, color: '047857' })] }),
                            new Paragraph({ children: [new TextRun({ text: crit.name[language], size: 17 })] }),
                            new Paragraph({ children: [new TextRun({ text: `[${isBm ? 'Wajaran' : 'Weight'}: ${phase.weight} · ${crit.tpLevel}]`, size: 15, color: '0284C7' })] }),
                          ],
                        }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: crit.descriptors.cemerlang[language], size: 16 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: crit.descriptors.baik[language], size: 16 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: crit.descriptors.memuaskan[language], size: 16 })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: crit.descriptors.bimbingan[language], size: 16 })] })] }),
                        new TableCell({
                          shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '___ / 4', bold: true })] })],
                        }),
                      ],
                    })
                )
              ),
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 5,
                    shading: { type: ShadingType.CLEAR, fill: 'ECFDF5' },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: isBm ? 'JUMLAH SKOR WAJARAN PROJEK (%):' : 'TOTAL WEIGHTED PROJECT SCORE (%):', bold: true })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'ECFDF5' },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '___ %', bold: true, color: '059669', size: 22 })] })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 240 } }),

          // Feedback table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' }, children: [new Paragraph({ children: [new TextRun({ text: isBm ? 'Ulasan Pentaksir (Maklum Balas Deskriptif):' : 'Assessor Feedback & Growth Notes:', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '\n\n' })] })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 360 } }),

          // Signatures
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: '________________________________________' })] }),
                      new Paragraph({ children: [new TextRun({ text: isBm ? 'Tandatangan Guru Penilai STEM' : 'STEM Teacher Assessor Signature', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: `${isBm ? 'Nama:' : 'Name:'} __________________________` })] }),
                    ],
                  }),
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '________________________________________' })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: isBm ? 'Tandatangan Ketua Murid' : 'Student Lead Signature', bold: true })] }),
                      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${isBm ? 'Nama:' : 'Name:'} __________________________` })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240 },
            children: [
              new TextRun({
                text: 'BaMuDi · Bahan Murid Digital · Rubrik Projek STEM Sedia Digunakan',
                size: 15,
                color: '94A3B8',
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Generate PDF for STEM/PBL Rubric
 */
export function generateStemPblPdf(language: Language): Blob {
  const isBm = language === 'bm';
  const data = STEM_PBL_DATA;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 12;

  // Header Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(4, 120, 87); // Emerald green
  doc.text(data.title[language], pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(data.subtitle[language], pageWidth / 2, currentY, { align: 'center' });

  currentY += 3;
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.7);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 3.5;

  // Meta Table
  const metaBody = [
    [
      { content: isBm ? 'TAJUK PROJEK STEM:' : 'STEM PROJECT TITLE:', styles: { fontStyle: 'bold' } },
      { content: '____________________________' },
      { content: isBm ? 'KELAS:' : 'CLASS:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
    [
      { content: isBm ? 'NAMA KUMPULAN:' : 'TEAM NAME:', styles: { fontStyle: 'bold' } },
      { content: '____________________________' },
      { content: isBm ? 'TARIKH:' : 'DATE:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
    [
      { content: isBm ? 'AHLI PASUKAN:' : 'TEAM MEMBERS:', styles: { fontStyle: 'bold' } },
      { content: '1. ____________  2. ____________  3. ____________  4. ____________' },
      { content: isBm ? 'GURU:' : 'TEACHER:', styles: { fontStyle: 'bold' } },
      { content: '____________' },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    body: metaBody as any,
    theme: 'grid',
    styles: { fontSize: 7.2, cellPadding: 1.4, lineColor: [203, 213, 225], lineWidth: 0.2 },
    columnStyles: {
      0: { cellWidth: 34, fillColor: [248, 250, 252] },
      1: { cellWidth: 76 },
      2: { cellWidth: 22, fillColor: [248, 250, 252] },
      3: { cellWidth: 54 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 3.5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text(data.instructions[language], margin, currentY, { maxWidth: contentWidth });

  currentY += 4.5;

  // Rubric Rows
  const rubricHead = [
    [
      isBm ? 'Fasa & Kriteria' : 'Phase & Criteria',
      isBm ? 'Cemerlang (4)' : 'Excellent (4)',
      isBm ? 'Baik (3)' : 'Good (3)',
      isBm ? 'Memuaskan (2)' : 'Fair (2)',
      isBm ? 'Bimbingan (1)' : 'Needs Support (1)',
      isBm ? 'Skor' : 'Score',
    ],
  ];

  const rubricRows: any[] = [];
  data.phases.forEach((p) => {
    p.criteria.forEach((c) => {
      rubricRows.push([
        `${p.phase}: ${p.name[language]}\n[${isBm ? 'Wajaran' : 'Weight'}: ${p.weight} · ${c.tpLevel}]`,
        c.descriptors.cemerlang[language],
        c.descriptors.baik[language],
        c.descriptors.memuaskan[language],
        c.descriptors.bimbingan[language],
        '__ / 4',
      ]);
    });
  });

  rubricRows.push([
    isBm ? 'JUMLAH SKOR KESELURUHAN (100%):' : 'TOTAL WEIGHTED SCORE (100%):',
    '',
    '',
    '',
    '',
    '__ %',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: rubricHead,
    body: rubricRows,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.2,
      halign: 'center',
      cellPadding: 1.6,
    },
    styles: {
      fontSize: 6.8,
      cellPadding: 1.6,
      textColor: [15, 23, 42],
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      valign: 'top',
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold', fillColor: [240, 253, 244] },
      1: { cellWidth: 34 },
      2: { cellWidth: 34 },
      3: { cellWidth: 34 },
      4: { cellWidth: 30 },
      5: { cellWidth: 14, halign: 'center', fontStyle: 'bold', valign: 'middle' },
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.row.index === rubricRows.length - 1) {
        hookData.cell.styles.fillColor = [236, 253, 245];
        hookData.cell.styles.fontStyle = 'bold';
        if (hookData.column.index === 0) {
          hookData.cell.styles.halign = 'right';
          (hookData.cell as any).colSpan = 5;
        }
      }
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // Feedback Table
  const feedbackHead = [[isBm ? 'MAKLUM BALAS PENTAKSIR & REFLEKSI' : 'ASSESSOR FEEDBACK & REFLECTION']];
  const feedbackBody = [
    [`${isBm ? 'Aspek Cemerlang / Inovasi Produk:' : 'Product Innovation Highlights:'}\n\n`],
    [`${isBm ? 'Cadangan Penambahbaikan Prototaip:' : 'Recommendations for Prototype Refinement:'}\n\n`],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: feedbackHead,
    body: feedbackBody,
    theme: 'grid',
    headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold', fontSize: 7 },
    styles: { fontSize: 6.8, cellPadding: 2, lineColor: [203, 213, 225], lineWidth: 0.2 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  doc.text('________________________________________', margin, currentY);
  doc.text('________________________________________', margin + contentWidth, currentY, { align: 'right' });

  currentY += 3.5;
  doc.setFont('helvetica', 'bold');
  doc.text(isBm ? 'Tandatangan Guru Penilai STEM' : 'STEM Teacher Signature', margin, currentY);
  doc.text(isBm ? 'Tandatangan Ketua Murid' : 'Student Lead Signature', margin + contentWidth, currentY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `BaMuDi · ${isBm ? 'Rubrik Penilaian Pembelajaran Berasaskan Projek STEM' : 'STEM Project-Based Learning Rubric'} · Cetak A4`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  return doc.output('blob');
}

// ============================================================================
// MAIN DISPATCHER FUNCTION (ALL 5 RESOURCES SUPPORTED)
// ============================================================================

export interface ExportResult {
  blob: Blob;
  filename: string;
  format: 'docx' | 'pdf' | 'pptx';
}

/**
 * Generates the requested file format for any of the 5 teaching resources.
 */
export async function exportTeachingResource(
  resourceId: string,
  language: Language,
  requestedFormat?: 'docx' | 'pdf' | 'pptx' | 'doc' | 'primary'
): Promise<ExportResult> {
  const isBm = language === 'bm';
  const langSuffix = isBm ? 'BM' : 'EN';

  // Add small artificial delay so user sees smooth progress feedback
  await new Promise((resolve) => setTimeout(resolve, 350));

  // 1. Student Group Presentation Rubric
  if (resourceId === 'rubrik-pembentangan-murid') {
    if (requestedFormat === 'pdf') {
      const blob = generatePresentationRubricPdf(language);
      const filename = `BaMuDi_Rubrik_Pembentangan_PAK21_${langSuffix}.pdf`;
      return { blob, filename, format: 'pdf' };
    } else {
      const blob = await generatePresentationRubricDocx(language);
      const filename = `BaMuDi_Rubrik_Pembentangan_PAK21_${langSuffix}.docx`;
      return { blob, filename, format: 'docx' };
    }
  }

  // 2. Science Inquiry Worksheet
  if (resourceId === 'worksheet-science-inquiry') {
    if (requestedFormat === 'docx' || requestedFormat === 'doc') {
      const blob = await generateScienceInquiryDocx(language);
      const filename = `BaMuDi_Lembaran_Inkuiri_Sains_${langSuffix}.docx`;
      return { blob, filename, format: 'docx' };
    } else {
      const blob = generateScienceInquiryPdf(language);
      const filename = `BaMuDi_Lembaran_Inkuiri_Sains_${langSuffix}.pdf`;
      return { blob, filename, format: 'pdf' };
    }
  }

  // 3. i-Think Templates Pack
  if (resourceId === 'worksheet-ithink-organizer') {
    const blob = generateIThinkPdf(language);
    const filename = `BaMuDi_Pek_Peta_Pemikiran_iThink_${langSuffix}.pdf`;
    return { blob, filename, format: 'pdf' };
  }

  // 4. Teaching Slides
  if (resourceId === 'presentation-minimal-deck') {
    if (requestedFormat === 'pdf') {
      const blob = generateTeachingSlidesPdf(language);
      const filename = `BaMuDi_Templat_Slaid_Pengajaran_16x9_${langSuffix}.pdf`;
      return { blob, filename, format: 'pdf' };
    } else {
      const blob = await generateTeachingSlidesPptx(language);
      const filename = `BaMuDi_Templat_Slaid_Pengajaran_16x9_${langSuffix}.pptx`;
      return { blob, filename, format: 'pptx' };
    }
  }

  // 5. PBL / STEM Rubric
  if (resourceId === 'rubrik-projek-kumpulan-stem') {
    if (requestedFormat === 'pdf') {
      const blob = generateStemPblPdf(language);
      const filename = `BaMuDi_Rubrik_Projek_PBL_STEM_${langSuffix}.pdf`;
      return { blob, filename, format: 'pdf' };
    } else {
      const blob = await generateStemPblDocx(language);
      const filename = `BaMuDi_Rubrik_Projek_PBL_STEM_${langSuffix}.docx`;
      return { blob, filename, format: 'docx' };
    }
  }

  throw new Error(`Unsupported resource ID: ${resourceId}`);
}
