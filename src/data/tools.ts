import { DigitalTool } from '../types';

export const DIGITAL_TOOLS: DigitalTool[] = [
  {
    id: 'canva-edu',
    name: 'Canva for Education',
    category: 'design',
    difficulty: 'beginner',
    pricing: 'free-for-teachers',
    officialUrl: 'https://www.canva.com/education/',
    description: {
      bm: 'Platform reka bentuk grafik yang intuitif dengan ribuan templat pendidikan sedia guna percuma untuk semua guru berdaftar.',
      en: 'Intuitive graphic design suite offering thousands of verified educational templates free for certified teachers.',
    },
    bestFor: {
      bm: 'Poster bilik darjah, lembaran kerja A4, infografik topik, dan sijil penghargaan murid.',
      en: 'Classroom posters, printable A4 worksheets, topic infographics, and student certificates.',
    },
    teacherTip: {
      bm: 'Gunakan emel DELIMa atau MOE untuk membuka status Pro Edu secara percuma tanpa had.',
      en: 'Register with your official ministry/school email to unlock full Pro Edu features at no cost.',
    },
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    category: 'lms',
    difficulty: 'beginner',
    pricing: 'free',
    officialUrl: 'https://classroom.google.com',
    description: {
      bm: 'Pusat sehenti pengurusan pengajaran dan pembelajaran digital, pengagihan kerja sekolah, dan penggredan tanpa kertas.',
      en: 'All-in-one digital learning management hub for distributing homework, tracking submissions, and paperless grading.',
    },
    bestFor: {
      bm: 'Mengagihkan salinan lembaran kerja secara individu, mengutip tugasan, dan pengumuman kelas.',
      en: 'Provisioning individual worksheet copies, collecting student work, and posting announcements.',
    },
    teacherTip: {
      bm: 'Sentiasa susun tugasan mengikut "Topics" (Topik) berasaskan Minggu atau Bab agar murid mudah mencari.',
      en: 'Always organize coursework using "Topics" by Week or Chapter so students navigate easily.',
    },
  },
  {
    id: 'quizizz',
    name: 'Quizizz',
    category: 'quiz',
    difficulty: 'beginner',
    pricing: 'freemium',
    officialUrl: 'https://quizizz.com',
    description: {
      bm: 'Platform kuiz gamifikasi murid yang memaparkan soalan pada peranti sendiri dengan muzik yang menghiburkan dan analitik serta-merta.',
      en: 'Gamified quiz platform displaying questions directly on student screens with music and instant diagnostics.',
    },
    bestFor: {
      bm: 'Pentaksiran formatif hujung kelas, ulangkaji santai di rumah, dan kuiz langsung bilik darjah.',
      en: 'End-of-lesson formative checks, engaging home reviews, and synchronous class competitions.',
    },
    teacherTip: {
      bm: 'Jika bilik darjah tiada internet untuk setiap murid, cetak kad kod QR "Quizizz Paper Mode" untuk diimbas.',
      en: 'If students lack personal devices, print laminated "Quizizz Paper Mode" QR cards to scan with your phone.',
    },
  },
  {
    id: 'wordwall',
    name: 'Wordwall',
    category: 'quiz',
    difficulty: 'beginner',
    pricing: 'freemium',
    officialUrl: 'https://wordwall.net',
    description: {
      bm: 'Pembina permainan pendidikan pantas yang membolehkan satu set soalan ditukar kepada pelbagai format permainan dalam 1 saat.',
      en: 'Dynamic educational mini-game builder converting one dataset into multiple interactive games in 1 click.',
    },
    bestFor: {
      bm: 'Roda Putaran (Spin the Wheel) untuk set induksi dan permainan padanan kad di papan pintar (Smartboard).',
      en: 'Spin Wheels for hook set inductions and interactive matching games on classroom smartboards.',
    },
    teacherTip: {
      bm: 'Tukar templat kepada "Printable" untuk mendapatkan lembaran kerja kertas secara automatik.',
      en: 'Switch templates to "Printable" to automatically generate crisp physical paper handouts.',
    },
  },
  {
    id: 'padlet',
    name: 'Padlet',
    category: 'engagement',
    difficulty: 'beginner',
    pricing: 'freemium',
    officialUrl: 'https://padlet.com',
    description: {
      bm: 'Dinding maya kolaboratif di mana murid dan guru boleh menyematkan nota, idea teks, gambar, video, dan pautan secara masa nyata.',
      en: 'Collaborative digital bulletin board where students and teachers pin notes, photos, voice memos, and links in real time.',
    },
    bestFor: {
      bm: 'Tiket keluar kelas (Exit Tickets), sesi sumbang saran (brainstorming), dan pameran galeri hasil kerja murid.',
      en: 'Lesson Exit Tickets, collective brainstorming, and student project showcases.',
    },
    teacherTip: {
      bm: 'Aktifkan tetapan "Require Approval" dalam Content Settings untuk menyemak mesej murid sebelum dipaparkan.',
      en: 'Enable "Require Approval" in settings to screen and approve pupil submissions before public projection.',
    },
  },
  {
    id: 'mentimeter',
    name: 'Mentimeter',
    category: 'presentation',
    difficulty: 'intermediate',
    pricing: 'freemium',
    officialUrl: 'https://www.mentimeter.com',
    description: {
      bm: 'Alat persembahan interaktif dengan undian langsung, kuiz masa nyata, dan visualisasi awan perkataan (Word Cloud) yang hidup.',
      en: 'Interactive presentation tool featuring real-time audience polling, live quizzes, and animated word clouds.',
    },
    bestFor: {
      bm: 'Mengumpul pendapat seluruh kelas tanpa rasa malu, semakan emosi murid, dan membina perbincangan interaktif.',
      en: 'Inclusive whole-class polling, social-emotional check-ins, and stimulating discussion openers.',
    },
    teacherTip: {
      bm: 'Murid menyertai dengan mudah melalui menti.com dan memasukkan kod PIN tanpa perlu muat turun aplikasi.',
      en: 'Students participate seamlessly via menti.com by entering the PIN with zero logins needed.',
    },
  },
  {
    id: 'phet-interactive-simulations',
    name: 'PhET Interactive Simulations',
    category: 'math-science',
    difficulty: 'beginner',
    pricing: 'free',
    officialUrl: 'https://phet.colorado.edu',
    description: {
      bm: 'Simulasi sains dan matematik percuma bertaraf penyelidikan dari University of Colorado Boulder untuk pembelajaran berasaskan inkuiri.',
      en: 'Research-grounded free interactive science and math simulations from UC Boulder for inquiry learning.',
    },
    bestFor: {
      bm: 'Eksperimen maya litar elektrik, graviti, fotosintesis, dan pembiasan cahaya tanpa risiko kerosakan radas.',
      en: 'Virtual lab experiments in circuits, gravity, states of matter, and light without lab breakage risks.',
    },
    teacherTip: {
      bm: 'Boleh dimuat turun untuk dimainkan secara luar talian (offline) sekiranya makmal sekolah tiada internet.',
      en: 'Download simulation packages to run smoothly offline if your school computer lab lacks connectivity.',
    },
  },
  {
    id: 'geogebra',
    name: 'GeoGebra',
    category: 'math-science',
    difficulty: 'intermediate',
    pricing: 'free',
    officialUrl: 'https://www.geogebra.org',
    description: {
      bm: 'Perisian matematik dinamik yang menggabungkan geometri, algebra, spreadsheet, graf, statistik dan kalkulus dalam satu pakej mesra.',
      en: 'Dynamic mathematics platform unifying geometry, algebra, graphing, spreadsheets, and calculus.',
    },
    bestFor: {
      bm: 'Visualisasi graf fungsi kuadratik, sudut bulatan geometri, dan penerokaan bentuk 3D interaktif.',
      en: 'Visualizing quadratic functions, geometric circle theorems, and interactive 3D spatial models.',
    },
    teacherTip: {
      bm: 'Gunakan GeoGebra Classroom untuk memantau lakaran murid secara langsung pada satu papan pemuka guru.',
      en: 'Deploy GeoGebra Classroom to view live student geometric constructions on a single teacher dashboard.',
    },
  },
];
