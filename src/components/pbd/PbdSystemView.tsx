import React, { useState, useEffect, useMemo } from 'react';
import {
  Language,
  PBDClassRecord,
  PBDStudentRecord,
  MasteryLevel,
  StudentEffort,
  AssessmentMethod,
} from '../../types';
import { translations } from '../../data/translations';
import {
  INITIAL_SAMPLE_PBD_CLASS,
  TP_DESCRIPTORS,
  STUDENT_EFFORT_CONFIG,
  ASSESSMENT_METHODS_CONFIG,
  calculateUasaGrade,
  getDskpStatement,
  QUICK_TEACHER_REMARKS,
} from '../../data/pbdSampleData';
import { BamuMascot } from '../brand/BamuMascot';
import {
  Users,
  Award,
  Download,
  Printer,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  RotateCcw,
  School,
  X,
  BookOpen,
  Search,
  Check,
  TrendingUp,
  FileDown,
} from 'lucide-react';
import {
  downloadIndividualStudentPbdPdf,
  downloadClassPbdSummaryPdf,
  downloadBatchAllStudentSlipsPdf,
} from '../../utils/pbdPdfReport';
import { PbdPdfReportModal } from './PbdPdfReportModal';
import { SearchBar } from '../common/SearchBar';
import { ToastNotification } from '../common/ToastNotification';
import { EmptyState } from '../common/EmptyState';

interface Props {
  language: Language;
}

const STORAGE_KEY = 'bamudi_pbd_class_v2_kpm';

export const PbdSystemView: React.FC<Props> = ({ language }) => {
  const t = translations[language].pbdSystem;
  const common = translations[language].common;

  // Class record state with localStorage backing
  const [classRecord, setClassRecord] = useState<PBDClassRecord>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...INITIAL_SAMPLE_PBD_CLASS,
          ...parsed,
          schoolCode: parsed.schoolCode || INITIAL_SAMPLE_PBD_CLASS.schoolCode,
          reportingPeriod: parsed.reportingPeriod || 'akhir',
          includeUasa: parsed.includeUasa ?? true,
          classTeacherName: parsed.classTeacherName || INITIAL_SAMPLE_PBD_CLASS.classTeacherName,
          classTeacherRemarks: parsed.classTeacherRemarks || INITIAL_SAMPLE_PBD_CLASS.classTeacherRemarks,
        };
      }
      return INITIAL_SAMPLE_PBD_CLASS;
    } catch {
      return INITIAL_SAMPLE_PBD_CLASS;
    }
  });

  // Active student for Official Slip Modal
  const [activeSlipStudent, setActiveSlipStudent] = useState<PBDStudentRecord | null>(null);

  // KPM Official Guide Reference Modal
  const [showKpmGuideModal, setShowKpmGuideModal] = useState(false);

  // KPM Official PDF Report Generator Modal
  const [showPdfReportModal, setShowPdfReportModal] = useState(false);
  const [pdfModalInitialStudent, setPdfModalInitialStudent] = useState<PBDStudentRecord | null>(null);

  // Filter state for student list
  const [filterType, setFilterType] = useState<'all' | 'needsSupport' | 'achieved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New student modal state
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newLevel, setNewLevel] = useState<MasteryLevel>('TP3');
  const [newEffort, setNewEffort] = useState<StudentEffort>('TINGGI');
  const [newMethod, setNewMethod] = useState<AssessmentMethod>('gabungan');
  const [newUasaScore, setNewUasaScore] = useState<string>('70');
  const [newRemarks, setNewRemarks] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Screen reader polite live calculation announcement
  const [calculationAnnouncement, setCalculationAnnouncement] = useState<string>('');

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(classRecord));
    } catch {
      // safe fallback
    }
  }, [classRecord]);

  // Analytics Calculations
  const totalStudents = classRecord.students.length;
  const countTP3Plus = classRecord.students.filter((s) =>
    ['TP3', 'TP4', 'TP5', 'TP6'].includes(s.masteryLevel)
  ).length;
  const percentageTP3Plus =
    totalStudents > 0 ? Math.round((countTP3Plus / totalStudents) * 100) : 0;

  // UASA Average score
  const validUasaScores = classRecord.students
    .map((s) => s.uasaScore)
    .filter((score): score is number => score !== undefined && score !== null && !isNaN(score));
  const uasaAverage =
    validUasaScores.length > 0
      ? Math.round(validUasaScores.reduce((acc, curr) => acc + curr, 0) / validUasaScores.length)
      : 0;
  const uasaAvgGrade = calculateUasaGrade(uasaAverage).grade;

  // Debounced announcement for screen readers when key aggregates recalculate
  useEffect(() => {
    const timer = setTimeout(() => {
      if (totalStudents > 0) {
        const msg =
          language === 'bm'
            ? `Pengiraan dikemas kini: ${percentageTP3Plus}% murid capai TP3 ke atas. Purata UASA ${uasaAverage}% Gred ${uasaAvgGrade}.`
            : `Calculations updated: ${percentageTP3Plus}% of students achieved TP3 or above. UASA average ${uasaAverage}% Grade ${uasaAvgGrade}.`;
        setCalculationAnnouncement(msg);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [percentageTP3Plus, uasaAverage, uasaAvgGrade, totalStudents, language]);

  const distribution = useMemo(() => {
    const counts: Record<MasteryLevel, number> = {
      TP1: 0,
      TP2: 0,
      TP3: 0,
      TP4: 0,
      TP5: 0,
      TP6: 0,
    };
    classRecord.students.forEach((s) => {
      counts[s.masteryLevel] = (counts[s.masteryLevel] || 0) + 1;
    });
    return counts;
  }, [classRecord.students]);

  // Filtered Student List
  const filteredStudents = useMemo(() => {
    return classRecord.students.filter((std) => {
      const matchSearch =
        std.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (filterType === 'needsSupport') {
        return std.masteryLevel === 'TP1' || std.masteryLevel === 'TP2';
      }
      if (filterType === 'achieved') {
        return ['TP3', 'TP4', 'TP5', 'TP6'].includes(std.masteryLevel);
      }
      return true;
    });
  }, [classRecord.students, searchQuery, filterType]);

  // Handle Class Metadata updates
  const handleUpdateClassInfo = (field: keyof PBDClassRecord, value: any) => {
    setClassRecord((prev) => ({
      ...prev,
      [field]: value,
      lastUpdated: Date.now(),
    }));
  };

  // Handle student mastery change
  const handleStudentLevelChange = (studentId: string, level: MasteryLevel) => {
    const autoStatement = getDskpStatement(classRecord.subject, level, language);
    setClassRecord((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              masteryLevel: level,
              subjectStatement: autoStatement,
            }
          : s
      ),
      lastUpdated: Date.now(),
    }));
  };

  // Handle student effort change
  const handleStudentEffortChange = (studentId: string, effort: StudentEffort) => {
    setClassRecord((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, effort } : s
      ),
      lastUpdated: Date.now(),
    }));
  };

  // Handle student assessment method change
  const handleStudentMethodChange = (studentId: string, method: AssessmentMethod) => {
    setClassRecord((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, assessmentMethod: method } : s
      ),
      lastUpdated: Date.now(),
    }));
  };

  // Handle student UASA mark change
  const handleStudentUasaChange = (studentId: string, scoreStr: string) => {
    const scoreNum = scoreStr === '' ? undefined : parseInt(scoreStr, 10);
    const validScore = scoreNum !== undefined && !isNaN(scoreNum) ? Math.max(0, Math.min(100, scoreNum)) : undefined;
    const gradeCalc = calculateUasaGrade(validScore);

    setClassRecord((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              uasaScore: validScore,
              uasaGrade: gradeCalc.grade,
            }
          : s
      ),
      lastUpdated: Date.now(),
    }));
  };

  // Handle student remarks change
  const handleStudentRemarksChange = (studentId: string, remarks: string) => {
    setClassRecord((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, remarks } : s
      ),
      lastUpdated: Date.now(),
    }));
  };

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const uasaNum = newUasaScore === '' ? undefined : parseInt(newUasaScore, 10);
    const validUasa = uasaNum !== undefined && !isNaN(uasaNum) ? Math.max(0, Math.min(100, uasaNum)) : undefined;
    const gradeCalc = calculateUasaGrade(validUasa);
    const autoStatement = getDskpStatement(classRecord.subject, newLevel, language);

    const newStudent: PBDStudentRecord = {
      id: `std-${Date.now()}`,
      studentName: newName.trim(),
      studentId: newId.trim() || `13${Math.floor(1000 + Math.random() * 9000)}-10-${Math.floor(1000 + Math.random() * 9000)}`,
      gender: newGender,
      masteryLevel: newLevel,
      effort: newEffort,
      assessmentMethod: newMethod,
      uasaScore: validUasa,
      uasaGrade: gradeCalc.grade,
      subjectStatement: autoStatement,
      assessmentTopic: classRecord.assessmentUnit,
      remarks:
        newRemarks.trim() ||
        (language === 'bm'
          ? 'Menunjukkan komitmen belajar yang baik dan menyiapkan tugasan.'
          : 'Demonstrates good learning commitment and completes tasks.'),
      dateRecorded: new Date().toISOString().split('T')[0],
    };

    setClassRecord((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
      lastUpdated: Date.now(),
    }));

    setNewName('');
    setNewId('');
    setNewRemarks('');
    setIsAddingStudent(false);

    setToastMessage(language === 'bm' ? 'Murid berjaya didaftarkan ke Borang Transit!' : 'Student added to Transit Sheet!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    setClassRecord((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
      lastUpdated: Date.now(),
    }));
    setToastMessage(language === 'bm' ? 'Rekod murid dipadam.' : 'Student record removed.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Reset to initial sample
  const handleResetSample = () => {
    setClassRecord(INITIAL_SAMPLE_PBD_CLASS);
    setToastMessage(language === 'bm' ? 'Data sampel rasmi KPM dimuat semula!' : 'Official MoE sample data reloaded!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export CSV conforming to KPM PBS Reporting columns
  const handleExportCsv = () => {
    const headers = [
      'Bil',
      'Nama Murid',
      'No ID / Kad Pengenalan',
      'Jantina',
      'Kaedah Pentaksiran',
      'Tahap Penguasaan (TP)',
      'Tafsiran Tahap Penguasaan',
      'Penyataan Standard Prestasi DSKP',
      'Usaha Murid',
      'Deskripsi Usaha Murid',
      'Skor UASA (%)',
      'Gred UASA',
      'Ulasan Guru Mata Pelajaran',
      'Tarikh Pentaksiran',
    ];

    const rows = classRecord.students.map((s, index) => {
      const tpInfo = TP_DESCRIPTORS[s.masteryLevel];
      const effortInfo = STUDENT_EFFORT_CONFIG[s.effort];
      const methodInfo = ASSESSMENT_METHODS_CONFIG[s.assessmentMethod];
      const statement = s.subjectStatement || getDskpStatement(classRecord.subject, s.masteryLevel, language);

      return [
        index + 1,
        `"${s.studentName.replace(/"/g, '""')}"`,
        `"${s.studentId}"`,
        s.gender,
        `"${methodInfo.label[language]}"`,
        s.masteryLevel,
        `"${tpInfo.name[language]}"`,
        `"${statement.replace(/"/g, '""')}"`,
        s.effort,
        `"${effortInfo.descriptor[language].replace(/"/g, '""')}"`,
        s.uasaScore !== undefined ? s.uasaScore : '-',
        s.uasaGrade || '-',
        `"${s.remarks.replace(/"/g, '""')}"`,
        s.dateRecorded,
      ];
    });

    const periodLabel =
      classRecord.reportingPeriod === 'pertengahan'
        ? 'PERTENGAHAN SESI AKADEMIK'
        : 'AKHIR SESI AKADEMIK';

    const csvContent =
      `"KEMENTERIAN PENDIDIKAN MALAYSIA"\n` +
      `"REKOD TRANSIT PELAPORAN PENTAKSIRAN BILIK DARJAH (PBD) - ${periodLabel}"\n` +
      `"Sekolah:","${classRecord.schoolName}","Kod Sekolah:","${classRecord.schoolCode}"\n` +
      `"Kelas:","${classRecord.className}","Tahun/Tingkatan:","${classRecord.yearGrade}"\n` +
      `"Mata Pelajaran:","${classRecord.subject}","Guru Mata Pelajaran:","${classRecord.teacherName}"\n` +
      `"Guru Kelas:","${classRecord.classTeacherName || '-'}","Sesi:","${classRecord.academicYear}"\n` +
      `"Fokus DSKP:","${classRecord.assessmentUnit}"\n\n` +
      headers.join(',') +
      '\n' +
      rows.map((r) => r.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PBD_${classRecord.className.replace(/\s+/g, '_')}_${classRecord.subject.replace(/\s+/g, '_')}_${classRecord.reportingPeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Individual Student Official Slip (.doc format matching KPM PBS 2025 Pages 77-89)
  const handleDownloadStudentSlipDoc = (student: PBDStudentRecord) => {
    const effortInfo = STUDENT_EFFORT_CONFIG[student.effort];
    const methodInfo = ASSESSMENT_METHODS_CONFIG[student.assessmentMethod];
    const statement = student.subjectStatement || getDskpStatement(classRecord.subject, student.masteryLevel, language);

    const periodText =
      classRecord.reportingPeriod === 'pertengahan'
        ? 'PERTENGAHAN SESI AKADEMIK'
        : 'AKHIR SESI AKADEMIK';

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Pelaporan PBD - ${student.studentName}</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000; padding: 25px; line-height: 1.35; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .title-area { text-align: center; font-weight: bold; }
          .inst-name { font-size: 13pt; text-transform: uppercase; margin: 0; }
          .slip-title { font-size: 12pt; text-transform: uppercase; margin: 3px 0; }
          .period-title { font-size: 11pt; text-transform: uppercase; margin: 0; color: #1e293b; }
          .meta-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
          .meta-table td { padding: 4px 6px; font-size: 10pt; vertical-align: top; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
          .data-table th, .data-table td { border: 1px solid #000; padding: 6px 8px; text-align: left; vertical-align: top; }
          .data-table th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
          .legend-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 9pt; }
          .legend-table th, .legend-table td { border: 1px solid #64748b; padding: 4px 6px; }
          .legend-table th { background-color: #f8fafc; font-weight: bold; }
          .remarks-card { border: 1px solid #000; padding: 8px 10px; margin-bottom: 15px; font-size: 10pt; }
          .sign-table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 9.5pt; }
          .sign-table td { width: 33.3%; vertical-align: top; padding: 0 10px; }
        </style>
      </head>
      <body>
        <div class="title-area">
          <p class="inst-name">KEMENTERIAN PENDIDIKAN MALAYSIA</p>
          <p class="slip-title">PELAPORAN PENTAKSIRAN BILIK DARJAH (PBD)</p>
          <p class="period-title">${periodText} · SESI ${classRecord.academicYear}</p>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width: 18%;"><strong>NAMA MURID</strong></td>
            <td style="width: 38%;">: ${student.studentName.toUpperCase()}</td>
            <td style="width: 18%;"><strong>TINGKATAN / TAHUN</strong></td>
            <td style="width: 26%;">: ${classRecord.yearGrade.toUpperCase()}</td>
          </tr>
          <tr>
            <td><strong>NO. ID / PENGENALAN</strong></td>
            <td>: ${student.studentId}</td>
            <td><strong>KELAS</strong></td>
            <td>: ${classRecord.className.toUpperCase()}</td>
          </tr>
          <tr>
            <td><strong>JANTINA</strong></td>
            <td>: ${student.gender === 'L' ? 'LELAKI' : 'PEREMPUAN'}</td>
            <td><strong>NAMA SEKOLAH</strong></td>
            <td>: ${classRecord.schoolName.toUpperCase()}</td>
          </tr>
          <tr>
            <td><strong>TARIKH PELAPORAN</strong></td>
            <td>: ${student.dateRecorded}</td>
            <td><strong>KOD SEKOLAH</strong></td>
            <td>: ${classRecord.schoolCode.toUpperCase()}</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th rowspan="2" style="width: 20%;">MATA PELAJARAN</th>
              <th colspan="2" style="width: 35%;">PENTAKSIRAN BERTERUSAN</th>
              ${classRecord.includeUasa ? '<th colspan="2" style="width: 15%;">UJIAN AKHIR SESI AKADEMIK (UASA)</th>' : ''}
              <th rowspan="2" style="width: 20%;">ULASAN GURU MATA PELAJARAN</th>
              <th rowspan="2" style="width: 10%;">USAHA MURID</th>
            </tr>
            <tr>
              <th style="width: 8%;">TAHAP PENGUASAAN</th>
              <th>PENYATAAN TAHAP PENGUASAAN</th>
              ${classRecord.includeUasa ? '<th style="width: 7%;">SKOR (%)</th><th style="width: 8%;">GRED</th>' : ''}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${classRecord.subject}</strong><br>
                <span style="font-size: 8.5pt; color: #475569;">Guru: ${classRecord.teacherName}</span><br>
                <span style="font-size: 8.5pt; color: #475569;">Kaedah: ${methodInfo.label.bm}</span>
              </td>
              <td style="text-align: center; font-weight: bold; font-size: 11pt;">
                ${student.masteryLevel}
              </td>
              <td style="font-size: 9.5pt; text-align: justify;">
                ${statement}
              </td>
              ${
                classRecord.includeUasa
                  ? `
                <td style="text-align: center; font-weight: bold;">${student.uasaScore !== undefined ? student.uasaScore + '%' : '-'}</td>
                <td style="text-align: center; font-weight: bold; font-size: 11pt;">${student.uasaGrade || '-'}</td>
              `
                  : ''
              }
              <td style="font-size: 9.5pt;">
                ${student.remarks}
              </td>
              <td style="text-align: center; font-weight: bold;">
                ${student.effort}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="remarks-card">
          <strong>ULASAN GURU KELAS:</strong>
          <p style="margin: 4px 0 0 0; line-height: 1.4;">${classRecord.classTeacherRemarks}</p>
        </div>

        <div style="margin-top: 12px;">
          <strong style="font-size: 9pt;">PETUNJUK USAHA MURID:</strong>
          <table class="legend-table">
            <tr>
              <td style="width: 25%;"><strong>SANGAT TINGGI:</strong> Murid menunjukkan daya usaha yang tinggi dan mampu berdikari.</td>
              <td style="width: 25%;"><strong>TINGGI:</strong> Murid menunjukkan daya usaha yang tinggi dan memerlukan sokongan untuk terus maju.</td>
              <td style="width: 25%;"><strong>SEDERHANA:</strong> Murid menunjukkan daya usaha dan memerlukan dorongan / sokongan.</td>
              <td style="width: 25%;"><strong>RENDAH:</strong> Murid kurang daya usaha dan memerlukan lebih dorongan / bantuan.</td>
            </tr>
          </table>
        </div>

        <table class="sign-table">
          <tr>
            <td>
              <p>Disediakan Oleh:</p>
              <div style="height: 45px;"></div>
              <p>....................................................<br>
              <strong>${classRecord.teacherName}</strong><br>
              Guru Mata Pelajaran</p>
            </td>
            <td>
              <p>Disahkan Oleh:</p>
              <div style="height: 45px;"></div>
              <p>....................................................<br>
              <strong>${classRecord.classTeacherName || classRecord.teacherName}</strong><br>
              Guru Kelas</p>
            </td>
            <td>
              <p>Pengesahan Pentadbir / Penjaga:</p>
              <div style="height: 45px;"></div>
              <p>....................................................<br>
              Pengetua / Guru Besar / Penjaga<br>
              Cop Rasmi Sekolah</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Slip_PBD_${student.studentName.replace(/\s+/g, '_')}_${classRecord.reportingPeriod}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn bg-[#fdfdfe]">
      {/* Screen Reader Calculation Live Region */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {calculationAnnouncement}
      </div>

      {/* Reusable Toast Notification */}
      <ToastNotification
        message={toastMessage}
        variant="success"
        onDismiss={() => setToastMessage(null)}
      />

      {/* Header with Bamu Companion & KPM Alignment Badge */}
      <div className="mb-8 bg-gradient-to-r from-sky-50 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sky-200 text-slate-900 text-xs font-bold shadow-2xs">
              <School className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>KPM PBS 2025 & PBD 2019</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdf2f0] text-[#99240b] border border-[#cc310e]/30 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-[#cc310e]" />
              <span>{classRecord.reportingPeriod === 'pertengahan' ? t.midYear : t.endYear}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {t.subtitle}
          </p>

          <div className="pt-3">
            <button
              onClick={() => setShowKpmGuideModal(true)}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold bg-white border border-sky-300 text-[#007acc] hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>{t.guideModalBtn}</span>
            </button>
          </div>
        </div>

        <div className="shrink-0 hidden md:block">
          <BamuMascot
            mood="happy"
            size="lg"
            speech={
              language === 'bm'
                ? 'Format PBD kini diselaraskan sepenuhnya dengan buku Panduan PBS KPM 2025: merangkumi kaedah pentaksiran, skala 4 usaha murid dan slip rasmi!'
                : 'PBD record system is now 100% aligned with MoE PBS 2025: includes assessment modes, 4 effort tiers and official slips!'
            }
          />
        </div>
      </div>

      {/* Class & Session Particulars Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0099ff]" />
              <span>{t.classInfoTitle}</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === 'bm'
                ? 'Konfigurasikan maklumat institusi, sesi pelaporan dan pilihan pentaksiran.'
                : 'Configure institutional details, reporting period and assessment settings.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSample}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetSampleBtn}</span>
            </button>
          </div>
        </div>

        {/* Reporting Period & UASA Toggle Row */}
        <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">{t.reportingPeriod}:</span>
            <button
              type="button"
              onClick={() => handleUpdateClassInfo('reportingPeriod', 'pertengahan')}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                classRecord.reportingPeriod === 'pertengahan'
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.midYear}
            </button>
            <button
              type="button"
              onClick={() => handleUpdateClassInfo('reportingPeriod', 'akhir')}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                classRecord.reportingPeriod === 'akhir'
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.endYear}
            </button>
          </div>

          <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 min-h-[44px] py-1">
            <input
              type="checkbox"
              checked={classRecord.includeUasa}
              onChange={(e) => handleUpdateClassInfo('includeUasa', e.target.checked)}
              className="w-4 h-4 text-[#0099ff] rounded border-slate-300 focus:ring-2 focus:ring-[#0099ff] cursor-pointer"
            />
            <span>{t.includeUasa}</span>
          </label>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.className}
            </label>
            <input
              type="text"
              value={classRecord.className}
              onChange={(e) => handleUpdateClassInfo('className', e.target.value)}
              className="min-h-[44px] w-full font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.subject}
            </label>
            <input
              type="text"
              value={classRecord.subject}
              onChange={(e) => handleUpdateClassInfo('subject', e.target.value)}
              className="min-h-[44px] w-full font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.yearGrade}
            </label>
            <input
              type="text"
              value={classRecord.yearGrade}
              onChange={(e) => handleUpdateClassInfo('yearGrade', e.target.value)}
              className="min-h-[44px] w-full font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.schoolCode}
            </label>
            <input
              type="text"
              value={classRecord.schoolCode}
              onChange={(e) => handleUpdateClassInfo('schoolCode', e.target.value)}
              placeholder="cth: WBA0042"
              className="min-h-[44px] w-full font-mono font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.schoolName}
            </label>
            <input
              type="text"
              value={classRecord.schoolName}
              onChange={(e) => handleUpdateClassInfo('schoolName', e.target.value)}
              className="min-h-[44px] w-full font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.teacherName}
            </label>
            <input
              type="text"
              value={classRecord.teacherName}
              onChange={(e) => handleUpdateClassInfo('teacherName', e.target.value)}
              className="min-h-[44px] w-full font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.classTeacherName}
            </label>
            <input
              type="text"
              value={classRecord.classTeacherName || ''}
              onChange={(e) => handleUpdateClassInfo('classTeacherName', e.target.value)}
              placeholder="cth: Pn. Siti Rahmah"
              className="min-h-[44px] w-full font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.academicYear}
            </label>
            <input
              type="text"
              value={classRecord.academicYear}
              onChange={(e) => handleUpdateClassInfo('academicYear', e.target.value)}
              className="min-h-[44px] w-full font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.assessmentUnit}
            </label>
            <input
              type="text"
              value={classRecord.assessmentUnit}
              onChange={(e) => handleUpdateClassInfo('assessmentUnit', e.target.value)}
              className="min-h-[44px] w-full font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.classTeacherRemarks} (Holistik / Sahsiah Murid)
            </label>
            <input
              type="text"
              value={classRecord.classTeacherRemarks}
              onChange={(e) => handleUpdateClassInfo('classTeacherRemarks', e.target.value)}
              className="min-h-[44px] w-full font-normal text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Analytics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">{t.totalStudents}</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-950 font-mono tabular-nums">
            {totalStudents}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">{t.achievedMin}</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-black text-2xl sm:text-3xl text-[#0099ff] font-mono tabular-nums">
              {percentageTP3Plus}%
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">({countTP3Plus}/{totalStudents})</span>
          </div>
        </div>

        {classRecord.includeUasa ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              {language === 'bm' ? 'Purata Skor & Gred UASA' : 'UASA Avg Score & Grade'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-950 font-mono tabular-nums">
                {uasaAverage}%
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#fdf2f0] text-[#99240b] border border-[#cc310e]/30 font-extrabold text-xs font-mono">
                Gred {uasaAvgGrade}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">{t.medianLevel}</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-[#007acc] font-mono">
              TP 4
            </span>
          </div>
        )}

        <div className="col-span-2 md:col-span-1 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-2">{t.distributionTitle}</span>
          <div className="grid grid-cols-6 gap-1 text-center">
            {(['TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6'] as MasteryLevel[]).map((lvl) => {
              const info = TP_DESCRIPTORS[lvl];
              const count = distribution[lvl];
              return (
                <div key={lvl} className={`p-1 rounded-xl border ${info.color.bg} ${info.color.border}`}>
                  <span className={`text-[9px] font-extrabold uppercase block ${info.color.text}`}>
                    {lvl}
                  </span>
                  <span className="text-xs font-extrabold font-mono text-slate-900 tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Student Transit Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span>{t.rosterTitle}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {filteredStudents.length} {language === 'bm' ? 'murid' : 'students'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bm'
                ? 'Pilih kaedah pentaksiran, tahap penguasaan TP, skala usaha murid serta skor UASA. Rekod disimpan automatik.'
                : 'Select assessment mode, mastery level TP, student effort and UASA score. Autosaved locally.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* KPM Official PDF Report Generator Modal Trigger - Primary Action */}
            <button
              onClick={() => {
                setPdfModalInitialStudent(null);
                setShowPdfReportModal(true);
              }}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0099ff] via-[#0088ee] to-[#0066cc] hover:from-[#0088ee] hover:to-[#0055bb] rounded-xl sm:rounded-full transition-all cursor-pointer shadow-md shadow-sky-500/20 group hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            >
              <FileDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              <span>{t.generatePdfReportBtn}</span>
            </button>

            {/* Add Student - Secondary Action */}
            <button
              onClick={() => setIsAddingStudent(true)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0066cc] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl sm:rounded-full transition-all cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            >
              <Plus className="w-4 h-4 text-[#0066cc]" />
              <span>{t.addStudentBtn}</span>
            </button>

            {/* Export CSV - Neutral Action */}
            <button
              onClick={handleExportCsv}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/60 rounded-xl sm:rounded-full transition-colors cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0099ff]" />
              <span>{t.exportCsvBtn}</span>
            </button>

            {/* Print Transit - Neutral Action */}
            <button
              onClick={() => window.print()}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/60 rounded-xl sm:rounded-full transition-colors cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>{t.printTransitBtn}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex-1 max-w-sm">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={language === 'bm' ? 'Cari nama atau No. ID murid...' : 'Search student name or ID...'}
              ariaLabel={language === 'bm' ? 'Cari murid' : 'Search students'}
              variant="compact"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl sm:rounded-full text-xs border border-slate-200/60">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`min-h-[44px] px-4 py-2 rounded-xl sm:rounded-full font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('needsSupport')}
              className={`min-h-[44px] px-4 py-2 rounded-xl sm:rounded-full font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                filterType === 'needsSupport' ? 'bg-[#fdf2f0] text-[#99240b] border border-[#cc310e]/30 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterNeedsSupport}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('achieved')}
              className={`min-h-[44px] px-4 py-2 rounded-xl sm:rounded-full font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                filterType === 'achieved' ? 'bg-sky-50 text-[#0066cc] border border-sky-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterAchieved}
            </button>
          </div>
        </div>

        {/* Table Container with scroll affordance */}
        <div className="relative overflow-x-auto border border-slate-200 rounded-2xl shadow-xs bg-white">
          <div className="md:hidden px-3 py-1.5 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-[11px] text-[#0066cc]">
            <span className="font-semibold">
              {language === 'bm' ? '← Geser jadual untuk melihat semua lajur →' : '← Scroll horizontally to view all columns →'}
            </span>
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-full border border-sky-200 font-bold">
              {filteredStudents.length} {language === 'bm' ? 'murid' : 'students'}
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-sky-50/60 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3.5 px-3 w-10 text-center sticky left-0 z-20 bg-sky-50">
                  Bil
                </th>
                <th className="py-3.5 px-3 min-w-[190px] sticky left-10 z-20 bg-sky-50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.06)] border-r border-sky-100">
                  {t.studentName}
                </th>
                <th className="py-3.5 px-2 w-14 text-center">{t.gender}</th>
                <th className="py-3.5 px-3 w-34">{t.assessmentMethod}</th>
                <th className="py-3.5 px-3 w-36">{t.masteryLevel}</th>
                <th className="py-3.5 px-3 w-36">{t.effort}</th>
                {classRecord.includeUasa && (
                  <th className="py-3.5 px-3 w-32 text-center">{t.uasaScore}</th>
                )}
                <th className="py-3.5 px-3 min-w-[200px]">{t.remarks}</th>
                <th className="py-3.5 px-3 w-40 min-w-[156px] text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={classRecord.includeUasa ? 9 : 8} className="py-8 text-center text-slate-400">
                    {language === 'bm' ? 'Tiada rekod murid ditemui.' : 'No student records match filter.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, index) => {
                  const tpInfo = TP_DESCRIPTORS[std.masteryLevel];
                  const effortInfo = STUDENT_EFFORT_CONFIG[std.effort];

                  return (
                    <tr key={std.id} className="hover:bg-sky-50/40 transition-colors group">
                      {/* Bil (Sticky column 1) */}
                      <td className="py-3.5 px-3 font-mono text-center text-slate-500 font-bold sticky left-0 z-10 bg-white group-hover:bg-[#f8fbfe]">
                        {index + 1}
                      </td>

                      {/* Name & ID (Sticky column 2 with subtle right-edge shadow divider) */}
                      <td className="py-3.5 px-3 sticky left-10 z-10 bg-white group-hover:bg-[#f8fbfe] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.06)] border-r border-slate-100">
                        <span className="font-bold text-slate-900 block font-display leading-tight">
                          {std.studentName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                          {std.studentId}
                        </span>
                      </td>

                      {/* Gender */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="font-mono px-2 py-1.5 rounded-md bg-slate-100 font-bold text-slate-700 text-[10.5px]">
                          {std.gender}
                        </span>
                      </td>

                      {/* Kaedah Pentaksiran */}
                      <td className="py-3 px-3">
                        <select
                          value={std.assessmentMethod}
                          aria-label={`${t.assessmentMethod} - ${std.studentName}`}
                          onChange={(e) =>
                            handleStudentMethodChange(std.id, e.target.value as AssessmentMethod)
                          }
                          className="min-h-[44px] w-full text-[11px] font-semibold text-slate-800 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-2.5 py-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                        >
                          {(['pemerhatian', 'lisan', 'bertulis', 'gabungan'] as AssessmentMethod[]).map((m) => (
                            <option key={m} value={m}>
                              {ASSESSMENT_METHODS_CONFIG[m].label[language]}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Tahap Penguasaan TP */}
                      <td className="py-3 px-3">
                        <select
                          value={std.masteryLevel}
                          aria-label={`${t.masteryLevel} - ${std.studentName}`}
                          onChange={(e) =>
                            handleStudentLevelChange(std.id, e.target.value as MasteryLevel)
                          }
                          className={`min-h-[44px] w-full text-xs font-bold rounded-xl px-2.5 py-2.5 border hover:border-sky-400 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors ${tpInfo.color.bg} ${tpInfo.color.text} ${tpInfo.color.border}`}
                        >
                          {(['TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6'] as MasteryLevel[]).map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl} - {TP_DESCRIPTORS[lvl].name[language]}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Usaha Murid */}
                      <td className="py-3 px-3">
                        <select
                          value={std.effort}
                          aria-label={`${t.effort} - ${std.studentName}`}
                          onChange={(e) =>
                            handleStudentEffortChange(std.id, e.target.value as StudentEffort)
                          }
                          className={`min-h-[44px] w-full text-[11px] font-bold rounded-xl px-2.5 py-2.5 border hover:border-sky-400 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors ${effortInfo.badgeClass}`}
                        >
                          {(['SANGAT TINGGI', 'TINGGI', 'SEDERHANA', 'RENDAH'] as StudentEffort[]).map((eff) => (
                            <option key={eff} value={eff}>
                              {STUDENT_EFFORT_CONFIG[eff].label[language]}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* UASA Score & Auto-grade */}
                      {classRecord.includeUasa && (
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              aria-label={`${t.uasaScore} - ${std.studentName}`}
                              value={std.uasaScore !== undefined ? std.uasaScore : ''}
                              onChange={(e) => handleStudentUasaChange(std.id, e.target.value)}
                              placeholder="0-100"
                              className="min-h-[44px] w-14 text-center font-mono font-bold text-xs bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                            />
                            <span className="min-h-[44px] min-w-[34px] inline-flex items-center justify-center font-mono font-extrabold text-xs px-2 py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/80">
                              {std.uasaGrade || '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Remarks */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={std.remarks}
                          onChange={(e) => handleStudentRemarksChange(std.id, e.target.value)}
                          placeholder={language === 'bm' ? 'Catatan perkembangan murid...' : 'Teacher remarks...'}
                          className="min-h-[44px] w-full text-xs text-slate-800 bg-[#fdfdfe]/60 hover:bg-[#fdfdfe] border border-transparent hover:border-sky-200 focus:border-[#0099ff] focus:bg-white rounded-xl px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] transition-all"
                        />
                      </td>

                      {/* Actions - 44px min hit targets */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick PDF Slip Download */}
                          <button
                            onClick={() => {
                              downloadIndividualStudentPbdPdf(classRecord, std, language);
                              setToastMessage(
                                language === 'bm'
                                  ? `Slip PBD PDF bagi ${std.studentName} berjaya dimuat turun!`
                                  : `Official PBD PDF Slip for ${std.studentName} downloaded!`
                              );
                              setTimeout(() => setToastMessage(null), 3500);
                            }}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2.5 text-[#0099ff] hover:text-[#0055aa] hover:bg-sky-50 rounded-xl cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                            title={t.downloadSlipPdf}
                          >
                            <FileDown className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setActiveSlipStudent(std)}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2.5 text-[#007acc] hover:text-[#0055aa] hover:bg-sky-50 rounded-xl cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                            title={t.downloadSlipBtn}
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteStudent(std.id)}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                            title="Padam Rekod Murid"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {t.addStudentBtn}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {language === 'bm' ? 'Daftar murid baharu ke Borang Transit Kelas' : 'Register new student to class transit record'}
                </p>
              </div>
              <button
                onClick={() => setIsAddingStudent(false)}
                aria-label={common.close}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {t.studentName} *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="cth: Muhammad Zikri bin Razak"
                  className="min-h-[44px] w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.studentId} (No. ID / KP)
                  </label>
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="cth: 130812-10-3321"
                    className="min-h-[44px] w-full text-xs font-mono font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.gender}
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                    className="min-h-[44px] w-full text-xs font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                  >
                    <option value="L">{language === 'bm' ? 'Lelaki' : 'Male'}</option>
                    <option value="P">{language === 'bm' ? 'Perempuan' : 'Female'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.masteryLevel}
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as MasteryLevel)}
                    className="min-h-[44px] w-full text-xs font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                  >
                    {(['TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6'] as MasteryLevel[]).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl} - {TP_DESCRIPTORS[lvl].name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.effort} (KPM)
                  </label>
                  <select
                    value={newEffort}
                    onChange={(e) => setNewEffort(e.target.value as StudentEffort)}
                    className="min-h-[44px] w-full text-xs font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                  >
                    {(['SANGAT TINGGI', 'TINGGI', 'SEDERHANA', 'RENDAH'] as StudentEffort[]).map((eff) => (
                      <option key={eff} value={eff}>
                        {STUDENT_EFFORT_CONFIG[eff].label[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.assessmentMethod}
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as AssessmentMethod)}
                    className="min-h-[44px] w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                  >
                    {(['pemerhatian', 'lisan', 'bertulis', 'gabungan'] as AssessmentMethod[]).map((m) => (
                      <option key={m} value={m}>
                        {ASSESSMENT_METHODS_CONFIG[m].label[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.uasaScore} (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newUasaScore}
                    onChange={(e) => setNewUasaScore(e.target.value)}
                    placeholder="cth: 78"
                    className="min-h-[44px] w-full text-xs font-mono font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {t.remarks}
                </label>
                <textarea
                  rows={2}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Catatan perkembangan atau ulasan guru..."
                  className="w-full text-xs text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                />

                {/* Quick Comment Chips */}
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">
                    {t.quickRemarksPrompt}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TEACHER_REMARKS.slice(0, 3).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewRemarks(item[language])}
                        className="min-h-[36px] inline-flex items-center text-[10.5px] bg-sky-50 hover:bg-sky-100 text-[#0066cc] px-3 py-1.5 rounded-xl border border-sky-200 transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                      >
                        + {item[language].substring(0, 35)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl sm:rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
                >
                  {common.close}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0099ff] to-[#0088ee] hover:from-[#0088ee] hover:to-[#0077dd] rounded-xl sm:rounded-full transition-all cursor-pointer shadow-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                >
                  {t.addStudentBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Student Slip Modal (KPM PBS 2025 Format) */}
      {activeSlipStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-xs font-mono font-bold text-[#007acc] uppercase block mb-1">
                  Kementerian Pendidikan Malaysia · Panduan Pengurusan PBS 2025
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {t.slipModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveSlipStudent(null)}
                aria-label={common.close}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Paper Layout (Mirrors Government Slip on Page 77-89) */}
            <div className="border border-slate-300 rounded-2xl p-6 bg-white shadow-xs space-y-4 text-xs font-sans text-slate-900 mb-6">
              {/* Slip Header */}
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <p className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                  KEMENTERIAN PENDIDIKAN MALAYSIA
                </p>
                <h4 className="font-extrabold text-base text-slate-950 uppercase font-display mt-0.5">
                  PELAPORAN PENTAKSIRAN BILIK DARJAH (PBD)
                </h4>
                <p className="text-xs text-slate-700 font-bold uppercase mt-0.5">
                  {classRecord.reportingPeriod === 'pertengahan'
                    ? 'PERTENGAHAN SESI AKADEMIK'
                    : 'AKHIR SESI AKADEMIK'}{' '}
                  · SESI {classRecord.academicYear}
                </p>
              </div>

              {/* Student Metadata Matrix */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs border-b border-slate-200 pb-3">
                <div className="flex items-baseline">
                  <span className="w-32 font-bold text-slate-600 shrink-0">NAMA MURID:</span>
                  <span className="font-black text-slate-950 uppercase font-display">
                    {activeSlipStudent.studentName}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-bold text-slate-600 shrink-0">TINGKATAN / TAHUN:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {classRecord.yearGrade}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-bold text-slate-600 shrink-0">NO. ID / PENGENALAN:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {activeSlipStudent.studentId}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-bold text-slate-600 shrink-0">KELAS:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {classRecord.className}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-bold text-slate-600 shrink-0">JANTINA:</span>
                  <span className="font-bold text-slate-900">
                    {activeSlipStudent.gender === 'L' ? 'LELAKI' : 'PEREMPUAN'}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-32 font-bold text-slate-600 shrink-0">KOD SEKOLAH:</span>
                  <span className="font-mono font-bold text-slate-900 uppercase">
                    {classRecord.schoolCode}
                  </span>
                </div>
                <div className="flex items-baseline col-span-2">
                  <span className="w-32 font-bold text-slate-600 shrink-0">NAMA SEKOLAH:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {classRecord.schoolName}
                  </span>
                </div>
              </div>

              {/* Subject Assessment Table */}
              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th rowSpan={2} className="p-2.5 border-r border-slate-300">Mata Pelajaran</th>
                      <th colSpan={2} className="p-2 border-r border-slate-300 text-center">Pentaksiran Berterusan</th>
                      {classRecord.includeUasa && (
                        <th colSpan={2} className="p-2 border-r border-slate-300 text-center">UASA</th>
                      )}
                      <th rowSpan={2} className="p-2.5 border-r border-slate-300">Ulasan Guru Mata Pelajaran</th>
                      <th rowSpan={2} className="p-2.5 text-center">Usaha Murid</th>
                    </tr>
                    <tr className="bg-slate-50 text-[11px] font-bold border-b border-slate-300">
                      <th className="p-1.5 text-center w-14 border-r border-slate-300">TP</th>
                      <th className="p-1.5 border-r border-slate-300">Penyataan Tahap Penguasaan</th>
                      {classRecord.includeUasa && (
                        <>
                          <th className="p-1.5 text-center w-12 border-r border-slate-300">Skor</th>
                          <th className="p-1.5 text-center w-12 border-r border-slate-300">Gred</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 border-r border-slate-300 align-top">
                        <span className="font-extrabold text-slate-950 block">{classRecord.subject}</span>
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Guru: {classRecord.teacherName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Kaedah: {ASSESSMENT_METHODS_CONFIG[activeSlipStudent.assessmentMethod].label[language]}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-black text-sm text-[#0066cc] border-r border-slate-300 align-top">
                        {activeSlipStudent.masteryLevel}
                      </td>
                      <td className="p-2.5 text-[11px] leading-relaxed text-slate-800 border-r border-slate-300 align-top">
                        {activeSlipStudent.subjectStatement ||
                          getDskpStatement(classRecord.subject, activeSlipStudent.masteryLevel, language)}
                      </td>
                      {classRecord.includeUasa && (
                        <>
                          <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 align-top">
                            {activeSlipStudent.uasaScore !== undefined ? `${activeSlipStudent.uasaScore}%` : '-'}
                          </td>
                          <td className="p-2.5 text-center font-mono font-extrabold text-sm border-r border-slate-300 align-top">
                            {activeSlipStudent.uasaGrade || '-'}
                          </td>
                        </>
                      )}
                      <td className="p-2.5 text-[11px] leading-relaxed text-slate-800 border-r border-slate-300 align-top">
                        {activeSlipStudent.remarks}
                      </td>
                      <td className="p-2.5 text-center align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            STUDENT_EFFORT_CONFIG[activeSlipStudent.effort].badgeClass
                          }`}
                        >
                          {activeSlipStudent.effort}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Class Teacher Remarks Box */}
              <div className="bg-[#FAF9F5] border border-slate-200 rounded-xl p-3 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">
                  ULASAN GURU KELAS:
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{classRecord.classTeacherRemarks}"
                </p>
              </div>

              {/* Student Effort Legend (Mandatory KPM Table) */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 text-[10.5px]">
                <span className="font-bold text-slate-800 block mb-1.5 uppercase text-[10px]">
                  PETUNJUK USAHA MURID (KPM):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['SANGAT TINGGI', 'TINGGI', 'SEDERHANA', 'RENDAH'] as StudentEffort[]).map((eff) => (
                    <div key={eff} className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                      <span className="font-extrabold text-[10px] text-slate-900 block">
                        {eff}:
                      </span>
                      <p className="text-[10px] text-slate-600 leading-tight">
                        {STUDENT_EFFORT_CONFIG[eff].descriptor[language]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official 3-Signatory Verification Section */}
              <div className="grid grid-cols-3 gap-4 pt-4 text-[10.5px] text-slate-600">
                <div>
                  <p>Disediakan Oleh:</p>
                  <div className="h-10" />
                  <p className="font-bold text-slate-900 border-t border-slate-300 pt-1">
                    {classRecord.teacherName}<br />
                    <span className="text-slate-500 font-normal">Guru Mata Pelajaran</span>
                  </p>
                </div>
                <div>
                  <p>Disahkan Oleh:</p>
                  <div className="h-10" />
                  <p className="font-bold text-slate-900 border-t border-slate-300 pt-1">
                    {classRecord.classTeacherName || classRecord.teacherName}<br />
                    <span className="text-slate-500 font-normal">Guru Kelas</span>
                  </p>
                </div>
                <div>
                  <p>Pengesahan Pentadbir / Penjaga:</p>
                  <div className="h-10" />
                  <p className="font-bold text-slate-900 border-t border-slate-300 pt-1">
                    Pengetua / Guru Besar<br />
                    <span className="text-slate-500 font-normal">Cop Rasmi Sekolah</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSlipStudent(null)}
                className="min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full cursor-pointer"
              >
                {t.closeModal}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.printSlip}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadStudentSlipDoc(activeSlipStudent)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadSlipDoc}</span>
              </button>

              {/* Primary Official PDF Download */}
              <button
                type="button"
                onClick={() => {
                  downloadIndividualStudentPbdPdf(classRecord, activeSlipStudent, language);
                  setToastMessage(
                    language === 'bm'
                      ? `Slip PBD PDF bagi ${activeSlipStudent.studentName} berjaya dimuat turun!`
                      : `Official PBD PDF Slip for ${activeSlipStudent.studentName} downloaded!`
                  );
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0099ff] to-[#0088ee] hover:from-[#0088ee] hover:to-[#0077dd] rounded-full transition-all cursor-pointer shadow-xs hover:scale-102"
              >
                <FileDown className="w-4 h-4 text-white" />
                <span>{t.downloadSlipPdf}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official KPM Guide Reference Modal */}
      {showKpmGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center text-[#0099ff]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {language === 'bm'
                      ? 'Panduan Pengurusan PBS & PBD KPM (2025 / 2019)'
                      : 'MoE PBS & PBD Implementation Guide (2025 / 2019)'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Berdasarkan Dokumen Rasmi Lembaga Peperiksaan & Bahagian Pembangunan Kurikulum KPM
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKpmGuideModal(false)}
                aria-label={common.close}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs text-slate-700">
              {/* Section 1: Konsep & Komponen PBS */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0099ff]" />
                  <span>1. Komponen PBS (Pentaksiran Berasaskan Sekolah)</span>
                </h4>
                <p className="leading-relaxed">
                  PBS merangkumi komponen <strong>Akademik</strong> [Pentaksiran Pusat (PP) dan Pentaksiran Bilik Darjah (PBD)] serta komponen <strong>Bukan Akademik</strong> [PAJSK dan PPsi]. PBD dilaksanakan secara berterusan melalui dua bentuk:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Pentaksiran Formatif:</strong> Pentaksiran untuk pembelajaran (<em>Assessment for learning</em>) dan pentaksiran sebagai pembelajaran (<em>Assessment as learning</em>).</li>
                  <li><strong>Pentaksiran Sumatif:</strong> Pentaksiran tentang pembelajaran (<em>Assessment of learning</em>) termasuk Ujian Akhir Sesi Akademik (UASA) bagi Tahap 2 dan Menengah Rendah.</li>
                </ul>
              </div>

              {/* Section 2: 4 Teras Pertimbangan Profesional */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0099ff]" />
                  <span>2. Empat Teras Pertimbangan Profesional Guru</span>
                </h4>
                <p className="leading-relaxed">
                  Penentuan Tahap Penguasaan (TP) murid bukanlah purata markah ujian, sebaliknya merupakan <strong>pertimbangan profesional</strong> guru yang beretika berdasarkan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100">
                    <span className="font-bold text-[#0055aa] block">1. Pengetahuan Guru</span>
                    <span className="text-[11px] text-[#0066cc]">Pemahaman mendalam tentang DSKP kurikulum, psikologi murid dan pedagogi.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="font-bold text-blue-950 block">2. Tanggungjawab Profesional</span>
                    <span className="text-[11px] text-blue-800">Integriti, keadilan, ketelusan dan objektiviti dalam mentaksir potensi murid.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fdf2f0] border border-[#cc310e]/30">
                    <span className="font-bold text-[#99240b] block">3. Input Murid</span>
                    <span className="text-[11px] text-[#cc310e]">Maklum balas daripada pentaksiran kendiri, rakan sebaya dan eviden kerja.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100">
                    <span className="font-bold text-cyan-950 block">4. Pengalaman Mengajar</span>
                    <span className="text-[11px] text-cyan-800">Kebolehan membanding, merancang intervensi dan memantau kemajuan jangka panjang.</span>
                  </div>
                </div>
              </div>

              {/* Section 3: 3 Kaedah Pentaksiran */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0099ff]" />
                  <span>3. Tiga Kaedah Pentaksiran Berterusan (PBD 2019 Bab 5 & 7)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-900 block">Pemerhatian</span>
                    <span className="text-[11px] text-slate-600">Senarai semak, skala kadar, catatan anekdot, dan rekod berterusan semasa amali/PdP.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-900 block">Lisan</span>
                    <span className="text-[11px] text-slate-600">Soal jawab berstruktur, pembentangan murid, temu bual, perbincangan meja bulat, dan deklamasi.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-slate-900 block">Bertulis</span>
                    <span className="text-[11px] text-slate-600">Lembaran kerja, karangan, laporan projek amali, kuiz, dan ujian diagnostik bertulis.</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Skala Gred Rasmi UASA KPM */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0099ff]" />
                  <span>4. Skala Gred Rasmi UASA (Panduan PBS 2025 Muka Surat 51)</span>
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-center text-xs">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-200">
                        <th className="p-2">Gred</th>
                        <th className="p-2">Julat Markah (%)</th>
                        <th className="p-2 text-left">Tafsiran KPM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="p-1.5 font-bold font-mono">A</td><td className="p-1.5 font-mono">82 - 100</td><td className="p-1.5 text-left text-[#0066cc] font-bold">Cemerlang</td></tr>
                      <tr><td className="p-1.5 font-bold font-mono">B</td><td className="p-1.5 font-mono">66 - 81</td><td className="p-1.5 text-left text-sky-800 font-semibold">Kepujian</td></tr>
                      <tr><td className="p-1.5 font-bold font-mono">C</td><td className="p-1.5 font-mono">50 - 65</td><td className="p-1.5 text-left text-blue-800 font-semibold">Baik</td></tr>
                      <tr><td className="p-1.5 font-bold font-mono">D</td><td className="p-1.5 font-mono">35 - 49</td><td className="p-1.5 text-left text-amber-800 font-semibold">Memuaskan</td></tr>
                      <tr><td className="p-1.5 font-bold font-mono">E</td><td className="p-1.5 font-mono">20 - 34</td><td className="p-1.5 text-left text-orange-800 font-semibold">Mencapai Tahap Minimum</td></tr>
                      <tr><td className="p-1.5 font-bold font-mono">F</td><td className="p-1.5 font-mono">0 - 19</td><td className="p-1.5 text-left text-rose-800 font-semibold">Belum Mencapai Tahap Minimum</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowKpmGuideModal(false)}
                className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-colors cursor-pointer shadow-xs"
              >
                {common.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official KPM PBD PDF Report Center Modal */}
      {showPdfReportModal && (
        <PbdPdfReportModal
          classRecord={classRecord}
          language={language}
          initialStudent={pdfModalInitialStudent}
          onClose={() => setShowPdfReportModal(false)}
          onToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}
    </div>
  );
};
