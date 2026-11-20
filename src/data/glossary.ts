import { GlossaryItem } from '../types';

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'storan-awan',
    termBM: 'Storan Awan',
    termEN: 'Cloud Storage',
    category: 'cloud',
    definition: {
      bm: 'Sistem penyimpanan fail di pelayan internet yang selamat (seperti Google Drive, OneDrive) membolehkan fail diakses dari mana-mana peranti.',
      en: 'A network of remote internet servers (e.g., Google Drive, OneDrive) that store files securely and allow access from any authorized device.',
    },
    exampleInSchool: {
      bm: 'Cikgu menaip RPH di komputer riba rumah, dan terus boleh membukanya di komputer bilik guru keesokan harinya tanpa memerlukan pemacu kilat (pen drive).',
      en: 'A teacher drafts a lesson plan on a home laptop and immediately opens it on the staffroom computer without needing a USB flash drive.',
    },
  },
  {
    id: 'gesaan-prompt',
    termBM: 'Gesaan / Arahan',
    termEN: 'Prompt',
    category: 'ai',
    definition: {
      bm: 'Teks arahan atau soalan khusus yang ditaip oleh pengguna kepada sistem kecerdasan buatan (AI) untuk menghasilkan jawapan yang diingini.',
      en: 'The specific textual instruction, question, or scenario given to an artificial intelligence model to elicit a tailored response.',
    },
    exampleInSchool: {
      bm: '"Bertindak sebagai guru Sains Tahun 4, bina 5 soalan kefahaman berkaitan kitaran air beserta skema jawapan."',
      en: '"Act as a 4th-grade science teacher and generate 5 reading comprehension questions on the water cycle with an answer key."',
    },
  },
  {
    id: 'ai-generatif',
    termBM: 'Kecerdasan Buatan Generatif',
    termEN: 'Generative AI',
    category: 'ai',
    definition: {
      bm: 'Teknologi AI yang mampu mencipta kandungan baharu—seperti teks karangan, imej, idea aktiviti, atau kod—berdasarkan corak data yang telah dipelajarinya.',
      en: 'AI models capable of producing novel content—such as text, images, classroom activity plans, or code—based on patterns learned from data.',
    },
    exampleInSchool: {
      bm: 'Menggunakan model bahasa untuk membantu mencadangkan aktiviti pemula (set induksi) yang menarik bagi topik sejarah kemerdekaan.',
      en: 'Employing a language model to brainstorm engaging hook activities for a history unit on national independence.',
    },
  },
  {
    id: 'halusinasi-ai',
    termBM: 'Halusinasi AI',
    termEN: 'AI Hallucination',
    category: 'ai',
    definition: {
      bm: 'Keadaan di mana model AI menghasilkan jawapan yang kedengaran sangat meyakinkan tetapi sebenarnya fakta atau maklumat tersebut adalah palsu dan rekaan semata-mata.',
      en: 'A phenomenon where an AI generates statements that sound remarkably authoritative but are factually incorrect or completely fabricated.',
    },
    exampleInSchool: {
      bm: 'AI memberikan tarikh perjanjian sejarah yang salah atau mereka-reka nama menteri yang tidak pernah wujud dalam buku teks.',
      en: 'An AI cites an incorrect historical treaty year or invents an educational ministry decree that never existed in syllabus documents.',
    },
  },
  {
    id: 'lms-pengurusan-pembelajaran',
    termBM: 'Sistem Pengurusan Pembelajaran (LMS)',
    termEN: 'Learning Management System (LMS)',
    category: 'pedagogy',
    definition: {
      bm: 'Aplikasi perisian untuk pentadbiran, dokumentasi, penjejakan, pelaporan, automasi, dan penyampaian kursus pendidikan atau bahan latihan murid.',
      en: 'A software application for administering, documenting, tracking, reporting, and delivering educational courses or student learning materials.',
    },
    exampleInSchool: {
      bm: 'Platform Google Classroom dan DELIMa yang digunakan untuk mengagihkan modul kerja sekolah dan merekod kehadiran murid secara digital.',
      en: 'Platforms like Google Classroom and DELIMa utilized by schools to distribute learning modules and grade assignments digitally.',
    },
  },
  {
    id: 'gamifikasi',
    termBM: 'Gamifikasi',
    termEN: 'Gamification',
    category: 'pedagogy',
    definition: {
      bm: 'Penerapan elemen reka bentuk permainan (seperti mata ganjaran, cabaran masa, dan lencana) ke dalam persekitaran pembelajaran untuk merangsang motivasi murid.',
      en: 'Integrating game design elements (such as points, countdown timers, badges, and scoreboards) into classroom contexts to boost motivation.',
    },
    exampleInSchool: {
      bm: 'Menjalankan kuiz Quizizz atau Wordwall di mana murid berlumba mengumpul markah dan memanjat papan pendahulu bilik darjah.',
      en: 'Running a Quizizz session where students earn points and climb the class leaderboard while reviewing mathematics formulas.',
    },
  },
  {
    id: 'pembelajaran-asinkronus',
    termBM: 'Pembelajaran Asinkronus',
    termEN: 'Asynchronous Learning',
    category: 'pedagogy',
    definition: {
      bm: 'Kaedah pembelajaran di mana guru dan murid tidak berinteraksi pada masa yang sama; murid belajar mengikut jadual dan rentak kendiri mereka.',
      en: 'A learning model where educators and students engage at different times; learners navigate study materials at their own self-determined pace.',
    },
    exampleInSchool: {
      bm: 'Guru memuat naik video eksperimen sains ke Google Classroom pada petang Ahad untuk ditonton murid sebelum kelas Isnin bermula.',
      en: 'A teacher posts a recorded lab demonstration on Google Classroom over the weekend for students to watch before Monday morning class.',
    },
  },
  {
    id: 'pembelajaran-sinkronus',
    termBM: 'Pembelajaran Sinkronus',
    termEN: 'Synchronous Learning',
    category: 'pedagogy',
    definition: {
      bm: 'Pembelajaran yang berlaku pada waktu yang sama secara langsung di antara guru dan murid, sama ada secara bersemuka fizikal atau melalui panggilan video.',
      en: 'Learning that occurs concurrently in real time between teachers and pupils, either in a physical room or via live virtual video calls.',
    },
    exampleInSchool: {
      bm: 'Sesi pengajaran bersemuka di bilik darjah atau sesi Google Meet secara langsung semasa penutupan sekolah akibat jerebu.',
      en: 'A face-to-face class interactive lesson or live Google Meet lecture during inclement weather school closures.',
    },
  },
  {
    id: 'hiperrangkai-hyperlink',
    termBM: 'Pautan / Hiperrangkai',
    termEN: 'Hyperlink',
    category: 'general',
    definition: {
      bm: 'Teks atau imej bergaris dalam dokumen digital atau laman web yang apabila diklik akan membawa pengguna ke dokumen, video, atau laman web lain.',
      en: 'A clickable text word, button, or graphic on a digital document or webpage that routes the user to another resource, video, or site.',
    },
    exampleInSchool: {
      bm: 'Cikgu memasukkan pautan video YouTube ke dalam teks "Klik di sini untuk tonton animasi sel" di dalam slaid PowerPoint.',
      en: 'A teacher embeds a YouTube video URL into the slide text "Click here to watch the cell animation" on a PowerPoint slide.',
    },
  },
  {
    id: 'format-pdf',
    termBM: 'Format Dokumen Mudah Alih (PDF)',
    termEN: 'Portable Document Format (PDF)',
    category: 'general',
    definition: {
      bm: 'Format fail sejagat yang memastikan susun atur teks, fon, dan gambar tidak akan lari atau berubah apabila dibuka pada komputer atau telefon lain.',
      en: 'A universal file format that preserves layout typography, fonts, and graphics identically regardless of the viewing device or operating system.',
    },
    exampleInSchool: {
      bm: 'Menyimpan kertas soalan peperiksaan akhir tahun sebagai fail PDF sebelum dihantar ke bilik cetak sekolah agar garis jadual tidak berselerak.',
      en: 'Exporting final exam papers as PDF before sending to the school printing office to ensure tables and layout do not shift.',
    },
  },
  {
    id: 'tiket-keluar-exit-ticket',
    termBM: 'Tiket Keluar (Exit Ticket)',
    termEN: 'Exit Ticket',
    category: 'pedagogy',
    definition: {
      bm: 'Aktiviti pentaksiran formatif ringkas 2 minit di akhir pengajaran di mana murid menjawab satu atau dua soalan refleksi sebelum meninggalkan bilik darjah.',
      en: 'A brief 2-minute formative assessment task at the end of a lesson where students respond to a prompt before leaving the learning space.',
    },
    exampleInSchool: {
      bm: 'Setiap murid menulis 1 perkara yang mereka paling faham dan 1 soalan yang belum faham pada nota melekit Padlet sebelum loceng berbunyi.',
      en: 'Each student writes one concept mastered and one question needing clarification on a Padlet board before the bell rings.',
    },
  },
  {
    id: 'pancingan-data-phishing',
    termBM: 'Pancingan Data (Phishing)',
    termEN: 'Phishing',
    category: 'hardware',
    definition: {
      bm: 'Taktik penipuan dalam talian di mana penjenayah menyamar sebagai pihak berkuasa (seperti bank atau kementerian) untuk mencuri kata laluan atau data sulit.',
      en: 'A deceptive online scam where malicious actors impersonate official institutions (like banks or ministries) to trick users into revealing passwords.',
    },
    exampleInSchool: {
      bm: 'Menerima emel palsu kononnya dari "Pengurusan Sistem Gaji" yang meminta guru menekan pautan dan menaip kata laluan akaun sekolah.',
      en: 'Receiving a fake email claiming to be from "Payroll Support" urging the teacher to click a link and re-enter their school password.',
    },
  },
  {
    id: 'rph-digital-erph',
    termBM: 'e-RPH / RPH Digital',
    termEN: 'Digital Lesson Plan (e-RPH)',
    category: 'pedagogy',
    definition: {
      bm: 'Sistem penyediaan dan penghantaran Rancangan Pengajaran Harian secara digital menggunakan pemproses perkataan atau aplikasi dalam talian tanpa buku rekod tebal.',
      en: 'The digital drafting, archival, and administrative submission of daily lesson plans using word processors or cloud portals without paper binders.',
    },
    exampleInSchool: {
      bm: 'Guru memuat naik fail RPH mingguan terus ke Google Drive panitia setiap hari Jumaat untuk disemak oleh Penolong Kanan Pentadbiran.',
      en: 'Teachers submit weekly lesson plans to the subject Google Drive folder every Friday for administrative supervisory endorsement.',
    },
  },
];
