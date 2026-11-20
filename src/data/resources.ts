import { TeachingResource } from '../types';

export const TEACHING_RESOURCES: TeachingResource[] = [
  {
    id: 'rubrik-pembentangan-murid',
    category: 'assessment',
    format: 'DOCX',
    title: {
      bm: 'Rubrik Penilaian Pembentangan Kumpulan Murid (PAK-21)',
      en: 'Student Group Presentation Rubric (21st Century Skills)',
    },
    description: {
      bm: 'Rubrik telus 4 aras kriteria: Kerjasama Kumpulan, Kejelasan Penyampaian, Kreativiti Bahan Visual, dan Kemampuan Menjawab Soalan Rakan.',
      en: 'Transparent 4-tier rubric assessing: Teamwork Collaboration, Delivery Clarity, Visual Creativity, and Peer Question Resiliency.',
    },
    gradeLevel: {
      bm: 'Sekolah Rendah & Menengah',
      en: 'Primary & Secondary Schools',
    },
    subject: {
      bm: 'Aktiviti Pembentangan & Projek (PBL)',
      en: 'Presentations & Project-Based Learning (PBL)',
    },
    downloadCount: 2950,
    tags: ['Rubrik', 'PBL', 'PAK-21', 'Pembentangan'],
    sampleStructure: [
      { bm: '1. Kriteria 1: Kandungan & Ketepatan Fakta (Skala 1 - 4)', en: '1. Criterion 1: Content & Factual Accuracy (Scale 1 - 4)' },
      { bm: '2. Kriteria 2: Keterlibatan Semua Ahli Kumpulan', en: '2. Criterion 2: Equal Group Participation' },
      { bm: '3. Kriteria 3: Daya Tarik Alat Bantuan Visual', en: '3. Criterion 3: Visual Aid Impact' },
      { bm: '4. Kriteria 4: Sesi Soal Jawab & Kematangan Hujah', en: '4. Criterion 4: Q&A Engagement & Critical Thinking' },
    ],
  },
  {
    id: 'worksheet-science-inquiry',
    category: 'worksheet',
    format: 'PDF',
    title: {
      bm: 'Lembaran Kerja Inkuiri Sains Berasaskan Eksperimen',
      en: 'Science Inquiry Worksheet with Scientific Method Framework',
    },
    description: {
      bm: 'Templat lembaran kerja murid mesra cetak: pernyataan masalah, hipotesis, pemboleh ubah, jadual pemerhatian, dan ruangan kesimpulan.',
      en: 'Print-ready student investigation template: problem statement, hypothesis, variables, observation matrix, and evidence-based conclusion.',
    },
    gradeLevel: {
      bm: 'Tahun 4 - Tingkatan 3',
      en: 'Grade 4 - Grade 9',
    },
    subject: {
      bm: 'Sains & Sains Tulen',
      en: 'Science & Pure Sciences',
    },
    downloadCount: 3120,
    tags: ['Lembaran Kerja', 'Sains', 'Inkuiri', 'Eksperimen'],
    sampleStructure: [
      { bm: '1. Ruang Nama, Kelas, Tarikh & Kumpulan', en: '1. Header: Student, Class, Date & Group' },
      { bm: '2. Pernyataan Masalah & Kotak Menulis Hipotesis', en: '2. Problem Statement & Hypothesis Writing Prompt' },
      { bm: '3. Rajah Susunan Alat Radas Berlabel', en: '3. Labeled Apparatus & Materials Diagram' },
      { bm: '4. Jadual Perekodan Data Eksperimen Berskala', en: '4. Observation Data Recording Table' },
      { bm: '5. Soalan Analisis Kritis & Rumusan Akhir', en: '5. Critical Thinking Analysis & Final Takeaway' },
    ],
  },
  {
    id: 'worksheet-ithink-organizer',
    category: 'worksheet',
    format: 'PDF',
    title: {
      bm: 'Pek Lembaran Peta Pemikiran i-Think (8 Peta Visual)',
      en: 'i-Think Visual Thinking Maps Pack (8 Core Templates)',
    },
    description: {
      bm: 'Koleksi peta pemikiran visual standard: Peta Bulatan, Buih, Buih Berganda, Pokok, Dakap, Alir, Pelbagai Alir, dan Titi untuk pembelajaran visual.',
      en: 'Curated visual thinking maps collection: Circle, Bubble, Double Bubble, Tree, Brace, Flow, Multi-Flow, and Bridge maps for active learning.',
    },
    gradeLevel: {
      bm: 'Tahun 1 hingga Tingkatan 5',
      en: 'Year 1 to Form 5',
    },
    subject: {
      bm: 'Semua Subjek (Merentas Kurikulum)',
      en: 'All Subjects (Cross-Curricular)',
    },
    downloadCount: 4210,
    tags: ['i-Think', 'Peta Pemikiran', 'Visual', 'PAK-21'],
    sampleStructure: [
      { bm: '1. Peta Bulatan: Sumbang Saran & Menerangkan Konteks', en: '1. Circle Map: Brainstorming & Contextualizing' },
      { bm: '2. Peta Buih: Menyenaraikan Sifat & Kata Adjektif', en: '2. Bubble Map: Describing with Adjectives' },
      { bm: '3. Peta Pokok: Klasifikasi & Pengelasan Kategori', en: '3. Tree Map: Classifying & Grouping' },
      { bm: '4. Peta Alir: Urutan Kronologi & Langkah Proses', en: '4. Flow Map: Sequencing & Process Steps' },
    ],
  },
  {
    id: 'presentation-minimal-deck',
    category: 'presentation',
    format: 'PPTX',
    title: {
      bm: 'Templat Slaid Pengajaran Minimalis & Kontras Tinggi',
      en: 'Minimalist High-Contrast Classroom Slide Deck (16:9)',
    },
    description: {
      bm: '20 reka letak slaid bersih direka mengikut prinsip kognitif: slaid tajuk bertenaga, perbandingan 2-lajur, susun atur gambar tunggal, dan slaid kuiz interaktif.',
      en: '20 clean slide layouts engineered for cognitive clarity: bold title hook, 2-column comparison, single-focus imagery, and interactive formative check-in slides.',
    },
    gradeLevel: {
      bm: 'Semua Tahap',
      en: 'All Grade Levels',
    },
    subject: {
      bm: 'Universal',
      en: 'Universal',
    },
    downloadCount: 5120,
    tags: ['PowerPoint', 'Canva', 'Slaid Bersih', '16:9'],
    sampleStructure: [
      { bm: '1. Slaid 1: Tajuk Pembelajaran & Gambar Cetusan Minat', en: '1. Slide 1: Bold Topic Hook & Emotion-stirring Graphic' },
      { bm: '2. Slaid 2: Objektif Pembelajaran & Kriteria Kejayaan', en: '2. Slide 2: Clear Learning Intentions & Success Criteria' },
      { bm: '3. Slaid 3-10: Pembangunan Konsep (Maksimum 25 perkataan seslaid)', en: '3. Slides 3-10: Concept Progression (Max 25 words per slide)' },
      { bm: '4. Slaid 11: Aktiviti Murid (Think-Pair-Share)', en: '4. Slide 11: Student Collaborative Activity' },
      { bm: '5. Slaid 12: Kuiz Refleksi Semakan Pantas', en: '5. Slide 12: Quick Formative Exit Ticket' },
    ],
  },
  {
    id: 'rubrik-projek-kumpulan-stem',
    category: 'assessment',
    format: 'DOCX',
    title: {
      bm: 'Rubrik Penilaian Pembelajaran Berasaskan Projek (PBL / STEM)',
      en: 'Project-Based Learning (PBL / STEM) Assessment Rubric',
    },
    description: {
      bm: 'Rubrik pemarkahan holistik mencakupi fasa penerokaan idea, pembinaan prototaip, ujian keberkesanan produk, dan pembentangan impak.',
      en: 'Holistic grading rubric covering idea exploration, prototype fabrication, product testing verification, and impact presentation.',
    },
    gradeLevel: {
      bm: 'Tahap 2 & Menengah',
      en: 'Upper Primary & Secondary',
    },
    subject: {
      bm: 'RBT, Sains, Matematik, Rekacipta',
      en: 'D&T, Science, Math, Innovation',
    },
    downloadCount: 2140,
    tags: ['STEM', 'PBL', 'Rubrik', 'Projek'],
    sampleStructure: [
      { bm: '1. Fasa 1: Pengenalpastian Masalah & Pelan Projek (20%)', en: '1. Phase 1: Problem Definition & Workplan (20%)' },
      { bm: '2. Fasa 2: Prototaip & Kreativiti Rekaan (30%)', en: '2. Phase 2: Prototyping & Design Ingenuity (30%)' },
      { bm: '3. Fasa 3: Kebolehfungsian & Ujian Eksperimen (25%)', en: '3. Phase 3: Functionality & Testing (25%)' },
      { bm: '4. Fasa 4: Refleksi & Pembentangan Akhir (25%)', en: '4. Phase 4: Reflection & Final Pitch (25%)' },
    ],
  },
];
