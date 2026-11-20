import { PBDClassRecord, MasteryLevel, StudentEffort, AssessmentMethod, UasaGrade } from '../types';

export interface TPDescriptor {
  level: MasteryLevel;
  badge: string;
  name: { bm: string; en: string };
  descriptor: { bm: string; en: string };
  color: {
    bg: string;
    text: string;
    border: string;
    ring: string;
  };
}

export const TP_DESCRIPTORS: Record<MasteryLevel, TPDescriptor> = {
  TP1: {
    level: 'TP1',
    badge: 'TP 1',
    name: { bm: 'Tahu', en: 'Knows' },
    descriptor: {
      bm: 'Murid tahu perkara asas atau boleh melakukan kemahiran asas atau memberi respons terhadap perkara asas.',
      en: 'Student knows fundamental facts, can demonstrate basic skills, or respond to basic cues.',
    },
    color: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      ring: 'ring-rose-500',
    },
  },
  TP2: {
    level: 'TP2',
    badge: 'TP 2',
    name: { bm: 'Tahu & Faham', en: 'Understands' },
    descriptor: {
      bm: 'Murid menunjukkan kefahaman dengan menjelaskan perkara yang telah dipelajari dalam bentuk komunikasi lisan atau bertulis.',
      en: 'Student demonstrates understanding by explaining learned concepts through verbal or written expressions.',
    },
    color: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      ring: 'ring-orange-500',
    },
  },
  TP3: {
    level: 'TP3',
    badge: 'TP 3',
    name: { bm: 'Tahu, Faham & Boleh Buat', en: 'Applies' },
    descriptor: {
      bm: 'Murid menggunakan pengetahuan untuk melaksanakan sesuatu kemahiran pada sesuatu situasi.',
      en: 'Student applies conceptual knowledge to perform tasks and execute skills in familiar contexts.',
    },
    color: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      ring: 'ring-amber-500',
    },
  },
  TP4: {
    level: 'TP4',
    badge: 'TP 4',
    name: { bm: 'Beradab / Mahir', en: 'Analyses / Proficient' },
    descriptor: {
      bm: 'Murid melaksanakan sesuatu kemahiran dengan beradab iaitu mengikut prosedur atau secara analitikal dan sistematik.',
      en: 'Student executes skills with procedural compliance, systematic inquiry, and critical analysis.',
    },
    color: {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      ring: 'ring-sky-500',
    },
  },
  TP5: {
    level: 'TP5',
    badge: 'TP 5',
    name: { bm: 'Terpuji', en: 'Evaluates / Commendable' },
    descriptor: {
      bm: 'Murid melaksanakan sesuatu kemahiran pada situasi baharu dengan mengikut prosedur atau secara sistematik serta tekal dan bersikap positif.',
      en: 'Student applies skills to novel situations systematically, showing consistent positive work ethics.',
    },
    color: {
      bg: 'bg-sky-100',
      text: 'text-[#0066cc]',
      border: 'border-sky-300',
      ring: 'ring-[#0099ff]',
    },
  },
  TP6: {
    level: 'TP6',
    badge: 'TP 6',
    name: { bm: 'Cemerlang / Mithali', en: 'Exemplary / Creates' },
    descriptor: {
      bm: 'Murid berupaya menggunakan pengetahuan dan kemahiran sedia ada untuk digunakan pada situasi baharu secara kreatif, bersikap positif, dan menjadi teladan.',
      en: 'Student synthesizes knowledge creatively in novel contexts, produces original output, and serves as a peer model.',
    },
    color: {
      bg: 'bg-[#fdf2f0]',
      text: 'text-[#99240b]',
      border: 'border-[#cc310e]/40',
      ring: 'ring-[#cc310e]',
    },
  },
};

// Official KPM Student Effort Scales (Panduan PBS 2025 Edisi 1, Muka Surat 77-89)
export interface StudentEffortConfig {
  key: StudentEffort;
  label: { bm: string; en: string };
  descriptor: { bm: string; en: string };
  badgeClass: string;
}

export const STUDENT_EFFORT_CONFIG: Record<StudentEffort, StudentEffortConfig> = {
  'SANGAT TINGGI': {
    key: 'SANGAT TINGGI',
    label: { bm: 'Sangat Tinggi', en: 'Very High' },
    descriptor: {
      bm: 'Murid menunjukkan daya usaha yang tinggi dan mampu berdikari.',
      en: 'Student demonstrates high effort and is self-reliant.',
    },
    badgeClass: 'bg-[#fdf2f0] text-[#99240b] border-[#cc310e]/40',
  },
  'TINGGI': {
    key: 'TINGGI',
    label: { bm: 'Tinggi', en: 'High' },
    descriptor: {
      bm: 'Murid menunjukkan daya usaha yang tinggi dan memerlukan sokongan untuk terus maju.',
      en: 'Student demonstrates high effort and requires guidance to advance further.',
    },
    badgeClass: 'bg-sky-100 text-[#0066cc] border-sky-300',
  },
  'SEDERHANA': {
    key: 'SEDERHANA',
    label: { bm: 'Sederhana', en: 'Moderate' },
    descriptor: {
      bm: 'Murid menunjukkan daya usaha dan memerlukan dorongan / sokongan.',
      en: 'Student demonstrates moderate effort and needs encouragement and support.',
    },
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  'RENDAH': {
    key: 'RENDAH',
    label: { bm: 'Rendah', en: 'Low' },
    descriptor: {
      bm: 'Murid kurang daya usaha dan memerlukan lebih dorongan / bantuan.',
      en: 'Student lacks effort and requires sustained motivation and intervention.',
    },
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
};

// Official Assessment Methods (Panduan Pelaksanaan PBD Edisi 2 Bab 5 & 7, Panduan PBS 2025 Bab 3)
export interface AssessmentMethodConfig {
  key: AssessmentMethod;
  label: { bm: string; en: string };
  description: { bm: string; en: string };
}

export const ASSESSMENT_METHODS_CONFIG: Record<AssessmentMethod, AssessmentMethodConfig> = {
  pemerhatian: {
    key: 'pemerhatian',
    label: { bm: 'Pemerhatian', en: 'Observation' },
    description: {
      bm: 'Dinilai menerusi tingkah laku, amali, penglibatan aktif, dan senarai semak.',
      en: 'Assessed through behavioral observation, hands-on tasks, and checklist records.',
    },
  },
  lisan: {
    key: 'lisan',
    label: { bm: 'Lisan', en: 'Oral' },
    description: {
      bm: 'Dinilai menerusi sesi soal jawab, pembentangan, bercerita, dan temu bual.',
      en: 'Assessed through Q&A sessions, classroom presentations, and interviews.',
    },
  },
  bertulis: {
    key: 'bertulis',
    label: { bm: 'Bertulis', en: 'Written' },
    description: {
      bm: 'Dinilai menerusi lembaran kerja, kuiz, laporan projek, dan esei bertulis.',
      en: 'Assessed through worksheets, written quizzes, project reports, and essays.',
    },
  },
  gabungan: {
    key: 'gabungan',
    label: { bm: 'Gabungan Pelbagai', en: 'Combined' },
    description: {
      bm: 'Integrasi pemerhatian, lisan, dan hasil kerja bertulis secara holistik.',
      en: 'Holistic synthesis of observation, oral interaction, and written outputs.',
    },
  },
};

// Official KPM UASA Grade scale (Panduan PBS 2025 Edisi 1, Muka Surat 51)
export function calculateUasaGrade(score?: number): {
  grade: UasaGrade;
  description: { bm: string; en: string };
} {
  if (score === undefined || score === null || isNaN(score)) {
    return { grade: '-', description: { bm: 'Tiada Data', en: 'No Data' } };
  }
  const cleanScore = Math.max(0, Math.min(100, Math.round(score)));

  if (cleanScore >= 82) {
    return { grade: 'A', description: { bm: 'Cemerlang', en: 'Excellent' } };
  }
  if (cleanScore >= 66) {
    return { grade: 'B', description: { bm: 'Kepujian', en: 'Credit' } };
  }
  if (cleanScore >= 50) {
    return { grade: 'C', description: { bm: 'Baik', en: 'Good' } };
  }
  if (cleanScore >= 35) {
    return { grade: 'D', description: { bm: 'Memuaskan', en: 'Satisfactory' } };
  }
  if (cleanScore >= 20) {
    return { grade: 'E', description: { bm: 'Mencapai Tahap Minimum', en: 'Attained Minimum' } };
  }
  return { grade: 'F', description: { bm: 'Belum Mencapai Tahap Minimum', en: 'Below Minimum' } };
}

// DSKP Standard Statement generator helper for major subjects
export const DSKP_STANDARD_STATEMENTS: Record<
  string,
  Record<MasteryLevel, { bm: string; en: string }>
> = {
  'Bahasa Melayu': {
    TP1: {
      bm: 'Mendengar, mengecam sebutan, membaca perkataan mudah dan menulis ayat asas dengan bimbingan guru.',
      en: 'Listens, recognises sounds, reads simple words, and writes basic sentences with teacher guidance.',
    },
    TP2: {
      bm: 'Memahami maklumat tersurat, membaca dan memahami perenggan pendek serta membina ayat tunggal dengan betul.',
      en: 'Understands explicit details, reads short paragraphs, and constructs simple sentences correctly.',
    },
    TP3: {
      bm: 'Menyampaikan idea secara lisan, membaca teks secara mekanis dan membina pelbagai jenis ayat dengan lancar.',
      en: 'Expresses ideas verbally, reads aloud fluently, and constructs varied sentences in familiar contexts.',
    },
    TP4: {
      bm: 'Menjelaskan maklumat tersurat dan tersirat, membaca teks dengan intonasi sesuai serta menulis perenggan berformat.',
      en: 'Analyses explicit and implicit information, reads with appropriate inflection, and drafts formatted paragraphs.',
    },
    TP5: {
      bm: 'Menilai maklumat, membaca secara kritis dan menulis karangan yang gramatis serta berkesan pada situasi baharu.',
      en: 'Evaluates information critically, reads analytically, and writes grammatically coherent essays in novel situations.',
    },
    TP6: {
      bm: 'Berkomunikasi secara lisan dengan santun dan berwibawa, membaca secara analitikal, serta menghasilkan karya kreatif yang boleh diteladani.',
      en: 'Communicates articulately with exemplary etiquette, reads critically, and produces creative, inspiring literary work.',
    },
  },
  default: {
    TP1: {
      bm: 'Mengetahui perkara asas dan melaksanakan kemahiran paling asas dengan bimbingan berterusan guru.',
      en: 'Demonstrates awareness of basic concepts and performs rudimentary skills under direct supervision.',
    },
    TP2: {
      bm: 'Memahami konsep yang dipelajari dan mampu menjelaskan perkara asas secara lisan atau bertulis.',
      en: 'Demonstrates conceptual understanding and describes core ideas verbally or in writing.',
    },
    TP3: {
      bm: 'Mengaplikasikan pengetahuan dan kemahiran dalam melaksanakan tugasan pada situasi lazim.',
      en: 'Applies learned knowledge and core skills accurately to complete routine tasks.',
    },
    TP4: {
      bm: 'Menganalisis dan melaksanakan sesuatu kemahiran mengikut prosedur yang betul secara sistematik.',
      en: 'Analyses scenarios systematically and executes procedural skills with high consistency.',
    },
    TP5: {
      bm: 'Menilai dan mengaplikasikan pengetahuan pada situasi baharu secara tekal dan berhemah tinggi.',
      en: 'Evaluates options and applies mastery to novel contexts with sustained dedication.',
    },
    TP6: {
      bm: 'Mencipta penyelesaian kreatif, menunjukkan penguasaan cemerlang dan berupaya membimbing rakan sebaya.',
      en: 'Creates innovative solutions, models exemplary mastery, and guides fellow peers effectively.',
    },
  },
};

export function getDskpStatement(subject: string, level: MasteryLevel, language: 'bm' | 'en'): string {
  const subjectStatements = DSKP_STANDARD_STATEMENTS[subject] || DSKP_STANDARD_STATEMENTS.default;
  return subjectStatements[level]?.[language] || DSKP_STANDARD_STATEMENTS.default[level][language];
}

export const QUICK_TEACHER_REMARKS = [
  {
    bm: 'Menunjukkan daya usaha terpuji dan konsisten menyiapkan latihan berkualiti.',
    en: 'Demonstrates commendable effort and consistently completes quality assignments.',
  },
  {
    bm: 'Sangat aktif dalam perbincangan kelas dan mampu membimbing rakan sebaya.',
    en: 'Very active in classroom discourse and effectively supports peer learning.',
  },
  {
    bm: 'Mampu menyelesaikan tugasan secara berdikari dengan pemikiran kritis.',
    en: 'Demonstrates strong critical thinking and independent problem-solving skills.',
  },
  {
    bm: 'Mencapai tahap minimum yang memuaskan dan berpotensi untuk terus maju.',
    en: 'Attained a satisfactory minimum baseline with strong potential for further growth.',
  },
  {
    bm: 'Memerlukan latihan bertulis tambahan bagi memantapkan kefahaman konsep asas.',
    en: 'Requires additional written reinforcement to consolidate fundamental concepts.',
  },
  {
    bm: 'Menunjukkan peningkatan ketara dalam kemahiran lisan dan amali praktikal.',
    en: 'Showed substantial improvement in oral presentations and hands-on activities.',
  },
];

export const INITIAL_SAMPLE_PBD_CLASS: PBDClassRecord = {
  id: 'pbd-class-sample-01',
  className: '4 Cemerlang',
  subject: 'Bahasa Melayu',
  yearGrade: 'Tahun 4',
  teacherName: 'Cikgu Noraini binti Yusof',
  schoolName: 'SK Taman Bunga Raya',
  schoolCode: 'WBA0042',
  academicYear: '2025/2026',
  reportingPeriod: 'akhir',
  assessmentUnit: 'Tema 3: Gaya Hidup Sihat & Cergas (Standard 3.4)',
  includeUasa: true,
  classTeacherName: 'Pn. Siti Rahmah binti Osman',
  classTeacherRemarks: 'Murid menunjukkan sahsiah terpuji, berdisiplin tinggi dan sentiasa memberikan komitmen padu dalam semua aktiviti pembelajaran kelas.',
  lastUpdated: Date.now(),
  students: [
    {
      id: 'std-001',
      studentName: 'Ahmad Danial bin Rosli',
      studentId: '130415-10-1421',
      gender: 'L',
      masteryLevel: 'TP5',
      effort: 'TINGGI',
      assessmentMethod: 'gabungan',
      uasaScore: 84,
      uasaGrade: 'A',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Menilai maklumat, membaca secara kritis dan menulis karangan yang gramatis serta berkesan pada situasi baharu.',
      remarks: 'Menguasai kemahiran menulis dengan perenggan tersusun dan kosa kata luas.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-002',
      studentName: 'Nur Aina Safiyyah binti Kamarudin',
      studentId: '130822-10-1842',
      gender: 'P',
      masteryLevel: 'TP6',
      effort: 'SANGAT TINGGI',
      assessmentMethod: 'lisan',
      uasaScore: 92,
      uasaGrade: 'A',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Berkomunikasi secara lisan dengan santun dan berwibawa, membaca secara analitikal, serta menghasilkan karya kreatif yang boleh diteladani.',
      remarks: 'Cemerlang, idea sangat kreatif dan mampu memimpin sesi pembentangan kumpulan.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-003',
      studentName: 'Muhammad Harith Iskandar bin Zulkifli',
      studentId: '130209-10-2391',
      gender: 'L',
      masteryLevel: 'TP4',
      effort: 'SEDERHANA',
      assessmentMethod: 'bertulis',
      uasaScore: 68,
      uasaGrade: 'B',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Menjelaskan maklumat tersurat dan tersirat, membaca teks dengan intonasi sesuai serta menulis perenggan berformat.',
      remarks: 'Menunjukkan pemahaman yang baik, perlu perbaiki sedikit struktur tanda baca.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-004',
      studentName: 'Siti Nurhaliza binti Abdullah',
      studentId: '131103-10-3120',
      gender: 'P',
      masteryLevel: 'TP5',
      effort: 'TINGGI',
      assessmentMethod: 'pemerhatian',
      uasaScore: 78,
      uasaGrade: 'B',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Menilai maklumat, membaca secara kritis dan menulis karangan yang gramatis serta berkesan pada situasi baharu.',
      remarks: 'Sentiasa bersemangat dan menyiapkan latihan bertulis tepat pada masanya.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-005',
      studentName: 'Tan Wei Ming',
      studentId: '130518-10-0985',
      gender: 'L',
      masteryLevel: 'TP3',
      effort: 'SEDERHANA',
      assessmentMethod: 'bertulis',
      uasaScore: 54,
      uasaGrade: 'C',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Menyampaikan idea secara lisan, membaca teks secara mekanis dan membina pelbagai jenis ayat dengan lancar.',
      remarks: 'Mencapai tahap asas, masih memerlukan latihan tambahan membina ayat majmuk.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-006',
      studentName: 'Pravin a/l Subramaniam',
      studentId: '130927-10-4417',
      gender: 'L',
      masteryLevel: 'TP4',
      effort: 'TINGGI',
      assessmentMethod: 'lisan',
      uasaScore: 71,
      uasaGrade: 'B',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Menjelaskan maklumat tersurat dan tersirat, membaca teks dengan intonasi sesuai serta menulis perenggan berformat.',
      remarks: 'Dapat menyampaikan idea dengan lancar dalam aktiviti perbincangan lisan.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-007',
      studentName: 'Nur Farhana binti Azman',
      studentId: '130712-10-2218',
      gender: 'P',
      masteryLevel: 'TP4',
      effort: 'TINGGI',
      assessmentMethod: 'gabungan',
      uasaScore: 65,
      uasaGrade: 'C',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Menjelaskan maklumat tersurat dan tersirat, membaca teks dengan intonasi sesuai serta menulis perenggan berformat.',
      remarks: 'Bekerjasama dengan baik dalam pasukan dan mematuhi arahan tugasan.',
      dateRecorded: '2025-11-14',
    },
    {
      id: 'std-008',
      studentName: 'Adam Rayyan bin Firdaus',
      studentId: '131201-10-5593',
      gender: 'L',
      masteryLevel: 'TP2',
      effort: 'RENDAH',
      assessmentMethod: 'pemerhatian',
      uasaScore: 32,
      uasaGrade: 'E',
      assessmentTopic: 'Penulisan Karangan Fakta & Tatabahasa',
      subjectStatement: 'Memahami maklumat tersurat, membaca dan memahami perenggan pendek serta membina ayat tunggal dengan betul.',
      remarks: 'Memerlukan bimbingan rakan sebaya dan latih tubi berfokus dalam ejaan.',
      dateRecorded: '2025-11-14',
    },
  ],
};
