import { Tutorial } from '../types';

export const TUTORIALS: Tutorial[] = [
  // -------------------------------------------------------------
  // CATEGORY 1: GETTING STARTED (MULA LANGKAH)
  // -------------------------------------------------------------
  {
    id: 'basic-computer-skills',
    slug: 'basic-computer-skills',
    category: 'getting-started',
    level: 'beginner',
    estimatedMinutes: 12,
    iconName: 'Monitor',
    toolBadge: 'Asas Peranti',
    title: {
      bm: 'Asas Komputer: Penggunaan Tetikus, Papan Kekunci & Pintasan Penting',
      en: 'Computer Basics: Mouse, Keyboard & Essential Teacher Shortcuts',
    },
    description: {
      bm: 'Bina keyakinan mengendalikan komputer sekolah, memahami butang fungsi, klik kanan, dan pintasan kekunci jimat masa.',
      en: 'Build confidence navigating school computers, understanding function keys, right-click actions, and time-saving shortcuts.',
    },
    understand: {
      concept: {
        bm: 'Komputer hanyalah alat bantu. Menguasai asas pergerakan kursor dan pintasan papan kekunci asas menghapuskan rasa cemas dan menjimatkan sehingga 40% masa persediaan bahan.',
        en: 'The computer is simply a classroom assistant. Mastering cursor movements and core shortcuts removes digital anxiety and saves up to 40% of material preparation time.',
      },
      whyItMatters: {
        bm: 'Ramai guru merasa letih kerana terpaksa mengklik berulang kali untuk tugas mudah. Dengan pintasan papan kekunci seperti Salin (Ctrl+C) dan Tampal (Ctrl+V), kerja menaip soalan dan laporan menjadi jauh lebih pantas.',
        en: 'Many teachers feel fatigued by repetitive mouse clicks. Keyboard shortcuts like Copy (Ctrl+C) and Paste (Ctrl+V) make drafting exam questions and student reports significantly faster.',
      },
      keyTakeaways: [
        {
          bm: 'Perbezaan klik kiri (pilih), klik dua kali (buka), dan klik kanan (menu pilihan pintas).',
          en: 'Difference between left-click (select), double-click (open), and right-click (context menu).',
        },
        {
          bm: 'Pintasan emas guru: Ctrl+C (Salin), Ctrl+V (Tampal), Ctrl+Z (Buat Semula / Undo) dan Ctrl+S (Simpan).',
          en: 'Essential shortcuts: Ctrl+C (Copy), Ctrl+V (Paste), Ctrl+Z (Undo), and Ctrl+S (Save).',
        },
        {
          bm: 'Cara membesarkan paparan teks skrin (Ctrl + Skrol Roda Tetikus) agar mata tidak letih.',
          en: 'How to zoom screen text (Ctrl + Mouse Scroll Wheel) to prevent eye strain.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Panduan Asas Perkakasan Komputer & Pintasan Emas Guru',
        en: 'Hardware Basics & Essential Teacher Shortcuts Walkthrough',
      },
      duration: '06:45',
      chapters: [
        { time: '00:00', label: { bm: 'Pengenalan & Anatomi Tetikus', en: 'Introduction & Mouse Anatomy' } },
        { time: '01:30', label: { bm: 'Kuasa Klik Kanan pada Fail', en: 'The Power of Right-Click' } },
        { time: '03:15', label: { bm: '4 Pintasan Papan Kekunci Utama', en: '4 Core Keyboard Shortcuts' } },
        { time: '05:20', label: { bm: 'Menyelamatkan Kerja Anda (Ctrl+S)', en: 'Always Save Your Work (Ctrl+S)' } },
      ],
      keyHighlights: [
        {
          bm: 'Jangan panik jika tersalah padam teks—tekan Ctrl+Z serta-merta untuk mengembalikannya.',
          en: 'Do not panic if you accidentally delete text—press Ctrl+Z immediately to undo.',
        },
        {
          bm: 'Simpan fail secara berkala setiap 5 minit menggunakan Ctrl+S.',
          en: 'Save your document every 5 minutes using Ctrl+S.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mengenal Pasti Butang Tetikus & Fungsinya',
          en: 'Identify Mouse Buttons & Their Roles',
        },
        guidedText: {
          bm: 'Pegang tetikus secara santai. Jari telunjuk diletakkan di butang kiri untuk memilih fail atau meletakkan kursor teks. Jari hantu diletakkan di butang kanan untuk membuka pilihan menu bantuan.',
          en: 'Hold your mouse comfortably. Place your index finger on the left button to select files or place text cursors. Place your middle finger on the right button to bring up helper context menus.',
        },
        selfText: {
          bm: 'Gunakan klik kiri untuk memilih/buka dokumen; gunakan klik kanan untuk melihat pilihan salin, namakan semula atau padam.',
          en: 'Use left-click to select/open items; use right-click to view options like copy, rename, or delete.',
        },
        tip: {
          bm: 'Jika anda tersilap klik, tekan butang "Esc" di penjuru kiri atas papan kekunci untuk membatalkannya.',
          en: 'If you click the wrong item, hit the "Esc" key on the top-left of your keyboard to dismiss.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Menguasai Formula Salin & Tampal (Ctrl+C & Ctrl+V)',
          en: 'Mastering Copy and Paste (Ctrl+C & Ctrl+V)',
        },
        guidedText: {
          bm: 'Sorot (highlight) teks yang anda mahukan dengan menekan klik kiri dan seret tetikus. Kemudian tekan butang Ctrl serentak dengan huruf C. Pindahkan kursor ke tempat baharu dan tekan Ctrl bersama V.',
          en: 'Highlight the text you want by holding down left-click and dragging. Next, press Ctrl and C simultaneously. Move your cursor to the desired destination and press Ctrl and V.',
        },
        selfText: {
          bm: 'Sorot teks > Ctrl+C untuk salin > Klik lokasi sasaran > Ctrl+V untuk tampal.',
          en: 'Highlight text > Ctrl+C to copy > Click target location > Ctrl+V to paste.',
        },
        tip: {
          bm: 'Huruf C bermaksud "Copy" (Salin), manakala V terletak bersebelahan C untuk capaian pantas.',
          en: 'Letter C stands for Copy, while V sits directly beside C on your keyboard for quick reach.',
        },
      },
      {
        stepNumber: 3,
        title: {
          bm: 'Penyelamat Keadaan: Butang Buat Semula (Ctrl+Z)',
          en: 'The Lifesaver: Undo Action (Ctrl+Z)',
        },
        guidedText: {
          bm: 'Sekiranya perenggan soalan peperiksaan anda terpadam tanpa sengaja, jangan tutup program! Tekan Ctrl+Z sekali atau dua kali sehingga teks anda muncul semula.',
          en: 'If an exam paragraph accidentally disappears, do not close the software! Press Ctrl+Z once or twice until your text reappears safely.',
        },
        selfText: {
          bm: 'Tekan Ctrl+Z untuk membatalkan kesilapan terakhir serta-merta.',
          en: 'Press Ctrl+Z to immediately undo the most recent mistake.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'shortcut-lab',
      taskTitle: {
        bm: 'Uji Pengetahuan Pintasan & Kawalan Tetikus',
        en: 'Test Shortcuts & Mouse Control Awareness',
      },
      taskGoal: {
        bm: 'Pilih senario tugasan guru dan lihat formula pintasan yang paling tepat untuk menyelesaikannya.',
        en: 'Select a teacher classroom task and view the exact matching shortcut formula.',
      },
      guidelines: [
        {
          bm: 'Cuba kenal pasti kombinasi Ctrl+C, Ctrl+V, dan Ctrl+Z.',
          en: 'Practice recalling Ctrl+C, Ctrl+V, and Ctrl+Z combinations.',
        },
        {
          bm: 'Fahami situasi di mana klik kanan lebih menjimatkan masa.',
          en: 'Recognize situations where right-clicking saves precious steps.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah tindakan paling pantas sekiranya anda terpadam soalan RPH secara tidak sengaja?',
          en: 'What is the fastest action if you accidentally delete an RPH question in your document?',
        },
        options: [
          { bm: 'Tutup komputer dan buka semula', en: 'Shut down the computer and restart' },
          { bm: 'Tekan kekunci Ctrl + Z (Undo)', en: 'Press the Ctrl + Z keys (Undo)' },
          { bm: 'Taip semula dari awal', en: 'Retype everything from scratch' },
          { bm: 'Format cakera keras', en: 'Format the hard drive' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Kekunci Ctrl+Z (Undo) akan membatalkan tindakan terakhir dan mengembalikan apa yang terpadam serta-merta.',
          en: 'Ctrl+Z (Undo) reverses your last action and restores missing content instantly.',
        },
      },
      {
        question: {
          bm: 'Apakah fungsi butang klik kanan pada tetikus?',
          en: 'What is the primary function of the right-click mouse button?',
        },
        options: [
          { bm: 'Mematikan skrin komputer', en: 'Turn off the computer screen' },
          { bm: 'Membuka menu pilihan pintas (seperti Salin, Namakan Semula, Sifat)', en: 'Open the context menu (such as Copy, Rename, Properties)' },
          { bm: 'Hanya digunakan untuk bermain permainan video', en: 'Only used for video games' },
          { bm: 'Memadam semua fail dalam komputer', en: 'Delete all files in the system' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Klik kanan membuka menu kontekstual yang menyediakan pelbagai tindakan relevan untuk objek yang dipilih.',
          en: 'Right-click opens a contextual popup menu with helpful actions for the selected item.',
        },
      },
    ],
  },

  {
    id: 'file-folder-management',
    slug: 'file-folder-management',
    category: 'getting-started',
    level: 'beginner',
    estimatedMinutes: 15,
    iconName: 'FolderKanban',
    toolBadge: 'Pengurusan Fail',
    title: {
      bm: 'Pengurusan Fail & Folder yang Kemas untuk Guru Sekolah',
      en: 'Tidy File & Folder Management for School Teachers',
    },
    description: {
      bm: 'Cipta struktur folder teratur (Tahun, Subjek, RPH, Peperiksaan) agar anda tidak lagi kehilangan dokumen penting.',
      en: 'Establish a structured folder hierarchy (Year, Subject, Lesson Plans, Exams) so you never misplace vital documents.',
    },
    understand: {
      concept: {
        bm: 'Komputer berfungsi seperti almari fail bilik guru. Tanpa pembahagi folder yang jelas, ribuan dokumen akan bertaburan di atas meja (Desktop), menyebabkan masa mencari melebihi masa mengajar.',
        en: 'A computer functions like a teacher filing cabinet. Without clearly labeled folders, thousands of documents scatter across your Desktop, wasting precious minutes searching.',
      },
      whyItMatters: {
        bm: 'Guru yang menyusun fail mengikut standard [Tahun_Subjek_Topik] boleh mencari kertas ujian atau bahan tahun lepas dalam masa 5 saat sahaja sewaktu pencerapan atau audit.',
        en: 'Teachers who standardize naming [Year_Subject_Topic] locate past exam papers and lesson plans in 5 seconds during inspections or audits.',
      },
      keyTakeaways: [
        {
          bm: 'Struktur hierarki: Folder Induk (cth: Sains 2026) > Sub-Folder (RPH, Ujian, Lembaran Kerja).',
          en: 'Hierarchy structure: Root Folder (e.g., Science 2026) > Sub-Folders (Lesson Plans, Tests, Worksheets).',
        },
        {
          bm: 'Konvensyen nama fail yang seragam: YYYY-MM-DD_Subjek_Topik_Versi.',
          en: 'Consistent file naming formula: YYYY-MM-DD_Subject_Topic_Version.',
        },
        {
          bm: 'Jangan simpan semua fail di "Desktop"—gunakan folder "Dokumen" atau storan awan.',
          en: 'Avoid cluttering your Desktop—store materials in Documents or dedicated folders.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Demonstrasi Menyusun Fail RPH & Kertas Peperiksaan Sekolah',
        en: 'Step-by-step School File Organization Demonstration',
      },
      duration: '08:10',
      chapters: [
        { time: '00:00', label: { bm: 'Masalah Fail Berselerak di Desktop', en: 'The Desktop Clutter Problem' } },
        { time: '02:00', label: { bm: 'Membina Struktur 3 Peringkat', en: 'Building a 3-Tier Folder Structure' } },
        { time: '04:30', label: { bm: 'Formula Menamakan Fail Sekolah', en: 'School File Naming Formula' } },
        { time: '06:50', label: { bm: 'Memindahkan Fail dengan Seret & Lepas', en: 'Moving Files via Drag & Drop' } },
      ],
      keyHighlights: [
        {
          bm: 'Elakkan nama fail seperti "RPH_Final_Betul_Ini_Last.docx"—gunakan nombor versi seperti v1.0, v2.0.',
          en: 'Avoid vague names like "Plan_Final_ReallyFinal.docx"—use clear version markers like v1.0, v2.0.',
        },
        {
          bm: 'Gunakan fungsi carian (Search) di penjuru kanan pelayar fail jika terlupa lokasi dokumen.',
          en: 'Use the top-right Search bar in File Explorer if you ever forget where a document was stored.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Cipta Folder Induk Baharu',
          en: 'Create a New Master Folder',
        },
        guidedText: {
          bm: 'Buka File Explorer (ikon folder kuning di bawah skrin). Klik pada folder "Documents". Klik kanan di ruang kosong, arahkan kursor ke "New", dan klik "Folder". Taip nama tahun dan tugas, contohnya: "2026_Pengajaran_Cikgu_Ahmad".',
          en: 'Open File Explorer (yellow folder icon on taskbar). Click into "Documents". Right-click on empty space, hover over "New", and click "Folder". Name it clearly, e.g., "2026_Teaching_Materials".',
        },
        selfText: {
          bm: 'Buka Documents > Klik kanan > New > Folder > Namakan: [Tahun]_[Tugasan Guru].',
          en: 'Open Documents > Right-click > New > Folder > Name: [Year]_[Teaching_Materials].',
        },
        tip: {
          bm: 'Pintasan pantas mencipta folder baharu dalam Windows ialah Ctrl + Shift + N.',
          en: 'The quick Windows shortcut to create a new folder is Ctrl + Shift + N.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Bina Sub-Folder Berstruktur',
          en: 'Create Structured Sub-Folders',
        },
        guidedText: {
          bm: 'Klik dua kali untuk masuk ke dalam folder induk. Cipta 4 sub-folder: "01_RPH", "02_Bahan_Slaid", "03_Lembaran_Kerja", dan "04_Pentaksiran_PBD". Nombor di hadapan memastikan folder tersusun kemas.',
          en: 'Double-click to enter your master folder. Create 4 sub-folders: "01_Lesson_Plans", "02_Slides", "03_Worksheets", and "04_Assessments". Number prefixes keep folders in orderly chronological order.',
        },
        selfText: {
          bm: 'Cipta sub-folder dengan imbuhan nombor (01_RPH, 02_Bahan, 03_Ujian) untuk susunan automatik.',
          en: 'Prefix sub-folders with numbers (01_Plans, 02_Materials, 03_Tests) for automatic neat sorting.',
        },
      },
      {
        stepNumber: 3,
        title: {
          bm: 'Memindahkan Dokumen dengan Selamat',
          en: 'Safely Moving Existing Documents',
        },
        guidedText: {
          bm: 'Klik sekali pada fail yang ingin dipindahkan. Tahan klik kiri, seret fail tersebut ke atas folder sasaran, dan lepaskan klik tetikus (Drag and Drop). Fail anda kini berada di dalam folder tersebut.',
          en: 'Click once on the file you want to organize. Hold down the left mouse button, drag the file directly onto the destination folder icon, and release (Drag and Drop).',
        },
        selfText: {
          bm: 'Klik dan seret fail ke folder sasaran, atau gunakan Ctrl+X (Potong) dan Ctrl+V (Tampal).',
          en: 'Drag and drop file into destination folder, or use Ctrl+X (Cut) and Ctrl+V (Paste).',
        },
      },
    ],
    tryIt: {
      sandboxType: 'folder-manager',
      taskTitle: {
        bm: 'Simulasi Pengurusan Fail Guru',
        en: 'Teacher File Organization Simulation',
      },
      taskGoal: {
        bm: 'Cipta folder baharu dan susun dokumen RPH serta lembaran kerja ke dalam kategori yang betul.',
        en: 'Create a new folder and organize lesson plans and worksheets into neat categories.',
      },
      guidelines: [
        {
          bm: 'Gunakan butang "Cipta Folder" di bawah.',
          en: 'Use the "Create Folder" button below.',
        },
        {
          bm: 'Perhatikan bagaimana nombor awalan membantu susunan berabjad.',
          en: 'Notice how number prefixes maintain logical sorting.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Mengapakah meletakkan nombor awalan seperti "01_RPH" dan "02_Ujian" sangat digalakkan?',
          en: 'Why is adding numeric prefixes like "01_Plans" and "02_Tests" recommended?',
        },
        options: [
          { bm: 'Supaya komputer berjalan lebih laju', en: 'To make the computer CPU run faster' },
          { bm: 'Untuk memastikan folder sentiasa tersusun mengikut urutan logik dan mudah dicari', en: 'To keep folders organized in a logical sequence and easy to locate' },
          { bm: 'Syarat wajib kementerian untuk semua guru', en: 'A mandatory legal requirement' },
          { bm: 'Mengelakkan komputer daripada dijangkiti virus', en: 'To protect the hard drive from viruses' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Komputer menyusun nama mengikut abjad secara lalai. Meletakkan nombor di hadapan memastikan folder penting berada di urutan atas.',
          en: 'Computers sort alphabetically by default. Prefixes ensure your most frequent folders stay pinned at the top.',
        },
      },
      {
        question: {
          bm: 'Format penamaan fail manakah yang paling kemas dan mudah dicari semula tahun depan?',
          en: 'Which file naming format is cleanest and easiest to find next year?',
        },
        options: [
          { bm: 'Document1_betul.docx', en: 'Document1_final.docx' },
          { bm: '2026_Sains_Ting2_RPH_Minggu03_v1.docx', en: '2026_Science_G8_Plan_Week03_v1.docx' },
          { bm: 'Kertas_Exam_terbaru_cikgu.docx', en: 'New_Exam_teacher.docx' },
          { bm: 'Tolong_Jangan_Padam.docx', en: 'Do_Not_Delete_Please.docx' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Format yang menyertakan Tahun, Subjek, Tingkatan/Tahun, Topik dan Versi membolehkan carian pantas tanpa perlu membuka fail.',
          en: 'Names specifying Year, Subject, Grade, Topic and Version enable instant identification without opening the file.',
        },
      },
    ],
  },

  {
    id: 'upload-download-files',
    slug: 'upload-download-files',
    category: 'getting-started',
    level: 'beginner',
    estimatedMinutes: 10,
    iconName: 'ArrowDownUp',
    toolBadge: 'Muat Naik & Turun',
    title: {
      bm: 'Muat Naik & Muat Turun Fail Tanpa Kekeliruan',
      en: 'Uploading & Downloading Files Without Confusion',
    },
    description: {
      bm: 'Fahami perbezaan muat naik ke portal sekolah vs muat turun bahan dari internet ke folder "Downloads".',
      en: 'Understand uploading to school portals vs downloading resources from the web into your Downloads folder.',
    },
    understand: {
      concept: {
        bm: 'Muat Turun (Download) bermaksud mengambil fail dari internet masuk ke komputer anda. Muat Naik (Upload) bermaksud menghantar fail dari komputer anda ke internet (seperti portal KPM, Google Drive, atau WhatsApp Web).',
        en: 'Downloading means fetching a file from the internet onto your computer. Uploading means sending a file from your computer up to an online platform (like school portals, Google Drive, or web email).',
      },
      whyItMatters: {
        bm: 'Banyak masa terbuang apabila guru memuat turun bahan DSKP atau surat pekeliling tetapi tidak dapat mencarinya semula, atau tersalah memilih fail ketika memuat naik markah peperiksaan.',
        en: 'Much time is lost when teachers download syllabus documents but cannot relocate them, or select the wrong file when uploading student marks.',
      },
      keyTakeaways: [
        {
          bm: 'Folder "Downloads" (Muat Turun) ialah hentian pertama semua fail yang diambil dari internet.',
          en: 'The "Downloads" folder is the default landing zone for every web file fetched.',
        },
        {
          bm: 'Sentiasa pindahkan fail penting dari folder "Downloads" ke folder subjek anda.',
          en: 'Always relocate important files out of "Downloads" into your organized subject folders.',
        },
        {
          bm: 'Bila butang "Browse / Pilih Fail" muncul, semak nama fail sebelum menekan "Open/Submit".',
          en: 'When a "Browse/Choose File" button appears, confirm the file name before clicking Open/Submit.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Cara Mengendalikan Muat Turun Surat & Muat Naik Borang Sekolah',
        en: 'Handling School Downloads & Uploading Forms Walkthrough',
      },
      duration: '05:30',
      chapters: [
        { time: '00:00', label: { bm: 'Konsep Arah Aliran: Naik vs Turun', en: 'Directional Concept: Up vs Down' } },
        { time: '01:45', label: { bm: 'Mencari Fail Dalam Folder Downloads', en: 'Finding Files in Downloads' } },
        { time: '03:10', label: { bm: 'Langkah Muat Naik Borang Portal Rasmi', en: 'Official Portal Upload Steps' } },
      ],
      keyHighlights: [
        {
          bm: 'Gunakan susunan "Date modified" (Tarikh diubah suai) untuk melihat fail paling baru dimuat turun di bahagian atas.',
          en: 'Sort by "Date modified" to immediately see your newest download right at the top.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mencari Fail yang Baru Dimuat Turun',
          en: 'Locate Your Newly Downloaded File',
        },
        guidedText: {
          bm: 'Selepas menekan butang Muat Turun di laman sesawang, buka File Explorer dan klik folder "Downloads" di sebelah kiri. Klik pada lajur "Date modified" supaya tanda anak panah menunjukkan ke bawah. Fail terkini akan berada di baris pertama.',
          en: 'After clicking Download on a webpage, open File Explorer and click "Downloads" on the left panel. Click the "Date modified" column so the arrow points downwards. Your newest file appears at the very top.',
        },
        selfText: {
          bm: 'Buka File Explorer > Folder Downloads > Susun mengikut "Date modified" (Terkini).',
          en: 'Open File Explorer > Downloads > Sort by "Date modified" (Newest first).',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Langkah Memuat Naik Fail ke Portal Sekolah',
          en: 'Steps to Upload Files to School Portals',
        },
        guidedText: {
          bm: 'Di laman portal, cari butang bertulis "Upload", "Pilih Fail", atau ikon klip kertas. Tetingkap kecil akan muncul. Navigasi ke folder di mana fail anda disimpan, klik fail tersebut, dan klik butang "Open".',
          en: 'On the portal website, look for "Upload", "Choose File", or a paperclip icon. A file browser popup will appear. Navigate to your organized folder, select the document, and click "Open".',
        },
        selfText: {
          bm: 'Klik butang Upload > Pilih fail dalam tetingkap > Tekan Open / Hantar.',
          en: 'Click Upload button > Select file in dialog > Click Open / Submit.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'upload-checker',
      taskTitle: {
        bm: 'Semakan Aliran Muat Turun & Naik',
        en: 'Upload & Download Flow Checker',
      },
      taskGoal: {
        bm: 'Ketahui langkah demi langkah cara mengelakkan kekeliruan fail di sekolah.',
        en: 'Learn step-by-step how to prevent file mismatches in school submissions.',
      },
      guidelines: [
        {
          bm: 'Pastikan saiz fail tidak melebihi had yang dibenarkan portal.',
          en: 'Ensure file size does not exceed the platform maximum.',
        },
        {
          bm: 'Gunakan format PDF jika portal tidak membenarkan DOCX.',
          en: 'Use PDF format when word documents are not accepted.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Di manakah lokasi lalai (default) bagi dokumen yang baru anda muat turun dari internet?',
          en: 'Where is the default storage location for files freshly downloaded from the web?',
        },
        options: [
          { bm: 'Recycle Bin (Tong Kitar Semula)', en: 'Recycle Bin' },
          { bm: 'Folder Downloads (Muat Turun)', en: 'Downloads folder' },
          { bm: 'Pemacu Kilat USB automatik', en: 'Automatic USB flash drive' },
          { bm: 'Bilik Guru', en: 'The Staff Room' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Semua pelayar web menyimpan fail yang dimuat turun ke dalam folder "Downloads" melainkan anda menetapkan sebaliknya.',
          en: 'All web browsers save downloaded content into the user "Downloads" folder by default.',
        },
      },
    ],
  },

  {
    id: 'internet-browser-navigation',
    slug: 'internet-browser-navigation',
    category: 'getting-started',
    level: 'beginner',
    estimatedMinutes: 12,
    iconName: 'Compass',
    toolBadge: 'Pelayar Web',
    title: {
      bm: 'Melayari Internet & Penggunaan Tab Pelayar dengan Cekap',
      en: 'Internet Browsing & Efficient Browser Tab Management',
    },
    description: {
      bm: 'Kuasai Chrome atau Edge: membuka banyak tab, menyimpan penanda buku (Bookmarks) laman rasmi, dan keselamatan kata laluan.',
      en: 'Master Chrome or Edge: opening multiple tabs, bookmarking official portals, and password security.',
    },
    understand: {
      concept: {
        bm: 'Pelayar web (Google Chrome, Microsoft Edge) ialah pintu masuk guru ke semua portal pendidikan (DELIMa, APDM, SPLKPM). Memahami cara membuka tab baharu tanpa menutup laman sedia ada mengelakkan kerja anda terpadam.',
        en: 'Web browsers (Chrome, Edge) are your gateway to educational portals. Understanding tabs prevents accidental closure of ongoing lesson records.',
      },
      whyItMatters: {
        bm: 'Bila guru perlu membuka portal kehadiran murid serentak dengan RPH, menutup satu untuk membuka yang lain sangat membazirkan masa. Tab membolehkan anda bertukar portal dalam sesaat.',
        en: 'When teachers need student attendance open alongside lesson plans, closing one to view the other is frustrating. Tabs enable seamless instant switching.',
      },
      keyTakeaways: [
        {
          bm: 'Gunakan butang (+) di atas untuk membuka tab baharu.',
          en: 'Use the (+) button at top to spawn a fresh browser tab.',
        },
        {
          bm: 'Simpan laman rasmi (cth: DELIMa) di Bar Penanda Buku (Ctrl + D) agar tidak perlu menaip alamat setiap hari.',
          en: 'Bookmark official portals (Ctrl + D) so you never retype long web addresses.',
        },
        {
          bm: 'Jika tertutup tab penting secara tidak sengaja, tekan Ctrl + Shift + T untuk membukanya semula.',
          en: 'If you accidentally close a crucial tab, press Ctrl + Shift + T to resurrect it.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Panduan Praktikal Mengurus Tab & Bookmark untuk Guru Sekolah',
        en: 'Practical Tab & Bookmark Management for Teachers',
      },
      duration: '06:15',
      chapters: [
        { time: '00:00', label: { bm: 'Anatomi Bar Alamat & Butang Tab', en: 'Address Bar & Tab Anatomy' } },
        { time: '02:10', label: { bm: 'Cara Menanda Buku Laman Sekolah', en: 'Bookmarking School Portals' } },
        { time: '04:00', label: { bm: 'Helah Pintas Ctrl + Shift + T', en: 'The Ctrl + Shift + T Recovery Trick' } },
      ],
      keyHighlights: [
        {
          bm: 'Ctrl + Shift + T ialah penyelamat jika tab yang sedang anda isi tertutup tanpa sengaja.',
          en: 'Ctrl + Shift + T will immediately reopen your accidentally closed tabs.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Membuka Tab Baharu Tanpa Menutup Laman Asal',
          en: 'Opening New Tabs Without Losing Your Place',
        },
        guidedText: {
          bm: 'Di bahagian paling atas pelayar, klik butang tanda tambah (+) di sebelah tab sedia ada. Atau tekan pintasan papan kekunci Ctrl + T. Laman baharu akan sedia untuk carian tanpa mengganggu laman portal yang sedang terbuka.',
          en: 'At the top of your browser window, click the plus sign (+) next to your active tab. Or press Ctrl + T. A fresh tab opens ready for browsing without disrupting your active portal.',
        },
        selfText: {
          bm: 'Tekan butang (+) atau Ctrl + T untuk tab baharu.',
          en: 'Click (+) or press Ctrl + T for a new tab.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Menyimpan Laman Portal Kegemaran (Bookmark)',
          en: 'Bookmarking Important Portals (Bookmarks Bar)',
        },
        guidedText: {
          bm: 'Bila anda berada di laman portal DELIMa atau APDM, tekan ikon bintang di penjuru kanan bar alamat, atau tekan Ctrl + D. Pilih "Bookmarks bar" dan klik "Done". Ikon portal kini akan sentiasa kelihatan di bawah bar alamat untuk klik satu saat.',
          en: 'When on your school portal, click the star icon on the right edge of the address bar, or press Ctrl + D. Select "Bookmarks bar" and click "Done". The portal shortcut now permanently lives beneath your URL bar.',
        },
        selfText: {
          bm: 'Tekan Ctrl + D di mana-mana laman > Pilih Bookmarks Bar > Simpan.',
          en: 'Press Ctrl + D on any portal > Choose Bookmarks Bar > Save.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'browser-tabs',
      taskTitle: {
        bm: 'Uji Kemahiran Pelayaran Tab',
        en: 'Test Browser Navigation Skills',
      },
      taskGoal: {
        bm: 'Lihat bagaimana organisasi tab mempermudahkan hari persekolahan guru.',
        en: 'Observe how clean tab organization streamlines teacher workflows.',
      },
      guidelines: [
        {
          bm: 'Elakkan membuka lebih 20 tab serentak kerana ia boleh memperlahankan komputer sekolah.',
          en: 'Avoid keeping 20+ tabs open simultaneously as it consumes computer memory.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah kombinasi kekunci ajaib untuk membuka semula tab pelayar yang baru sahaja tertutup secara tidak sengaja?',
          en: 'What is the magic key combination to instantly resurrect an accidentally closed browser tab?',
        },
        options: [
          { bm: 'Ctrl + Alt + Delete', en: 'Ctrl + Alt + Delete' },
          { bm: 'Ctrl + Shift + T', en: 'Ctrl + Shift + T' },
          { bm: 'Ctrl + P', en: 'Ctrl + P' },
          { bm: 'Shift + F4', en: 'Shift + F4' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Ctrl + Shift + T memulihkan tab terakhir yang ditutup lengkap dengan sejarah halamannya.',
          en: 'Ctrl + Shift + T instantly reopens the most recently closed tab with full history intact.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // CATEGORY 2: DIGITAL TEACHING TOOLS (ALATAN PENGAJARAN DIGITAL)
  // -------------------------------------------------------------
  {
    id: 'powerpoint-effective-slides',
    slug: 'powerpoint-effective-slides',
    category: 'teaching-tools',
    level: 'intermediate',
    estimatedMinutes: 18,
    iconName: 'Presentation',
    toolBadge: 'PowerPoint',
    title: {
      bm: 'Microsoft PowerPoint: Slaid Pengajaran yang Menarik & Tidak Bersemak',
      en: 'Microsoft PowerPoint: Clean, High-Impact Educational Slides',
    },
    description: {
      bm: 'Tinggalkan slaid berteks padat. Pelajari prinsip 6x6, hierarki visual, kontras warna dan memasukkan grafik bermakna.',
      en: 'Move away from walls of text. Learn the 6x6 rule, visual hierarchy, color contrast, and embedding meaningful graphics.',
    },
    understand: {
      concept: {
        bm: 'Slaid PowerPoint dalam bilik darjah bukan buku teks digital untuk dibaca oleh guru. Slaid adalah peneman visual (visual anchor) untuk menarik tumpuan murid dan merangsang perbincangan.',
        en: 'Classroom presentation slides are not digital textbooks for the teacher to read aloud. They serve as visual anchors to command attention and spark active classroom dialogue.',
      },
      whyItMatters: {
        bm: 'Kajian kognitif menunjukkan murid akan berhenti mendengar jika slaid dipenuhi perenggan panjang kerana otak manusia tidak boleh membaca dan mendengar serentak secara efektif.',
        en: 'Cognitive research proves students stop listening when slides are overloaded with text because the human brain cannot read and listen at equal bandwidth simultaneously.',
      },
      keyTakeaways: [
        {
          bm: 'Peraturan 6x6: Maksimum 6 baris kata kunci setiap slaid, maksimum 6 perkataan sebaris.',
          en: 'The 6x6 guideline: Maximum 6 bullet lines per slide, maximum 6 words per line.',
        },
        {
          bm: 'Satu konsep utama bagi setiap satu slaid (One Idea Per Slide).',
          en: 'Dedicate one core idea to each slide to avoid cognitive overload.',
        },
        {
          bm: 'Gunakan saiz fon minimum 28pt supaya murid di barisan belakang kelas dapat membaca dengan jelas.',
          en: 'Use minimum 28pt font so students sitting in the back row can read comfortably.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Transformasi Slaid Sederhana Kepada Slaid Interaktif & Elegan',
        en: 'Transforming Cluttered Slides into Engaging Visual Lessons',
      },
      duration: '09:20',
      chapters: [
        { time: '00:00', label: { bm: 'Kelemahan Slaid Berteks Penuh', en: 'The Text-Overload Trap' } },
        { time: '02:30', label: { bm: 'Prinsip Hierarki Fon & Saiz Teks', en: 'Font Hierarchy & Size Principles' } },
        { time: '05:10', label: { bm: 'Memasukkan Imej Bersih Tanpa Latar Pecah', en: 'Adding Crisp Visuals' } },
        { time: '07:45', label: { bm: 'Mod Persembahan (Presenter View) Guru', en: 'Using Teacher Presenter View' } },
      ],
      keyHighlights: [
        {
          bm: 'Manfaatkan ciri "Designer" (Idea Reka Bentuk) dalam PowerPoint untuk susun atur automatik yang kemas.',
          en: 'Utilize the "Designer" feature in PowerPoint for automated clean layouts in seconds.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Memilih Templat Bersih & Kontras Tinggi',
          en: 'Choose a Clean, High-Contrast Template',
        },
        guidedText: {
          bm: 'Buka PowerPoint > Pilih templat latar belakang putih atau cerah dengan teks warna gelap (hitam atau biru gelap). Elakkan corak latar belakang berjalur atau berbayang yang mengaburkan teks.',
          en: 'Open PowerPoint > Select a crisp light background with dark readable typography (slate or navy). Avoid busy decorative patterns that impede legibility under classroom projectors.',
        },
        selfText: {
          bm: 'Pilih latar cerah dengan teks gelap; pastikan kontras tinggi untuk projektor.',
          en: 'Choose bright background with dark text; ensure high contrast for projectors.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Mengaplikasikan Prinsip 1 Slaid 1 Konsep',
          en: 'Apply One Idea Per Slide Rule',
        },
        guidedText: {
          bm: 'Alihkan teks panjang ke bahagian "Notes" (Nota Pembentang) di bawah slaid. Di atas slaid, letakkan hanya tajuk besar dan satu visual berkualiti tinggi yang menerangkan topik tersebut.',
          en: 'Move explanatory paragraph text into the "Presenter Notes" area below. On the slide itself, place only a strong headline and one illustrative visual that grounds the discussion.',
        },
        selfText: {
          bm: 'Simpan penjelasan panjang dalam nota guru; paparkan hanya tajuk dan gambar utama.',
          en: 'Keep spoken text in teacher notes; display only key title and hero visual.',
        },
        tip: {
          bm: 'Gunakan kekunci F5 untuk memulakan persembahan dari slaid pertama, atau Shift + F5 dari slaid semasa.',
          en: 'Press F5 to start from slide 1, or Shift + F5 to present from your active slide.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'layout-studio',
      taskTitle: {
        bm: 'Uji Reka Bentuk Slaid Berkesan',
        en: 'Slide Layout Best Practice Checker',
      },
      taskGoal: {
        bm: 'Ketahui cara mengubah ayat karangan panjang kepada poin ringkas yang memikat murid.',
        en: 'Learn how to distill lengthy paragraphs into captivating classroom talking points.',
      },
      guidelines: [
        {
          bm: 'Gunakan ikon atau gambar berkualiti dan elakkan warna teks merah menyala di atas biru.',
          en: 'Pair text with sharp icons and avoid clashing low-contrast color combinations.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah saiz fon minimum yang disyorkan untuk teks slaid pengajaran di bilik darjah sekolah?',
          en: 'What is the recommended minimum font size for body text on classroom presentation slides?',
        },
        options: [
          { bm: '12 pt', en: '12 pt' },
          { bm: '16 pt', en: '16 pt' },
          { bm: '28 pt ke atas', en: '28 pt and above' },
          { bm: '72 pt sahaja', en: '72 pt only' },
        ],
        correctAnswer: 2,
        explanation: {
          bm: 'Saiz 28 pt ke atas memastikan murid di penjuru belakang bilik darjah dapat membaca tanpa mengecilkan mata.',
          en: '28 pt and larger ensures learners sitting in the farthest corner of the classroom read comfortably without squinting.',
        },
      },
    ],
  },

  {
    id: 'canva-for-education',
    slug: 'canva-for-education',
    category: 'teaching-tools',
    level: 'intermediate',
    estimatedMinutes: 20,
    iconName: 'Palette',
    toolBadge: 'Canva Edu',
    title: {
      bm: 'Canva for Education: Mencipta Poster, Lembaran Kerja & Infografik Kelas',
      en: 'Canva for Education: Crafting Posters, Worksheets & Visual Aids',
    },
    description: {
      bm: 'Manfaatkan akaun guru percuma Canva: ribuan templat pendidikan sedia ada, penyesuaian teks, dan cetakan beresolusi tinggi.',
      en: 'Unlock free Canva for Education: thousands of vetted templates, customized typography, and high-res printable exports.',
    },
    understand: {
      concept: {
        bm: 'Canva for Education memberi guru akses percuma 100% kepada aset grafik premium dengan hanya menggunakan emel DELIMa (@moe-dl.edu.my). Anda tidak perlu menjadi pereka grafik profesional untuk menghasilkan bahan mengajar berkualiti tinggi.',
        en: 'Canva for Education grants verified teachers 100% free access to premium graphics using their educational email. You do not need graphic design training to produce stunning classroom materials.',
      },
      whyItMatters: {
        bm: 'Bahan pengajaran yang menarik secara visual meningkatkan minat membaca murid sebanyak 80%, terutamanya bagi murid visual dan murid pemulihan.',
        en: 'Visually rich learning aids increase student reading interest by 80%, particularly aiding visual learners and remedial students.',
      },
      keyTakeaways: [
        {
          bm: 'Log masuk dengan emel DELIMa untuk mendapatkan status Canva Edu Pro secara percuma.',
          en: 'Sign in with your educational ministry email to unlock free Canva Edu status.',
        },
        {
          bm: 'Gunakan fungsi carian templat seperti "Lembaran Kerja Sains Tahun 4" atau "Jadual Bertugas Kelas".',
          en: 'Search ready-made templates like "Primary Science Worksheet" or "Class Roster".',
        },
        {
          bm: 'Muat turun dalam format "PDF Print" untuk hasil cetakan fizikal yang paling tajam.',
          en: 'Export as "PDF Print" for the sharpest physical printing results.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Panduan Merekabentuk Lembaran Kerja & Carta Kelas Dalam 10 Minit',
        en: 'Designing Class Posters & Worksheets in 10 Minutes with Canva',
      },
      duration: '10:15',
      chapters: [
        { time: '00:00', label: { bm: 'Pengaktifan Akaun Canva Guru', en: 'Canva Teacher Account Activation' } },
        { time: '02:20', label: { bm: 'Memilih Templat Lembaran Kerja', en: 'Selecting Worksheet Templates' } },
        { time: '05:40', label: { bm: 'Mengubah Teks & Menambah Elemen', en: 'Editing Text & Adding Graphics' } },
        { time: '08:30', label: { bm: 'Muat Turun & Cetakan Beresolusi Tinggi', en: 'High-Res PDF Print Export' } },
      ],
      keyHighlights: [
        {
          bm: 'Gunakan butang "Position" (Kedudukan) untuk menjajarkan kotak soalan secara selari dan seimbang.',
          en: 'Use the "Position" tool to align question boxes neatly with equal spacing.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mencari Templat Pendidikan yang Tepat',
          en: 'Searching for Relevant Educational Templates',
        },
        guidedText: {
          bm: 'Di laman utama Canva, taip kata kunci dalam kotak carian atas, contohnya: "Worksheet Matematik" atau "Peraturan Bilik Darjah". Tapis mengikut saiz dokumen (A4). Pilih templat yang mempunyai struktur asas yang anda sukai.',
          en: 'On the Canva homepage, enter keywords in the search bar such as "Math Worksheet" or "Classroom Rules". Filter by A4 document size. Choose a template with a clean starting structure.',
        },
        selfText: {
          bm: 'Cari kata kunci "Lembaran Kerja A4" > Pilih templat yang bersesuaian.',
          en: 'Search "A4 Worksheet" > Pick a suitable pre-made layout.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Menyesuaikan Kandungan & Soalan Pengajaran',
          en: 'Customizing Lesson Content & Questions',
        },
        guidedText: {
          bm: 'Klik dua kali pada mana-mana kotak teks untuk menggantikan teks sampel dengan soalan anda. Di sebelah kiri, klik menu "Elements" untuk mencari gambar kartun atau rajah sains yang bersesuaian dengan topik.',
          en: 'Double-click any text box to replace placeholder copy with your lesson questions. From the left sidebar, click "Elements" to search for curriculum illustrations or icons.',
        },
        selfText: {
          bm: 'Klik 2 kali teks untuk ubah > Tambah elemen visual dari panel kiri.',
          en: 'Double-click text to edit > Insert educational graphics from the left panel.',
        },
        tip: {
          bm: 'Gunakan ciri "Tidy Up" dalam menu Position untuk menyusun objek secara automatik.',
          en: 'Use "Tidy Up" in the Position menu to instantly space objects evenly.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'layout-studio',
      taskTitle: {
        bm: 'Perancangan Poster Canva Guru',
        en: 'Canva Teacher Layout Studio',
      },
      taskGoal: {
        bm: 'Ketahui kombinasi elemen yang menjadikan bahan pengajaran Canva menarik dan berkesan.',
        en: 'Explore the formula for clean, pedagogically sound Canva teaching materials.',
      },
      guidelines: [
        {
          bm: 'Jangan masukkan terlalu banyak jenis fon; gunakan maksimum 2 jenis fon sahaja.',
          en: 'Limit font styles to a maximum of 2 complementary families.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah format fail terbaik untuk dimuat turun dari Canva jika anda ingin mencetak lembaran kerja di sekolah?',
          en: 'What is the best export format from Canva when printing worksheets on physical paper?',
        },
        options: [
          { bm: 'GIF animasi', en: 'Animated GIF' },
          { bm: 'Cetak PDF (PDF Print)', en: 'PDF Print' },
          { bm: 'MP4 Video', en: 'MP4 Video' },
          { bm: 'Fail HTML', en: 'HTML File' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'PDF Print mengekalkan resolusi 300 DPI yang tajam dan memastikan teks serta garis tidak kabur apabila dicetak.',
          en: 'PDF Print preserves sharp 300 DPI resolution, ensuring lines and text print crisp and clear.',
        },
      },
    ],
  },

  {
    id: 'google-forms-assessment',
    slug: 'google-forms-assessment',
    category: 'teaching-tools',
    level: 'intermediate',
    estimatedMinutes: 15,
    iconName: 'FileCheck2',
    toolBadge: 'Google Forms',
    title: {
      bm: 'Google Forms: Kuiz Semakan Automatik & Borang Maklum Balas',
      en: 'Google Forms: Self-Grading Quizzes & Feedback Surveys',
    },
    description: {
      bm: 'Jimatkan berjam-jam masa menanda kertas. Bina kuiz digital dengan skema jawapan automatik dan analisis graf prestasi murid.',
      en: 'Save hours of manual grading. Build self-marking digital quizzes with instant answer keys and class performance analytics.',
    },
    understand: {
      concept: {
        bm: 'Google Forms bukan sekadar borang soal selidik. Apabila diaktifkan sebagai "Kuiz" (Make this a quiz), sistem akan menanda jawapan murid secara automatik, memberi skor serta-merta, dan menjana carta soalan yang kerap salah.',
        en: 'Google Forms is far more than a basic survey. When toggled to "Make this a quiz", it marks objective answers automatically, tallies scores, and generates analytics on common student misconceptions.',
      },
      whyItMatters: {
        bm: 'Guru tidak perlu lagi membawa pulang berpuluh-puluh buku latihan untuk ujian objektif. Masa terluang boleh digunakan untuk merancang intervensi murid yang lemah.',
        en: 'Teachers no longer need to carry stacks of exercise books home for objective quizzes. Reclaimed time can be spent on targeted student interventions.',
      },
      keyTakeaways: [
        {
          bm: 'Aktifkan tetapan: Settings > Make this a quiz.',
          en: 'Enable: Settings > Make this a quiz.',
        },
        {
          bm: 'Tetapkan "Answer Key" (Skema Jawapan) dan markah untuk setiap soalan.',
          en: 'Assign point values and specify the correct answer in the Answer Key.',
        },
        {
          bm: 'Kumpul nama dan kelas murid pada soalan nombor satu dan dua.',
          en: 'Always collect Student Name and Class as questions 1 and 2.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Panduan Membina Kuiz PBD Semakan Automatik Menggunakan Google Forms',
        en: 'Building Self-Grading Classroom Quizzes with Google Forms',
      },
      duration: '07:45',
      chapters: [
        { time: '00:00', label: { bm: 'Membuka Borang & Menukar Kepada Kuiz', en: 'Opening Forms & Quiz Setup' } },
        { time: '02:15', label: { bm: 'Memasukkan Soalan & Skema Jawapan', en: 'Writing Questions & Setting Answer Key' } },
        { time: '04:50', label: { bm: 'Mengunci Borang & Hadkan 1 Respons', en: 'Locking & Limiting to 1 Response' } },
        { time: '06:30', label: { bm: 'Melihat Graf Skor & Muat Turun Excel', en: 'Reviewing Scores & Exporting to Sheets' } },
      ],
      keyHighlights: [
        {
          bm: 'Boleh berikan maklum balas penerangan automatik (Feedback) bagi murid yang memilih jawapan salah.',
          en: 'You can attach automatic helpful feedback explanations for students who pick wrong answers.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Menukar Borang Biasa Kepada Mod Kuiz',
          en: 'Convert Standard Form to Quiz Mode',
        },
        guidedText: {
          bm: 'Buka forms.google.com > Klik "Blank form". Di bahagian tab atas, klik pada "Settings". Cari suis pilihan bertulis "Make this a quiz" dan hidupkan (toggle ON). Ini akan membolehkan fungsi markah dan skema jawapan.',
          en: 'Go to forms.google.com > Click "Blank form". In the top tabs, click "Settings". Toggle "Make this a quiz" to ON. This activates auto-scoring and answer key options.',
        },
        selfText: {
          bm: 'Settings > Hidupkan suis "Make this a quiz".',
          en: 'Settings > Toggle ON "Make this a quiz".',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Menetapkan Kunci Jawapan (Answer Key) & Markah',
          en: 'Configure the Answer Key and Points',
        },
        guidedText: {
          bm: 'Kembali ke tab "Questions". Klik pada soalan aneka pilihan anda. Di penjuru bawah soalan, klik pautan biru bertulis "Answer key". Tandakan jawapan yang betul, masukkan bilangan markah (cth: 1 atau 2), dan klik "Done".',
          en: 'Return to the "Questions" tab. Click on your multiple-choice question. At the bottom left of the question box, click "Answer key". Select the correct option, assign points (e.g., 1 or 2), and click "Done".',
        },
        selfText: {
          bm: 'Klik soalan > Klik "Answer key" > Pilih jawapan betul & masukkan markah > Done.',
          en: 'Click question > Click "Answer key" > Pick correct answer & set points > Done.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'quiz-config',
      taskTitle: {
        bm: 'Simulasi Skema Kuiz Automatik',
        en: 'Auto-Grading Quiz Setup Checker',
      },
      taskGoal: {
        bm: 'Lihat bagaimana penetapan soalan, pilihan aneka, dan markah disusun untuk keberkesanan semakan.',
        en: 'Observe how questions, options, and point distributions ensure effortless assessment.',
      },
      guidelines: [
        {
          bm: 'Sentiasa jadikan soalan Nama Murid sebagai "Required" (Wajib Diisi).',
          en: 'Always set the Student Name question as "Required".',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah langkah penting pertama yang wajib dihidupkan dalam Google Forms untuk membolehkan semakan markah automatik?',
          en: 'What is the crucial setting that must be activated in Google Forms to enable auto-grading?',
        },
        options: [
          { bm: 'Tukar warna tema borang kepada ungu', en: 'Change the theme color to purple' },
          { bm: 'Hidupkan suis "Make this a quiz" dalam tetapan Settings', en: 'Toggle ON "Make this a quiz" in Settings' },
          { bm: 'Muat turun aplikasi mudah alih khas', en: 'Download a separate mobile plugin' },
          { bm: 'Hantar emel kepada pentadbir sistem', en: 'Send an email to the administrator' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Suis "Make this a quiz" membuka pilihan "Answer Key" untuk menandakan jawapan betul dan menetapkan markah bagi setiap soalan.',
          en: 'The "Make this a quiz" switch enables the Answer Key button where you define correct answers and point tallies.',
        },
      },
    ],
  },

  {
    id: 'google-classroom-essentials',
    slug: 'google-classroom-essentials',
    category: 'teaching-tools',
    level: 'intermediate',
    estimatedMinutes: 16,
    iconName: 'GraduationCap',
    toolBadge: 'Classroom',
    title: {
      bm: 'Google Classroom: Mengagihkan Tugasan & Memberi Maklum Balas Pelajar',
      en: 'Google Classroom: Distributing Assignments & Providing Constructive Feedback',
    },
    description: {
      bm: 'Urus bilik darjah digital tanpa kertas: agihkan salinan lembaran kerja secara individu, tetapkan tarikh akhir, dan berikan gred.',
      en: 'Manage a paperless digital classroom: distribute individual worksheet copies, set due dates, and return guided feedback.',
    },
    understand: {
      concept: {
        bm: 'Google Classroom menghubungkan guru dan murid dalam satu pusat sehenti. Ciri terpentingnya ialah "Make a copy for each student", di mana sistem mencipta satu salinan dokumen tersendiri secara automatik untuk setiap murid menaip jawapan mereka.',
        en: 'Google Classroom unifies teachers and learners in one hub. Its most powerful setting is "Make a copy for each student", which automatically provisions an individual file for every child to complete.',
      },
      whyItMatters: {
        bm: 'Murid tidak akan lagi merosakkan atau memadam jawapan rakan sekelas lain. Guru boleh melihat kemajuan setiap murid secara masa nyata semasa mereka sedang menaip.',
        en: 'Students will never overwrite or erase classmates\' work. Teachers can view live student progress in real-time while learners are typing.',
      },
      keyTakeaways: [
        {
          bm: 'Sentiasa pilih pilihan "Make a copy for each student" apabila memuat naik lembaran tugasan Google Docs atau Slaid.',
          en: 'Always choose "Make a copy for each student" when attaching individual worksheets.',
        },
        {
          bm: 'Gunakan ciri "Private Comment" untuk membimbing murid pemulihan secara peribadi tanpa rasa malu.',
          en: 'Use "Private Comments" to coach hesitant students with constructive encouragement.',
        },
        {
          bm: 'Cipta Topik (Topics) mengikut Minggu atau Unit Pembelajaran agar Stream kekal kemas.',
          en: 'Organize coursework using Topics (Weeks or Units) to prevent a messy stream.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Panduan Mengagihkan Tugasan & Menyemak Kerja Murid di Google Classroom',
        en: 'Assigning Coursework & Grading Submissions in Google Classroom',
      },
      duration: '08:30',
      chapters: [
        { time: '00:00', label: { bm: 'Struktur Tab: Stream vs Classwork', en: 'Classroom Tabs: Stream vs Classwork' } },
        { time: '02:40', label: { bm: 'Membuat Tugasan dengan Salinan Individu', en: 'Creating Assignments with Student Copies' } },
        { time: '05:30', label: { bm: 'Memberi Maklum Balas & Mengembalikan Gred', en: 'Returning Feedback & Grades' } },
      ],
      keyHighlights: [
        {
          bm: 'Jangan muat naik semua bahan di tab "Stream"—gunakan tab "Classwork" untuk tugasan rasmi.',
          en: 'Avoid posting formal tasks in the Stream—always use the structured "Classwork" tab.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mencipta Tugasan Dalam Tab Classwork',
          en: 'Create an Assignment in Classwork Tab',
        },
        guidedText: {
          bm: 'Masuk ke kelas anda > Klik tab "Classwork" di bahagian atas > Klik butang "+ Create" > Pilih "Assignment". Berikan tajuk jelas seperti "Sains: Kitaran Air Minggu 4".',
          en: 'Open your class > Click the "Classwork" tab at top > Click "+ Create" > Select "Assignment". Provide an explicit title such as "Science: Water Cycle Week 4".',
        },
        selfText: {
          bm: 'Tab Classwork > + Create > Assignment > Masukkan tajuk & arahan.',
          en: 'Classwork tab > + Create > Assignment > Enter title & clear instructions.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Memilih Pilihan "Make a copy for each student"',
          en: 'Select "Make a copy for each student"',
        },
        guidedText: {
          bm: 'Klik ikon Google Drive untuk melampirkan lembaran kerja anda. Di sebelah nama fail, klik menu lungsur (dropdown) yang bertulis "Students can view file" dan tukarkannya kepada "Make a copy for each student". Kemudian klik butang "Assign" di penjuru kanan atas.',
          en: 'Click the Drive icon to attach your worksheet template. Next to the attached file, click the dropdown menu currently set to "Students can view file" and change it to "Make a copy for each student". Then click "Assign".',
        },
        selfText: {
          bm: 'Lampirkan fail Drive > Tukar menu ke "Make a copy for each student" > Klik Assign.',
          en: 'Attach Drive file > Change permission to "Make a copy for each student" > Click Assign.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'classroom-permissions',
      taskTitle: {
        bm: 'Simulasi Tetapan Tugasan Digital',
        en: 'Digital Assignment Configuration Flow',
      },
      taskGoal: {
        bm: 'Fahami perbezaan antara "Students can view", "Students can edit", dan "Make a copy for each student".',
        en: 'Understand the distinct differences between viewing, shared editing, and individualized copies.',
      },
      guidelines: [
        {
          bm: '"Students can edit" sesuai hanya untuk aktiviti sumbang saran kolaboratif seluruh kelas.',
          en: '"Students can edit" is intended solely for collaborative whole-class brainstorming.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah tetapan lampiran yang betul jika guru mahu setiap murid mempunyai lembaran kerja sendiri untuk ditaip dan dinilai?',
          en: 'Which attachment permission ensures every student gets their own copy to answer and submit?',
        },
        options: [
          { bm: 'Students can view file', en: 'Students can view file' },
          { bm: 'Students can edit file', en: 'Students can edit file' },
          { bm: 'Make a copy for each student', en: 'Make a copy for each student' },
          { bm: 'Delete file after reading', en: 'Delete file after reading' },
        ],
        correctAnswer: 2,
        explanation: {
          bm: '"Make a copy for each student" mencipta fail berasingan dengan nama murid di hadapannya secara automatik.',
          en: '"Make a copy for each student" creates an independent document for each learner with their name attached.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // CATEGORY 3: AI FOR TEACHERS (AI UNTUK GURU)
  // -------------------------------------------------------------
  {
    id: 'intro-generative-ai',
    slug: 'intro-generative-ai',
    category: 'ai-teachers',
    level: 'intermediate',
    estimatedMinutes: 14,
    iconName: 'Sparkles',
    toolBadge: 'Konsep AI',
    title: {
      bm: 'Pengenalan AI Generatif untuk Pendidik: Konsep & Batasan',
      en: 'Intro to Generative AI for Educators: Capabilities & Limitations',
    },
    description: {
      bm: 'Ketahui bagaimana model bahasa berfungsi, apa yang boleh dan tidak boleh dilakukan oleh AI, serta peranannya sebagai pembantu guru.',
      en: 'Understand how language models function, what AI can and cannot do, and its rightful role as a teacher co-pilot.',
    },
    understand: {
      concept: {
        bm: 'AI Generatif (seperti Gemini) ialah model pintar yang dilatih meramalkan corak perkataan daripada berjuta-juta teks. AI bukan manusia berakal, dan ia tidak memiliki pertimbangan emosi atau empati bilik darjah. AI adalah "pembantu penyelidik pantas" (co-pilot), manakala guru kekal sebagai juruterbang utama.',
        en: 'Generative AI is a smart model trained to predict text patterns from massive datasets. AI is not sentient and lacks classroom emotional intelligence or pedagogical empathy. AI is a speedy co-pilot; the teacher remains in the pilot seat.',
      },
      whyItMatters: {
        bm: 'Dengan memahami batasan AI, guru tidak akan tertipu oleh maklumat yang nampak meyakinkan tetapi salah (halusinasi), dan boleh memanfaatkan AI untuk tugas draf yang memakan masa.',
        en: 'By understanding AI limits, teachers avoid being misled by plausible-sounding inaccuracies (hallucinations) and can focus AI on time-consuming drafting tasks.',
      },
      keyTakeaways: [
        {
          bm: 'AI cemerlang dalam: menjana idea aktiviti, merangka draf karangan sampel, meringkaskan artikel panjang.',
          en: 'AI excels at: brainstorming activity ideas, drafting sample essays, summarizing long research papers.',
        },
        {
          bm: 'AI lemah dalam: mengesahkan fakta terkini tanpa rujukan, memahami keperluan unik emosi murid anda.',
          en: 'AI struggles with: verifying niche current facts without grounding, grasping your specific classroom dynamics.',
        },
        {
          bm: 'Peraturan Utama: Sentiasa semak, ubah suai dan sesuaikan hasil AI mengikut konteks kurikulum DSKP.',
          en: 'Golden Rule: Always review, edit, and align AI outputs with your official syllabus standards.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Memahami AI Generatif Tanpa Bahasa Teknikal yang Sukar',
        en: 'Demystifying Generative AI for Teachers in Plain Language',
      },
      duration: '07:15',
      chapters: [
        { time: '00:00', label: { bm: 'Bagaimana AI "Membaca" & Menjawab', en: 'How AI Reads and Predicts Text' } },
        { time: '02:30', label: { bm: 'Apakah Itu Halusinasi AI?', en: 'What is AI Hallucination?' } },
        { time: '05:00', label: { bm: 'Prinsip Guru Kekal Berkuasa (Teacher-in-the-Loop)', en: 'The Teacher-in-the-Loop Principle' } },
      ],
      keyHighlights: [
        {
          bm: 'Anggap AI seperti seorang pembantu guru pelatih yang sangat rajin tetapi perlukan semakan teliti anda.',
          en: 'Treat AI as an eager student assistant who works fast but always requires your veteran teacher sign-off.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mengenal Pasti Tugas yang Sesuai untuk AI',
          en: 'Identifying Tasks Best Suited for AI',
        },
        guidedText: {
          bm: 'Gunakan AI untuk tugas yang memerlukan percambahan idea (contoh: "Beri 5 idea aktiviti PAK-21 untuk topik Fotosintesis"), bukan untuk membuat keputusan akhir pemarkahan murid.',
          en: 'Utilize AI for ideation tasks (e.g., "Give 5 interactive starter activities for Photosynthesis"), never for final high-stakes student evaluations.',
        },
        selfText: {
          bm: 'Gunakan AI untuk sumbang saran idea dan draf awal; elakkan bergantung 100% pada fakta spesifik.',
          en: 'Use AI for brainstorming and initial drafts; never rely 100% on unverified claims.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Melakukan Semakan Manusia (Teacher-in-the-Loop)',
          en: 'Conducting Human Teacher Verification',
        },
        guidedText: {
          bm: 'Setiap kali AI menjana draf soalan atau petikan teks, baca ayat demi ayat. Pastikan istilah sains atau sejarah menepati buku teks rasmi sebelum diedarkan kepada murid.',
          en: 'Every time AI drafts an exercise, read through line by line. Verify that scientific or historical terms strictly adhere to your official school textbook before distributing.',
        },
        selfText: {
          bm: 'Sentiasa baca dan semak istilah dengan buku teks sebelum menggunakan bahan AI.',
          en: 'Always read and cross-check terminology with school textbooks before classroom use.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'ai-scenario-lab',
      taskTitle: {
        bm: 'Uji Intuisi Fakta AI',
        en: 'AI Fact-Check Intuition Builder',
      },
      taskGoal: {
        bm: 'Ketahui bila masa yang tepat untuk menggunakan AI dan bila masa semakan manual diperlukan.',
        en: 'Recognize when AI provides tremendous value versus when critical scrutiny is imperative.',
      },
      guidelines: [
        {
          bm: 'Kawal selia privasi: Jangan sekali-kali memasukkan nama penuh atau nombor kad pengenalan murid ke dalam alatan AI awam.',
          en: 'Safeguard privacy: Never paste student full names or identity card numbers into public AI tools.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah takrifan paling tepat bagi peranan AI Generatif dalam dunia pendidikan hari ini?',
          en: 'What is the most accurate definition of Generative AI\'s role in modern education?',
        },
        options: [
          { bm: 'Pengganti sepenuhnya kepada profesion guru', en: 'A complete replacement for the teacher profession' },
          { bm: 'Pembantu penyelidik dan pemula draf (co-pilot) yang sentiasa memerlukan semakan guru', en: 'A speedy research assistant and drafting co-pilot requiring teacher verification' },
          { bm: 'Enjin carian yang 100% tidak pernah melakukan kesilapan fakta', en: 'A search engine that is 100% free of factual errors' },
          { bm: 'Perisian untuk menipu dalam tugasan', en: 'Software designed to cheat assignments' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'AI berfungsi sebagai pembantu pemula draf. Sentuhan kemanusiaan, kebijaksanaan pedagogi dan semakan akhir tetap milik guru sepenuhnya.',
          en: 'AI is a co-pilot. Human pedagogical judgment, compassion, and ultimate syllabus alignment belong strictly to the teacher.',
        },
      },
    ],
  },

  {
    id: 'prompt-writing-teachers',
    slug: 'prompt-writing-teachers',
    category: 'ai-teachers',
    level: 'intermediate',
    estimatedMinutes: 22,
    iconName: 'Terminal',
    toolBadge: 'Formula Gesaan',
    title: {
      bm: 'Teknik Menulis Gesaan (Prompt) Berkesan untuk Pengajaran',
      en: 'Prompt Crafting for Teachers: The PREP Formula',
    },
    description: {
      bm: 'Ketahui formula 4-elemen [Peranan + Topik + Tahap Murid + Format] untuk menghasilkan draf soalan, aktiviti dan lembaran berkualiti.',
      en: 'Master the 4-element formula [Persona + Task + Student Level + Format] to generate superior lesson activities and rubrics.',
    },
    understand: {
      concept: {
        bm: 'Gesaan (Prompt) ialah arahan bertulis yang kita berikan kepada AI. Kualiti jawapan AI bergantung 100% kepada kejelasan arahan guru. Arahan umum ("Buat soalan Sains") menghasilkan jawapan generik; arahan terperinci menghasilkan bahan siap guna.',
        en: 'A prompt is the written instruction you give to AI. The quality of AI output is directly proportional to the clarity of your directions. Vague prompts yield bland outputs; structured prompts generate classroom-ready materials.',
      },
      whyItMatters: {
        bm: 'Ramai guru kecewa kerana jawapan AI kelihatan terlalu sukar untuk murid mereka. Dengan memasukkan maklumat tahap murid (contoh: "Murid Tahun 3 Pemulihan"), AI akan melaraskan kosa kata secara automatik.',
        en: 'Many teachers feel underwhelmed because AI responses sound too complex for their students. By specifying the learner level, AI automatically tailors vocabulary and sentence length.',
      },
      keyTakeaways: [
        {
          bm: 'Formula PREP: Peranan (Role) + Resipi/Topik (Task) +のエ Audience/Tahap (Context) + Pola/Format (Format).',
          en: 'The PREP Formula: Persona (Role) + Recipe/Task (Task) + Expected Level (Context) + Pattern (Format).',
        },
        {
          bm: 'Beri contoh (Few-shot prompting): Sertakan satu contoh gaya soalan yang anda mahukan.',
          en: 'Include examples (few-shot prompting) to steer tone and layout.',
        },
        {
          bm: 'Tentukan batasan negatif: "Jangan gunakan istilah universiti", "Hadkan kepada 10 patah perkataan sebaris".',
          en: 'Set constraints: "Avoid complex academic jargon", "Limit explanations to 3 bullet points".',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Kajian Kes: Dari Gesaan Lemah Kepada Gesaan Bertaraf Bintang',
        en: 'Case Study: From Weak Prompts to High-Impact Teacher Prompts',
      },
      duration: '09:40',
      chapters: [
        { time: '00:00', label: { bm: 'Mengapa Gesaan Pendek Gagal', en: 'Why Short Prompts Disappoint' } },
        { time: '02:45', label: { bm: 'Membongkar Formula PREP Guru', en: 'Deconstructing the PREP Formula' } },
        { time: '05:30', label: { bm: 'Demonstrasi Menjana Petikan Bahasa Melayu', en: 'Live Demo: Reading Comprehension Prompt' } },
        { time: '08:00', label: { bm: 'Teknik Menambah Skema Pemarkahan', en: 'Adding Rubric & Answer Key Clauses' } },
      ],
      keyHighlights: [
        {
          bm: 'Sentiasa minta AI menyediakan "Skema Jawapan & Penjelasan Ringkas" di akhir gesaan.',
          en: 'Always append "Include an answer key with brief explanations" at the end of your prompt.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Langkah 1: Tetapkan Peranan AI (Persona)',
          en: 'Step 1: Set the AI Role & Persona',
        },
        guidedText: {
          bm: 'Mulakan ayat dengan: "Bertindak sebagai guru pakar [Subjek] sekolah rendah yang berpengalaman 15 tahun dalam pedagogi abad ke-21 (PAK-21)...". Ini membina nada dan gaya jawapan yang profesional.',
          en: 'Open with: "Act as an expert primary [Subject] teacher with 15 years experience in student-centered pedagogy...". This primes the AI to respond with educational nuance.',
        },
        selfText: {
          bm: 'Mulakan: "Bertindak sebagai guru pakar [Subjek]..."',
          en: 'Start with: "Act as an experienced [Subject] educator..."',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Langkah 2: Nyatakan Topik, Tahap & Format Lengkap',
          en: 'Step 2: Specify Topic, Student Level & Format',
        },
        guidedText: {
          bm: 'Sambung dengan: "Bina 5 soalan kefahaman berdasarkan topik [Kitaran Hidup Katak] untuk [Murid Tahun 3]. Formatkan dalam bentuk jadual: Lajur 1: Soalan, Lajur 2: Tahap Kognitif Bloom (Rendah/Tinggi), Lajur 3: Skema Jawapan."',
          en: 'Continue with: "Generate 5 comprehension questions for the topic [Life Cycle of a Frog] tailored for [Grade 3 learners]. Present as a table with Column 1: Question, Column 2: Bloom\'s Level, Column 3: Answer Key."',
        },
        selfText: {
          bm: 'Nyatakan Topik + Tahap Murid + Format yang diingini (cth: jadual / senarai bernombor).',
          en: 'State Topic + Grade Level + Desired Format (e.g., table / numbered list).',
        },
        tip: {
          bm: 'Jika jawapan pertama terlalu panjang, balas: "Ringkaskan ke dalam 3 poin sahaja". Anda boleh berbual secara berperingkat.',
          en: 'If the first draft is too verbose, simply reply: "Condense this into 3 bullets". It is an iterative conversation.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'prompt-anatomy',
      taskTitle: {
        bm: 'Latihan Anatomi 4 Bahagian Gesaan AI',
        en: '4-Part Prompt Anatomy Practice',
      },
      taskGoal: {
        bm: 'Kenal pasti dan padankan 4 komponen formula gesaan (Peranan, Topik, Tahap Murid, Format). Anda juga boleh membuka Pembina Gesaan AI penuh di bar sisi.',
        en: 'Identify and match the 4 formula blocks (Role, Topic, Student Level, Format), or open the full AI Prompt Builder from the sidebar.',
      },
      guidelines: [
        {
          bm: 'Padankan setiap petikan ayat di bawah dengan bahagian formula yang betul.',
          en: 'Match each prompt phrase below to its correct formula component.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Antara dua arahan berikut, manakah yang akan menghasilkan bahan kuiz yang paling tepat dan bersedia diguna di bilik darjah?',
          en: 'Between the following two prompts, which produces the most reliable classroom-ready quiz?',
        },
        options: [
          { bm: 'Beri saya 5 soalan sains.', en: 'Give me 5 science questions.' },
          { bm: 'Bertindak sebagai guru Sains Tahun 4. Bina 5 soalan objektif aneka pilihan (A,B,C,D) topik Sifat Bahan mengikut silibus KSSR, sertakan skema jawapan dan penjelasan mudah.', en: 'Act as a Year 4 Science teacher. Build 5 multiple-choice questions on Properties of Materials for primary students with answer key and child-friendly rationale.' },
          { bm: 'Tulis tentang sains.', en: 'Write about science.' },
          { bm: 'Apakah itu sains?', en: 'What is science?' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Pilihan kedua menyertakan Peranan, Tahap Murid, Topik Spesifik, Format Jawapan, dan Skema Pemarkahan—menghasilkan bahan tepat tanpa kekaburan.',
          en: 'The second prompt defines Persona, Grade Level, Precise Topic, Format, and Answer Key—eliminating ambiguity.',
        },
      },
    ],
  },

  {
    id: 'ai-lesson-preparation',
    slug: 'ai-lesson-preparation',
    category: 'ai-teachers',
    level: 'advanced',
    estimatedMinutes: 20,
    iconName: 'BookOpenCheck',
    toolBadge: 'Persediaan RPH',
    title: {
      bm: 'Penyediaan RPH Berbantu AI Secara Cepat & Berkualiti',
      en: 'AI-Assisted Lesson Planning (RPH): Rapid & Compliant',
    },
    description: {
      bm: 'Panduan menjana objektif pembelajaran SMART, aktiviti PAK-21, dan set induksi pemula minat menggunakan AI.',
      en: 'Guide to structuring SMART learning objectives, 21st-century activities, and engaging set inductions with AI.',
    },
    understand: {
      concept: {
        bm: 'RPH (Rancangan Pengajaran Harian) adalah kompas guru. AI boleh membantu merangka draf aktiviti pembelajaran berasaskan inkuiri (Inquiry-Based Learning) dan mencadangkan aktiviti pembezaan (Differentiation) untuk murid pelbagai aras.',
        en: 'Daily Lesson Plans are a teacher\'s compass. AI can draft inquiry-based learning steps and suggest differentiated scaffolding for mixed-ability classrooms in seconds.',
      },
      whyItMatters: {
        bm: 'Guru sering menghabiskan malam minggu menaip semula RPH rutin. Dengan AI sebagai pembantu rangka kerja, guru boleh menjimatkan 1 hingga 2 jam seminggu dan memfokuskan tenaga kepada interaksi bersemuka.',
        en: 'Teachers frequently spend late weekend hours retyping routine lesson plan structures. With AI framing the scaffolding, educators reclaim 1-2 hours weekly for student mentoring.',
      },
      keyTakeaways: [
        {
          bm: 'Objektif SMART: Murid dapat [kata kerja tingkah laku] sekurang-kurangnya [kriteria kejayaan].',
          en: 'SMART Objectives: Students will be able to [action verb] at least [success criteria].',
        },
        {
          bm: 'Minta AI cadangkan 3 aras aktiviti: Aras Rendah (Bimbingan), Sederhana, dan Pengayaan.',
          en: 'Prompt AI for 3 tiers of differentiated activity: Remedial, Intermediate, and Enrichment.',
        },
        {
          bm: 'Sentiasa padankan cadangan AI dengan Standard Pembelajaran (SP) dalam dokumen DSKP sekolah anda.',
          en: 'Cross-reference AI ideas with the official learning standards in your curriculum guide.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Membina RPH Lengkap TS25 Dalam Masa 15 Minit Berbantu AI',
        en: 'Crafting Complete TS25 Lesson Scaffolds in 15 Minutes with AI',
      },
      duration: '08:50',
      chapters: [
        { time: '00:00', label: { bm: 'Anatomi RPH Moden (Induksi, Perkembangan, Penutup)', en: 'Anatomy of Modern Lesson Plans' } },
        { time: '02:30', label: { bm: 'Meminta Set Induksi Yang Menarik Perhatian', en: 'Prompting for Hook Inductions' } },
        { time: '05:10', label: { bm: 'Membina Aktiviti Pembezaan Murid', en: 'Designing Differentiated Tasks' } },
        { time: '07:20', label: { bm: 'Eksport Terus ke Templat Word/Google Docs', en: 'Exporting Cleanly to Word/Docs' } },
      ],
      keyHighlights: [
        {
          bm: 'Gunakan frasa "Aktiviti PAK-21 seperti Gallery Walk atau Think-Pair-Share" dalam arahan anda.',
          en: 'Incorporate 21st-century pedagogical hooks like "Gallery Walk" or "Think-Pair-Share".',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Menyediakan Input Standard Pembelajaran',
          en: 'Input Official Learning Standard',
        },
        guidedText: {
          bm: 'Salin Standard Pembelajaran (SP) dari dokumen DSKP anda. Masukkan ke dalam gesaan: "Berdasarkan SP ini: [Tampal SP], cadangkan Set Induksi 5 minit yang menggunakan objek maujud dalam bilik darjah."',
          en: 'Copy the specific Learning Standard from your curriculum syllabus. Prompt: "Based on this standard: [Paste Standard], generate a 5-minute set induction using physical everyday classroom objects."',
        },
        selfText: {
          bm: 'Masukkan Standard Pembelajaran DSKP rasmi dan minta cadangan Set Induksi menarik.',
          en: 'Provide official syllabus standard and request engaging set induction ideas.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Menjana Aktiviti Pembezaan (Differentiation)',
          en: 'Generate Differentiated Activities',
        },
        guidedText: {
          bm: 'Arahkan AI: "Cadangkan 3 tugasan kumpulan mengikut tahap: Kumpulan Cemerlang (mencipta/menganalisis), Kumpulan Sederhana (mengaplikasi), dan Kumpulan Pemulihan (mengenal pasti dengan bantuan gambar)."',
          en: 'Command AI: "Generate 3 tiered activities: Advanced (create/analyze), Core (apply), and Remedial (identify with visual aids)."',
        },
        selfText: {
          bm: 'Minta 3 aras aktiviti: Pemulihan, Sederhana, dan Cemerlang.',
          en: 'Request 3 tiers of student activity: Remedial, Core, and Advanced.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'rph-scaffold',
      taskTitle: {
        bm: 'Penjana Rangka RPH Interaktif',
        en: 'Interactive Lesson Plan Scaffold Generator',
      },
      taskGoal: {
        bm: 'Saksikan bagaimana elemen RPH standard tersusun dalam struktur pembelajaran tersusun.',
        en: 'See how standard lesson plan components snap into structured educational flow.',
      },
      guidelines: [
        {
          bm: 'Pastikan objektif pembelajaran boleh diukur (measurable).',
          en: 'Ensure learning objectives remain strictly measurable.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Mengapakah objektif pembelajaran dalam RPH perlu mengandungi kriteria kejayaan yang jelas?',
          en: 'Why must learning objectives contain measurable success criteria?',
        },
        options: [
          { bm: 'Supaya pentadbir tidak memotong gaji guru', en: 'To satisfy administrative payroll audits' },
          { bm: 'Supaya guru dan murid dapat menilai dengan jelas sama ada hasil pembelajaran tercapai atau memerlukan pemulihan', en: 'So teachers and students clearly evaluate whether the learning outcome was achieved or needs remediation' },
          { bm: 'Hanya sebagai hiasan formaliti dokumen', en: 'Merely as decorative formal filler' },
          { bm: 'Untuk mengisi ruang kosong di dalam buku rekod', en: 'To fill up white space in record books' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Kriteria kejayaan yang jelas membolehkan pentaksiran bilik darjah (PBD) dinilai secara telus dan objektif.',
          en: 'Measurable criteria empower transparent, objective formative assessment.',
        },
      },
    ],
  },

  {
    id: 'responsible-ai-education',
    slug: 'responsible-ai-education',
    category: 'ai-teachers',
    level: 'intermediate',
    estimatedMinutes: 14,
    iconName: 'ShieldCheck',
    toolBadge: 'Etika & Privasi',
    title: {
      bm: 'Penggunaan AI Bertanggungjawab & Etika Integriti Akademik',
      en: 'Responsible AI in Education & Academic Integrity',
    },
    description: {
      bm: 'Ketahui garis panduan privasi data murid, isu hak cipta, dan cara mendidik murid menggunakan teknologi secara jujur.',
      en: 'Understand student data privacy protocols, copyright considerations, and nurturing honest student tech use.',
    },
    understand: {
      concept: {
        bm: 'Etika AI dalam pendidikan berkisar pada dua tonggak: (1) Perlindungan Privasi Murid dan (2) Kejujuran Akademik. Alatan AI awam memproses data di pelayan global; maka data peribadi murid tidak boleh didedahkan.',
        en: 'AI ethics in schools rests on two pillars: (1) Student Privacy Protection and (2) Academic Honesty. Public AI platforms process data on global servers; sensitive student identifiers must never be submitted.',
      },
      whyItMatters: {
        bm: 'Sebagai pendidik, guru menjadi teladan. Apabila guru mengajar murid cara menyatakan sumber (attribution) bila menggunakan AI, murid membesar dengan integriti tinggi dan tidak menjadi peniru pasif.',
        en: 'Teachers model integrity. By guiding students to properly cite and disclose AI assistance, learners grow into principled creators rather than passive plagiarizers.',
      },
      keyTakeaways: [
        {
          bm: 'Jangan sekali-kali memasukkan: Nama Penuh Murid, No MyKid/IC, atau Foto Wajah Murid ke dalam sistem AI awam.',
          en: 'Never enter: Student Full Names, National ID/MyKid numbers, or student face photos into public AI systems.',
        },
        {
          bm: 'Amalkan pengisytiharan: Nyatakan bila sesuatu bahan draf dibantu oleh AI.',
          en: 'Practice transparency: Disclose when a learning aid was co-drafted with AI assistance.',
        },
        {
          bm: 'Ajar murid menggunakan AI sebagai rakan perbincangan (tutor), bukan mesin penyalin kerja rumah.',
          en: 'Train students to use AI as an interactive study tutor, not a homework-copying engine.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Panduan Etika & Keselamatan Data Murid Dalam Penggunaan Alatan Digital',
        en: 'Ethical Guidelines & Student Data Privacy in Educational Tech',
      },
      duration: '06:50',
      chapters: [
        { time: '00:00', label: { bm: 'Prinsip Perlindungan Data Peribadi Murid', en: 'Student Personal Data Protection' } },
        { time: '02:20', label: { bm: 'Kesan Memasukkan Rekod Rahsia ke AI Awam', en: 'Risks of Inputting Private School Data' } },
        { time: '04:40', label: { bm: 'Membimbing Murid Mengenai Integriti Akademik', en: 'Guiding Students on Academic Honesty' } },
      ],
      keyHighlights: [
        {
          bm: 'Gunakan nama samaran (contoh: "Murid A, Murid B") apabila meminta AI mencadangkan aktiviti pemulihan.',
          en: 'Use anonymized labels (e.g., "Student A, Student B") when requesting personalized intervention suggestions.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Teknik Tanpa Nama (Anonimiti) Data',
          en: 'Data Anonymization Protocol',
        },
        guidedText: {
          bm: 'Sekiranya anda ingin meminta AI menganalisis kesukaran karangan seorang murid, padamkan nama murid, nama sekolah dan nombor pendaftaran. Masukkan hanya teks karangan tanpa sebarang maklumat pengenalan peribadi.',
          en: 'If you wish to ask AI to analyze writing weaknesses in an essay sample, strip out student names, school names, and student IDs. Submit only the raw academic text sample with zero personal markers.',
        },
        selfText: {
          bm: 'Padamkan semua nama murid dan pengenalan sekolah sebelum menampal teks ke AI.',
          en: 'Remove all student names and school identity markers before pasting into AI.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Mewujudkan Garis Panduan Bilik Darjah Mengenai AI',
          en: 'Establish a Classroom AI Agreement',
        },
        guidedText: {
          bm: 'Bincangkan bersama murid: AI boleh digunakan untuk menjana idea topik karangan, tetapi murid wajib menulis perenggan sendiri dan menyatakan: "Idea asal dibincangkan bersama pembantu AI".',
          en: 'Discuss with learners: AI may brainstorm story angles, but pupils must draft their own sentences and declare: "Initial brainstorming assisted by AI tutor".',
        },
        selfText: {
          bm: 'Galakkan ketelusan: Murid perlu menyatakan bahagian mana yang dibantu AI.',
          en: 'Encourage transparency: Learners must note which aspects received AI guidance.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'ai-scenario-lab',
      taskTitle: {
        bm: 'Uji Senario Privasi Data Bilik Darjah',
        en: 'Classroom Data Privacy Scenario Check',
      },
      taskGoal: {
        bm: 'Kenal pasti maklumat manakah yang selamat dan yang mana yang dilarang dimasukkan ke alatan AI.',
        en: 'Distinguish between safe academic prompts and prohibited personal identifiers.',
      },
      guidelines: [
        {
          bm: 'Maklumat kurikulum umum: Selamat.',
          en: 'General curriculum concepts: Completely safe.',
        },
        {
          bm: 'Nama dan latar belakang keluarga murid: Jangan sekali-kali dimasukkan.',
          en: 'Student family background and real names: Strictly prohibited.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Seorang guru ingin meminta cadangan aktiviti pemulihan untuk seorang murid yang lemah membaca. Apakah tindakan yang mematuhi etika privasi?',
          en: 'A teacher wants remedial suggestions for a struggling reader. Which action complies with ethical privacy standards?',
        },
        options: [
          { bm: 'Masukkan nama penuh murid, no IC dan laporan kaunseling ke AI', en: 'Paste the student\'s full legal name, ID card number, and counseling file into AI' },
          { bm: 'Huraikan tahap kemahiran membaca secara umum tanpa sebarang nama atau identiti pengenalan murid (cth: "Murid berumur 8 tahun sukar mengeja suku kata terbuka")', en: 'Describe the reading difficulty generally without any student names or personal identifiers (e.g., "An 8-year-old struggling with open syllables")' },
          { bm: 'Muat naik gambar slip peperiksaan murid', en: 'Upload a smartphone photo of the student\'s report card' },
          { bm: 'Kongsi pautan Facebook keluarga murid', en: 'Share a link to the student\'s family social profile' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Menghuraikan corak kesukaran secara tanpa nama melindungi hak privasi murid di samping tetap menerima cadangan strategi pedagogi yang tepat.',
          en: 'Describing learning difficulties anonymously protects student privacy while still receiving targeted pedagogical strategies.',
        },
      },
    ],
  },

  {
    id: 'fact-checking-ai-content',
    slug: 'fact-checking-ai-content',
    category: 'ai-teachers',
    level: 'intermediate',
    estimatedMinutes: 15,
    iconName: 'SearchCheck',
    toolBadge: 'Semakan Fakta',
    title: {
      bm: 'Cara Menyemak & Mengesahkan Maklumat Hasilan AI (Fakta vs Halusinasi)',
      en: 'Verifying AI Outputs: Spotting Hallucinations & Factual Errors',
    },
    description: {
      bm: 'Kuasai teknik 3-langkah menyemak rujukan buku teks rasmi, mengesan tarikh sejarah palsu, dan formula saintifik yang dicipta oleh AI.',
      en: 'Master the 3-step fact-checking method: cross-referencing textbooks, catching fabricated dates, and validating scientific formulas.',
    },
    understand: {
      concept: {
        bm: 'Halusinasi AI ialah situasi di mana model bahasa mencipta fakta, tarikh, nama tokoh, atau petikan undang-undang yang kedengaran sangat meyakinkan tetapi sebenarnya 100% rekaan. AI tidak tahu ia sedang berbohong; ia hanya menyambung perkataan yang kelihatan logik.',
        en: 'AI hallucination occurs when a language model invents dates, historical figures, or quotes that sound strikingly confident yet are 100% fabricated. AI has no intent to deceive; it simply strings words together that appear statistically coherent.',
      },
      whyItMatters: {
        bm: 'Sekiranya guru mengedarkan kertas soalan dengan fakta sains atau sejarah yang salah akibat disalin bulat-bulat dari AI, murid akan keliru dan kredibiliti guru boleh terjejas.',
        en: 'If a teacher distributes worksheets containing incorrect historical dates copied verbatim from AI, students memorize falsehoods and instructional credibility suffers.',
      },
      keyTakeaways: [
        {
          bm: 'Formula "Jangan Percaya Bulat-Bulat": Semua angka, tarikh, formula, dan petikan wajib disemak silang.',
          en: 'The "Never Blindly Trust" rule: All numbers, dates, formulas, and citations must be cross-referenced.',
        },
        {
          bm: 'Minta sumber: "Sertakan muka surat atau bab dalam silibus rasmi KSSR/KSSM jika ada".',
          en: 'Request sources: "Specify the relevant textbook chapter or curriculum module if known".',
        },
        {
          bm: 'Bila ragu-ragu, rujuk buku teks fizikal KPM atau portal rasmi kementerian.',
          en: 'When in doubt, always refer to physical official textbooks or ministerial portals.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Kompilasi Contoh Halusinasi AI Dalam Soalan Sekolah & Cara Menangkapnya',
        en: 'Examples of AI Hallucinations in School Tests & How to Catch Them',
      },
      duration: '07:25',
      chapters: [
        { time: '00:00', label: { bm: 'Contoh Halusinasi Tarikh Sejarah', en: 'Example: Fabricated Historical Timeline' } },
        { time: '02:40', label: { bm: 'Kaedah Semakan Silang Tiga Penjuru', en: 'Triangulation Fact-Checking Technique' } },
        { time: '05:15', label: { bm: 'Membimbing Murid Menjadi Pengguna Kritis', en: 'Teaching Critical Verification to Pupils' } },
      ],
      keyHighlights: [
        {
          bm: 'AI paling kerap berhalusinasi apabila diminta memberikan rujukan muka surat buku teks yang sangat spesifik.',
          en: 'AI hallucinates most frequently when asked for hyper-specific book page numbers without web browsing.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Sorot Fakta Kunci (Tarikh, Nama Tokoh, Formula)',
          en: 'Highlight High-Risk Facts (Dates, Names, Formulas)',
        },
        guidedText: {
          bm: 'Setiap kali menerima jawapan AI, tandakan mana-mana tarikh, nama orang, dan formula matematik/sains. Tiga elemen ini adalah kategori berisiko paling tinggi untuk berlaku halusinasi.',
          en: 'Whenever reviewing AI generated text, highlight every calendar date, historical biography, and mathematical formula. These three categories carry the highest risk of hallucinations.',
        },
        selfText: {
          bm: 'Tandakan tarikh, nama tokoh dan formula untuk disemak silang.',
          en: 'Pinpoint dates, person names, and scientific formulas for mandatory cross-checking.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Lakukan Semakan Silang dengan Buku Teks Rasmi',
          en: 'Cross-Check Against Official Textbooks',
        },
        guidedText: {
          bm: 'Buka buku teks rasmi atau portal rasmi. Sahkan bahawa fakta tersebut selari dengan sukatan pelajaran kebangsaan sebelum dimasukkan ke dalam soalan ujian atau slaid kelas.',
          en: 'Open the approved physical school textbook. Verify that the factual statement strictly aligns with national syllabus benchmarks before embedding into classroom slide decks.',
        },
        selfText: {
          bm: 'Buka buku teks KPM dan sahkan fakta tersebut sebelum diedarkan.',
          en: 'Cross-reference with ministry textbooks before distributing materials to learners.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'ai-scenario-lab',
      taskTitle: {
        bm: 'Simulasi Pengesanan Fakta vs Halusinasi',
        en: 'Fact vs Hallucination Detection Lab',
      },
      taskGoal: {
        bm: 'Kaji perbezaan antara penjelasan AI yang kukuh dan jawapan yang mengandungi petunjuk rekaan.',
        en: 'Analyze the indicators that distinguish grounded AI outputs from speculative hallucinations.',
      },
      guidelines: [
        {
          bm: 'Sentiasa perhatikan nada kepastian: AI sering bercakap sangat yakin walaupun maklumatnya salah.',
          en: 'Beware artificial confidence: AI often sounds remarkably certain even when entirely wrong.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah langkah terbaik apabila AI memberikan fakta sejarah yang anda tidak pernah dengar sebelum ini?',
          en: 'What is your best immediate action when AI presents an unfamiliar historical claim?',
        },
        options: [
          { bm: 'Percaya serta-merta kerana komputer lebih pintar daripada manusia', en: 'Believe it immediately because computers know everything' },
          { bm: 'Semak silang dengan buku teks sejarah rasmi atau portal arkib yang sah sebelum menggunakannya', en: 'Cross-check with official textbooks or verified historical archives before using it' },
          { bm: 'Terus cetak dan edarkan kepada semua murid', en: 'Print and distribute directly to all students' },
          { bm: 'Tutup kelas dan batalkan pengajaran', en: 'Dismiss the class and cancel the lesson' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Pendidik berwibawa sentiasa mengesahkan maklumat luar biasa dengan sumber rujukan autoriti sebelum memperkenalkannya kepada murid.',
          en: 'Professional educators invariably verify unusual or unverified claims with authoritative sources before classroom delivery.',
        },
      },
    ],
  },

  // -------------------------------------------------------------
  // CATEGORY 4: INTERACTIVE LEARNING (PEMBELAJARAN INTERAKTIF)
  // -------------------------------------------------------------
  {
    id: 'interactive-classroom-quizzes',
    slug: 'interactive-classroom-quizzes',
    category: 'interactive',
    level: 'intermediate',
    estimatedMinutes: 18,
    iconName: 'Gamepad2',
    toolBadge: 'Gamifikasi Kuiz',
    title: {
      bm: 'Mencipta Kuiz Interaktif (Gamifikasi & Penglibatan Pantas)',
      en: 'Creating Gamified Classroom Quizzes (Quizizz & Kahoot)',
    },
    description: {
      bm: 'Tukar suasana bilik darjah yang pasif kepada penuh keterujaan: tetapkan muzik latar, papan pendahulu (leaderboard) dan semakan jawapan langsung.',
      en: 'Transform passive classrooms into vibrant learning arenas: background music, live leaderboards, and instant feedback.',
    },
    understand: {
      concept: {
        bm: 'Kuiz gamifikasi (seperti Quizizz, Kahoot, Blooket) menggunakan elemen permainan (mata, masa, papan markah) untuk mencetuskan motivasi intrinsik murid. Murid tidak berasa seperti diuji; mereka berasa seperti sedang bermain bersama rakan.',
        en: 'Gamified quiz engines leverage game mechanics (points, timers, live scoreboards) to trigger positive engagement. Students do not perceive it as an anxious exam; they experience it as an exciting shared team quest.',
      },
      whyItMatters: {
        bm: 'Aktiviti kuiz langsung selama 10 minit di hujung kelas memberi guru data pentaksiran formatif segera: anda tahu topik mana yang 90% murid telah faham dan soalan mana yang perlukan penerangan semula esok.',
        en: 'A 10-minute live quiz at the end of class yields immediate formative assessment diagnostics: you immediately see which concepts 90% grasped and which questions need re-teaching tomorrow.',
      },
      keyTakeaways: [
        {
          bm: 'Boleh dimainkan secara langsung di kelas (Live Game) atau tugasan santai di rumah (Homework Mode).',
          en: 'Can be played synchronously in class (Live Game) or assigned as low-stress homework.',
        },
        {
          bm: 'Ciri "Paper Mode" dalam Quizizz membolehkan murid menjawab menggunakan kad kod QR bercetak walaupun tiada peranti telefon.',
          en: 'Quizizz "Paper Mode" allows students to respond using printed QR cards even without individual phones.',
        },
        {
          bm: 'Gunakan fungsi "Teleport" untuk mencari dan menyalin soalan berkualiti yang telah dikongsi oleh guru lain.',
          en: 'Use the "Teleport" feature to borrow high-quality questions curated by fellow teachers.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Cara Melancarkan Kuiz Gamifikasi Pertama Anda Dalam 5 Minit',
        en: 'Launching Your First Live Gamified Quiz in 5 Minutes',
      },
      duration: '08:15',
      chapters: [
        { time: '00:00', label: { bm: 'Memilih Platform Sesuai: Quizizz vs Kahoot', en: 'Platform Choice: Quizizz vs Kahoot' } },
        { time: '02:30', label: { bm: 'Membina Soalan dengan Fungsi Teleport', en: 'Building Questions via Teleport' } },
        { time: '05:00', label: { bm: 'Menjana Kod PIN & Memulakan Permainan', en: 'Generating Game PIN & Launching' } },
        { time: '06:50', label: { bm: 'Menganalisis Laporan Murid Selepas Kuiz', en: 'Reading Post-Game Diagnostic Reports' } },
      ],
      keyHighlights: [
        {
          bm: 'Kawal selia muzik dan kesan bunyi agar tidak mengganggu kelas sebelah.',
          en: 'Adjust sound volume moderately so games do not disrupt neighboring classrooms.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mencipta Kuiz & Memanfaatkan Ciri "Teleport"',
          en: 'Create Quiz & Leverage Teleport',
        },
        guidedText: {
          bm: 'Buka quizizz.com > Klik "Create" > "Quiz". Anda tidak perlu menaip semua soalan sendiri! Klik butang carian "Teleport" di atas, taip topik silibus anda (cth: "Kata Ganda Tahun 5"), dan klik "Add question" pada soalan yang anda suka.',
          en: 'Visit quizizz.com > Click "Create" > "Quiz". You don\'t have to author every question from zero! Click the "Teleport" search bar at top, enter your curriculum topic, and click "Add question" on vetted items.',
        },
        selfText: {
          bm: 'Buka Quizizz > Create > Gunakan Teleport untuk pinjam soalan siap > Simpan.',
          en: 'Open Quizizz > Create > Use Teleport to borrow existing questions > Save.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Memaparkan Kod PIN kepada Murid',
          en: 'Display Game PIN to Students',
        },
        guidedText: {
          bm: 'Klik butang hijau "Start a live quiz" > Pilih "Classic". Projektor akan memaparkan kod 6-digit (Game PIN) dan pautan joinmyquiz.com. Minta murid masukkan kod tersebut melalui peranti atau makmal komputer.',
          en: 'Click "Start a live quiz" > Choose "Classic". The screen will display a 6-digit Game PIN and joinmyquiz.com URL. Students type this PIN on their devices to enter the lobby.',
        },
        selfText: {
          bm: 'Klik Start Live Quiz > Paparkan kod PIN pada projektor > Tekan Start.',
          en: 'Click Start Live Quiz > Project the PIN onto screen > Click Start.',
        },
        tip: {
          bm: 'Jika murid tiada peranti, gunakan Quizizz Paper Mode dengan mencetak kad jawapan QR berlamina.',
          en: 'If students lack devices, use Quizizz Paper Mode by scanning laminated QR answer cards.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'gamified-quiz',
      taskTitle: {
        bm: 'Simulasi Paparan Kuiz Gamifikasi',
        en: 'Gamified Quiz Interaction Sandbox',
      },
      taskGoal: {
        bm: 'Alami sendiri bagaimana maklum balas visual dan masa membuatkan murid teruja untuk belajar.',
        en: 'Experience how instant visual gratification and timers kindle learner eagerness.',
      },
      guidelines: [
        {
          bm: 'Pastikan soalan tidak terlalu panjang agar murid tidak kehabisan masa sebelum sempat membaca.',
          en: 'Keep questions concise so younger learners do not run out of clock before finishing reading.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah kelebihan utama ciri "Teleport" dalam platform seperti Quizizz untuk guru?',
          en: 'What is the premier advantage of the "Teleport" feature in platforms like Quizizz?',
        },
        options: [
          { bm: 'Memindahkan guru ke bilik darjah lain secara magik', en: 'Teleporting teachers physically across classrooms' },
          { bm: 'Membolehkan guru mencari dan meminjam soalan berkualiti yang telah disahkan oleh rakan guru lain dalam sesaat', en: 'Allows teachers to search and import high-quality questions created by other educators in seconds' },
          { bm: 'Mematikan komputer murid yang bising', en: 'Forcibly shutting down noisy student laptops' },
          { bm: 'Menghantar markah terus ke akaun bank', en: 'Depositing bonus marks to bank accounts' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Fungsi Teleport menjimatkan masa persediaan dengan membolehkan guru memilih soalan terbaik dari bank soalan komuniti pendidikan seluruh dunia.',
          en: 'Teleport saves immense preparation time by allowing teachers to cherry-pick proven questions from the global educator question repository.',
        },
      },
    ],
  },

  {
    id: 'digital-educational-games',
    slug: 'digital-educational-games',
    category: 'interactive',
    level: 'beginner',
    estimatedMinutes: 16,
    iconName: 'Dices',
    toolBadge: 'Wordwall',
    title: {
      bm: 'Permainan Digital Pendidikan untuk Penglibatan Murid (Wordwall)',
      en: 'Educational Digital Games with Wordwall (Spin Wheels, Match-Up)',
    },
    description: {
      bm: 'Cipta roda putaran (Spin the Wheel), padanan kad (Match up), dan buka kotak (Open the Box) hanya dengan memasukkan satu senarai soalan.',
      en: 'Create spinning wheels, card match-ups, and box-opening games simply by entering one question list.',
    },
    understand: {
      concept: {
        bm: 'Wordwall ialah alat interaktif yang luar biasa fleksibel. Guru hanya perlu memasukkan satu senarai kata kunci atau soalan sekali sahaja, dan sistem boleh menukarkannya kepada 10 jenis permainan berbeza (Roda Putaran, Cari Padanan, Labirin, Belon) dengan hanya satu klik butang.',
        en: 'Wordwall is exceptionally versatile. A teacher types a list of vocabulary or questions once, and the system transforms that exact data into 10 different playable games (Spin Wheel, Match Up, Maze Chase, Balloon Pop) with a single click.',
      },
      whyItMatters: {
        bm: 'Sangat sesuai untuk set induksi 3 minit yang mencuit perhatian murid, atau aktiviti murid di papan pintar (Smartboard) di mana murid tampil ke hadapan memusing roda giliran.',
        en: 'Perfect for a 3-minute set induction hook, or interactive smartboard sessions where students step up to spin the tactile wheel.',
      },
      keyTakeaways: [
        {
          bm: 'Satu set soalan boleh dimainkan dalam pelbagai templat permainan tanpa perlu menaip semula.',
          en: 'One question dataset converts into multiple mini-games without retyping.',
        },
        {
          bm: 'Roda Putaran (Spin the Wheel) sangat popular untuk memilih murid secara adil dan seronok.',
          en: 'Spin the Wheel is legendary for picking student speakers randomly with joyful suspense.',
        },
        {
          bm: 'Boleh dicetak (Printable worksheets) dengan susun atur automatik jika tiada sambungan internet di sekolah.',
          en: 'Can be printed as clean physical paper worksheets if school internet goes down.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Membina 5 Permainan Digital Dari 1 Senarai Soalan Menggunakan Wordwall',
        en: 'Generating 5 Interactive Games from 1 List Using Wordwall',
      },
      duration: '06:40',
      chapters: [
        { time: '00:00', label: { bm: 'Memasukkan Pasangan Soalan & Jawapan', en: 'Entering Question & Answer Pairs' } },
        { time: '02:15', label: { bm: 'Menukar Templat (Roda vs Padanan)', en: 'Switching Templates with 1 Click' } },
        { time: '04:30', label: { bm: 'Menggunakan Wordwall di Papan Pintar', en: 'Smartboard Touchscreen Optimization' } },
      ],
      keyHighlights: [
        {
          bm: 'Akaun asas Wordwall membolehkan guru membina 5 aktiviti percuma dengan fungsi penuh.',
          en: 'Free Wordwall accounts grant 5 fully functional interactive activity slots.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Memilih Templat Permainan Pertama',
          en: 'Select Your Initial Game Template',
        },
        guidedText: {
          bm: 'Layari wordwall.net > Log masuk dengan emel Google/DELIMa anda > Klik butang biru "Create Activity" > Pilih templat "Random Wheel" (Roda Rawak) atau "Match up" (Padankan).',
          en: 'Go to wordwall.net > Sign in with Google > Click "Create Activity" > Select "Random Wheel" or "Match up".',
        },
        selfText: {
          bm: 'Buka Wordwall > Create Activity > Pilih templat kegemaran anda.',
          en: 'Open Wordwall > Create Activity > Choose your preferred template.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Memasukkan Kandungan & Menukar Tema Permainan',
          en: 'Enter Items and Switch Visual Themes',
        },
        guidedText: {
          bm: 'Taip nama murid atau soalan kuiz ke dalam senarai. Klik "Done". Di bawah permainan yang terhasil, lihat bahagian "Switch Template" di sebelah kanan. Klik ikon lain (contoh: "Open the Box") untuk melihat permainan anda bertukar format dalam 1 saat.',
          en: 'Enter student names or lesson terms into the list. Click "Done". Below the playable preview, look at the "Switch Template" menu on the right. Click "Open the Box" to see your identical content transformed instantly into a game show.',
        },
        selfText: {
          bm: 'Taip senarai > Klik Done > Cuba klik "Switch template" di panel kanan.',
          en: 'Type items > Click Done > Test "Switch template" on right panel.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'game-switcher',
      taskTitle: {
        bm: 'Uji Penukaran Format Permainan',
        en: 'Game Format Switcher Preview',
      },
      taskGoal: {
        bm: 'Lihat bagaimana data soalan yang sama boleh disampaikan dalam pelbagai bentuk interaktif.',
        en: 'Discover how identical questions adapt into diverse interactive mini-games.',
      },
      guidelines: [
        {
          bm: 'Gunakan Roda Putaran untuk sesi soal jawab lisan murid.',
          en: 'Deploy the Spin Wheel for spontaneous oral recitation sessions.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah keistimewaan terbesar platform Wordwall berbanding pembina kuiz biasa?',
          en: 'What is Wordwall\'s standout advantage over ordinary quiz builders?',
        },
        options: [
          { bm: 'Perlu membayar bil elektrik sekolah', en: 'Paying the school electricity bill' },
          { bm: 'Satu senarai soalan yang sama boleh ditukar serta-merta kepada pelbagai jenis permainan dengan satu klik', en: 'A single dataset transforms instantly into various game formats with one click' },
          { bm: 'Hanya boleh dibuka pada waktu malam', en: 'Only accessible late at night' },
          { bm: 'Memadam soalan selepas 10 minit', en: 'Erasing questions automatically after 10 minutes' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Ciri penukaran templat dinamik (Switch Template) Wordwall membolehkan guru mengitar semula bahan ke pelbagai permainan tanpa beban kerja berganda.',
          en: 'Dynamic template switching lets teachers repurpose learning materials into fresh formats without extra work.',
        },
      },
    ],
  },

  {
    id: 'interactive-presentations-mentimeter',
    slug: 'interactive-presentations-mentimeter',
    category: 'interactive',
    level: 'intermediate',
    estimatedMinutes: 18,
    iconName: 'Tv',
    toolBadge: 'Mentimeter',
    title: {
      bm: 'Persembahan Interaktif dengan Maklum Balas Langsung (Mentimeter / Slido)',
      en: 'Interactive Presentations with Live Polling (Mentimeter / Slido)',
    },
    description: {
      bm: 'Cipta awan perkataan (Word Cloud) langsung, undian pendapat, dan soalan terbuka yang dijawab oleh murid menggunakan telefon pintar.',
      en: 'Generate live word clouds, opinion polls, and open-ended Q&As answered in real-time by students on devices.',
    },
    understand: {
      concept: {
        bm: 'Persembahan tradisional satu hala sering menyebabkan murid pasif dan mengantuk. Dengan alat seperti Mentimeter, setiap slaid mempunyai soalan interaktif di mana murid mengundi atau menaip jawapan, dan hasilnya muncul terus di skrin projektor dalam bentuk graf animasi atau awan perkataan yang memukau.',
        en: 'One-way lectures frequently lull classrooms into passive slumber. With Mentimeter, every slide embeds an interactive probe where learners submit votes or words, appearing on the projected screen as a dynamic live word cloud.',
      },
      whyItMatters: {
        bm: 'Semua murid—termasuk murid pemalu yang tidak berani mengangkat tangan—diberi suara yang sama rata. Guru boleh menilai tahap pemahaman emosi dan akademik seluruh kelas dalam 30 saat.',
        en: 'Every student—especially reserved learners who shy away from raising their hands—enjoys an equal voice. Teachers gauge whole-class comprehension within 30 seconds.',
      },
      keyTakeaways: [
        {
          bm: 'Word Cloud: Perkataan yang kerap ditaip oleh ramai murid akan membesar di tengah skrin secara langsung.',
          en: 'Word Clouds dynamically enlarge terms submitted most frequently by students.',
        },
        {
          bm: 'Murid menyertai dengan melayari menti.com dan menaip kod PIN 8-digit tanpa perlu mendaftar akaun.',
          en: 'Students join via menti.com and an 8-digit PIN with zero app downloads or accounts required.',
        },
        {
          bm: 'Sangat berkesan untuk aktiviti "Parking Lot" soalan dan semakan emosi murid (Social-Emotional Check-in).',
          en: 'Ideal for classroom "Parking Lots" and quick social-emotional well-being check-ins.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Membina Awan Perkataan (Word Cloud) Langsung & Undian Pendapat Mentimeter',
        en: 'Building Live Word Clouds and Class Polls with Mentimeter',
      },
      duration: '07:50',
      chapters: [
        { time: '00:00', label: { bm: 'Memahami Kuasa Awan Perkataan', en: 'The Magic of Live Word Clouds' } },
        { time: '02:20', label: { bm: 'Membina Slaid Undian (Multiple Choice vs Word Cloud)', en: 'Crafting Question Slides' } },
        { time: '04:45', label: { bm: 'Mengawal Paparan & Mengunci Undian', en: 'Facilitator Controls & Locking Submissions' } },
      ],
      keyHighlights: [
        {
          bm: 'Guru boleh menapis perkataan yang tidak sopan menggunakan ciri "Profanity Filter" automatik.',
          en: 'Teachers can automatically filter inappropriate slang using the built-in Profanity Filter.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Membina Slaid Awan Perkataan (Word Cloud)',
          en: 'Assemble a Word Cloud Slide',
        },
        guidedText: {
          bm: 'Buka mentimeter.com > Klik "New presentation" > Pilih jenis slaid "Word Cloud". Taip soalan pemula, contohnya: "Dalam 1 perkataan, apakah perasaan anda tentang topik hari ini?" atau "Sebutkan satu contoh haiwan herbivor."',
          en: 'Go to mentimeter.com > Click "New presentation" > Select "Word Cloud" slide type. Enter your inquiry, e.g., "In one word, summarize today\'s science concept" or "Name one herbivorous mammal."',
        },
        selfText: {
          bm: 'New presentation > Pilih Word Cloud > Masukkan soalan pemula.',
          en: 'New presentation > Select Word Cloud > Enter prompt inquiry.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Memaparkan Keputusan Langsung di Skrin',
          en: 'Project Live Responses in Real Time',
        },
        guidedText: {
          bm: 'Tekan butang biru "Present" di penjuru kanan atas. Skrin akan memaparkan arahan jelas di bahagian atas: "Go to www.menti.com and use the code [Nombor PIN]". Semasa murid menaip di peranti mereka, perkataan akan terus terapung dan membesar di skrin projektor.',
          en: 'Click "Present" in the top-right. The screen projects clear instructions: "Go to www.menti.com and enter code [PIN]". As learners submit responses, words immediately animate and blossom across the screen.',
        },
        selfText: {
          bm: 'Klik Present > Paparkan menti.com & Kod PIN kepada kelas.',
          en: 'Click Present > Display menti.com instructions & Game PIN.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'word-cloud',
      taskTitle: {
        bm: 'Simulasi Awan Perkataan Murid',
        en: 'Live Word Cloud Simulation Studio',
      },
      taskGoal: {
        bm: 'Ketahui bagaimana perkataan yang kerap ditaip murid membentuk visual pemahaman kelas secara spontan.',
        en: 'See how frequent terms dynamically enlarge to showcase whole-class consensus.',
      },
      guidelines: [
        {
          bm: 'Beri peluang kepada murid melihat pandangan rakan mereka tanpa rasa dinilai.',
          en: 'Offer pupils a safe arena to voice ideas without feeling judged.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Apakah yang berlaku kepada saiz sesuatu perkataan dalam Mentimeter Word Cloud apabila ramai murid memasukkan perkataan yang sama?',
          en: 'What happens to a word in a Mentimeter Word Cloud when multiple students submit identical words?',
        },
        options: [
          { bm: 'Perkataan itu akan terpadam dari skrin', en: 'The word disappears from the screen' },
          { bm: 'Perkataan itu akan membesar dan berada di tengah secara automatik', en: 'The word automatically grows larger and moves toward the center' },
          { bm: 'Komputer akan berbunyi loceng', en: 'The computer triggers an alarm' },
          { bm: 'Skrin bertukar menjadi hitam', en: 'The screen turns completely dark' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Semakin kerap perkataan diulang oleh murid, semakin besar saiz fonnya, membolehkan guru melihat kata sepakat atau salah faham utama kelas dalam sekelip mata.',
          en: 'The more frequently a word is submitted, the larger its typographic presence, highlighting consensus or common misconceptions instantly.',
        },
      },
    ],
  },

  {
    id: 'classroom-engagement-activities',
    slug: 'classroom-engagement-activities',
    category: 'interactive',
    level: 'intermediate',
    estimatedMinutes: 15,
    iconName: 'MessageSquareText',
    toolBadge: 'Padlet & Exit Ticket',
    title: {
      bm: 'Aktiviti Penglibatan Murid Digital (Exit Tickets & Papan Minda Kolaboratif)',
      en: 'Digital Classroom Engagement: Exit Tickets & Collaborative Boards',
    },
    description: {
      bm: 'Gunakan Padlet untuk aktiviti sumbang saran, dinding nota melekit digital (digital sticky notes), dan tiket keluar kelas (Exit Ticket).',
      en: 'Utilize Padlet for group brainstorming, digital sticky note walls, and frictionless lesson Exit Tickets.',
    },
    understand: {
      concept: {
        bm: 'Padlet ialah papan kenyataan maya di mana seluruh murid boleh menampal nota teks, gambar, rakaman suara atau pautan secara serentak. Ciri "Exit Ticket" (Tiket Keluar) membolehkan murid menjawab satu soalan refleksi ringkas sebelum tamat sesi pembelajaran.',
        en: 'Padlet operates as a virtual corkboard where every pupil posts notes, drawings, photos, or voice memos synchronously. An Exit Ticket lets learners submit a 30-second reflection before the bell rings.',
      },
      whyItMatters: {
        bm: 'Guru tidak perlu lagi mengutip dan mengira kertas memo kecil fizikal yang mudah hilang. Semua idea murid tersimpan rapi dalam arkib digital yang boleh ditunjukkan sewaktu mesyuarat panitia.',
        en: 'Teachers no longer scramble to collect tiny paper post-its that easily get lost. All student thinking is archived digitally to review or present at departmental meetings.',
      },
      keyTakeaways: [
        {
          bm: 'Format Lajur (Shelf / Columns): Susun mengikut kumpulan murid (Kumpulan 1, Kumpulan 2, dll).',
          en: 'Shelf/Column layout: Organize submissions cleanly by student groups (Team 1, Team 2, etc.).',
        },
        {
          bm: 'Mod Moderasi: Hidupkan "Require Approval" sekiranya anda mahu menyemak mesej murid sebelum dipaparkan secara umum.',
          en: 'Moderation mode: Enable "Require Approval" to review student posts before they appear publicly.',
        },
        {
          bm: 'Murid boleh memberi komen membina (peer feedback) dan meletakkan "Like" pada nota rakan.',
          en: 'Learners can post constructive peer comments and react with likes.',
        },
      ],
    },
    watch: {
      videoTitle: {
        bm: 'Menyediakan Dinding Padlet Interaktif & Tiket Keluar Dalam Masa 5 Minit',
        en: 'Setting Up an Interactive Padlet Wall & Digital Exit Ticket in 5 Mins',
      },
      duration: '06:10',
      chapters: [
        { time: '00:00', label: { bm: 'Memilih Format Papan Padlet', en: 'Selecting Padlet Board Formats' } },
        { time: '02:15', label: { bm: 'Tetapan Keselamatan & Moderasi Guru', en: 'Safety Settings & Content Moderation' } },
        { time: '04:10', label: { bm: 'Berkongsi Pautan QR Code Kepada Murid', en: 'Sharing QR Code Links with Pupils' } },
      ],
      keyHighlights: [
        {
          bm: 'Gunakan butang "Share" > "Get QR Code" dan paparkan kod QR di hadapan kelas untuk imbasan pantas peranti.',
          en: 'Click "Share" > "Get QR Code" and project the code on the screen for instant student scanning.',
        },
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: {
          bm: 'Mencipta Papan Padlet Baharu',
          en: 'Create a Fresh Padlet Canvas',
        },
        guidedText: {
          bm: 'Buka padlet.com > Log masuk > Klik butang "Make a Padlet". Pilih susun atur "Wall" (Dinding Bebas) atau "Stream" (Aliran Menegak). Masukkan tajuk: "Refleksi Akhir Kelas Sains" dan huraian ringkas.',
          en: 'Visit padlet.com > Log in > Click "Make a Padlet". Choose the "Wall" or "Stream" layout. Enter your title: "Science End-of-Lesson Exit Ticket" with a brief guiding prompt.',
        },
        selfText: {
          bm: 'Buka Padlet > Make a Padlet > Pilih Wall / Stream > Namakan papan refleksi anda.',
          en: 'Open Padlet > Make a Padlet > Select Wall / Stream > Name your board.',
        },
      },
      {
        stepNumber: 2,
        title: {
          bm: 'Menghidupkan Ciri Moderasi Komen',
          en: 'Enable Content Moderation Controls',
        },
        guidedText: {
          bm: 'Klik ikon gear Tetapan (Settings) di sebelah kanan. Skrol ke bahagian "Content". Hidupkan suis "Require Approval" dan "Filter Profanity". Ini memastikan tiada komen yang tidak wajar terpapar tanpa kebenaran guru.',
          en: 'Click the Settings gear on the right toolbar. Scroll to the "Content" section. Toggle ON "Require Approval" and "Filter Profanity". This guarantees no inappropriate comments appear on the projector without your explicit approval.',
        },
        selfText: {
          bm: 'Settings > Content > Hidupkan "Require approval" untuk menyemak sebelum tayang.',
          en: 'Settings > Content > Toggle ON "Require approval" for teacher sign-off.',
        },
        tip: {
          bm: 'Murid boleh menekan butang (+) berwarna merah jambu di penjuru kanan bawah untuk menambah nota mereka.',
          en: 'Students simply click the pink (+) button at bottom right to pin their thoughts.',
        },
      },
    ],
    tryIt: {
      sandboxType: 'collab-board',
      taskTitle: {
        bm: 'Simulasi Papan Minda Kolaboratif',
        en: 'Collaborative Board Simulation Studio',
      },
      taskGoal: {
        bm: 'Ketahui bagaimana nota digital murid tersusun mengikut lajur perbincangan secara langsung.',
        en: 'Discover how student ideas populate categorized columns in real-time.',
      },
      guidelines: [
        {
          bm: 'Gunakan soalan 3-2-1: 3 perkara dipelajari, 2 perkara menarik, 1 soalan yang masih belum difahami.',
          en: 'Adopt the 3-2-1 formula: 3 things learned, 2 interesting discoveries, 1 unresolved question.',
        },
      ],
    },
    quiz: [
      {
        question: {
          bm: 'Mengapakah ciri "Require Approval" dalam Padlet sangat berguna untuk pengurusan bilik darjah?',
          en: 'Why is the "Require Approval" toggle in Padlet so valuable for classroom management?',
        },
        options: [
          { bm: 'Untuk mengenakan bayaran kepada murid yang menulis nota', en: 'To charge money per note written' },
          { bm: 'Membolehkan guru meneliti dan meluluskan setiap catatan murid sebelum ia dipaparkan pada skrin umum projektor', en: 'Allows the teacher to review and approve every student entry before it appears on the public projection screen' },
          { bm: 'Menghalang murid daripada belajar', en: 'To prevent pupils from learning' },
          { bm: 'Menghantar nota murid kepada pihak polis', en: 'To forward notes to external authorities' },
        ],
        correctAnswer: 1,
        explanation: {
          bm: 'Fungsi "Require Approval" memberi guru kawalan penuh terhadap persekitaran bilik darjah yang selamat, bermaruah dan membina.',
          en: 'The "Require Approval" feature ensures a safe, respectful, and constructive classroom environment without disruptive surprises.',
        },
      },
    ],
  },
];
