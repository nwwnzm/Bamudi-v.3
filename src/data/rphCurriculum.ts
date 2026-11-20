export interface SubjectCurriculum {
  id: string;
  name: { bm: string; en: string };
  levels: {
    levelId: string;
    levelName: { bm: string; en: string };
    topics: {
      id: string;
      title: { bm: string; en: string };
      contentStandard: string;
      learningStandard: string;
      suggestedObjectives: { bm: string[]; en: string[] };
      suggestedSuccessCriteria: { bm: string[]; en: string[] };
      defaultActivities: {
        setInduction: { bm: string; en: string };
        mainActivities: { bm: string[]; en: string[] };
        closure: { bm: string; en: string };
      };
      suggestedAids: string[];
      emk: string[];
    }[];
  }[];
}

export const RPH_CURRICULUM_DATA: SubjectCurriculum[] = [
  {
    id: 'bm',
    name: { bm: 'Bahasa Melayu', en: 'Malay Language' },
    levels: [
      {
        levelId: 't1',
        levelName: { bm: 'Tingkatan 1', en: 'Form 1' },
        topics: [
          {
            id: 'bm-t1-karangan',
            title: { bm: 'Penulisan Karangan Fakta (Gaya Hidup Sihat)', en: 'Factual Essay Writing (Healthy Lifestyle)' },
            contentStandard: '3.4 Menulis untuk menghasilkan prosa secara terancang.',
            learningStandard: '3.4.1 Membina kerangka penulisan dan menghasilkan karangan format fakta yang koheren.',
            suggestedObjectives: {
              bm: [
                'Menyenaraikan sekurang-kurangnya 3 isi penting berkaitan amalan gaya hidup sihat.',
                'Menulis sebuah perenggan pendahuluan dan satu perenggan isi dengan kosa kata tepat.',
              ],
              en: [
                'List at least 3 key ideas related to healthy lifestyle habits.',
                'Compose an introductory paragraph and one body paragraph using accurate vocabulary.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat melengkapkan peta minda punca dan amalan gaya hidup sihat.',
                'Murid dapat menggunakan sekurang-kurangnya 2 penanda wacana yang sesuai dalam perenggan isi.',
              ],
              en: [
                'Students can complete a mind map of healthy lifestyle practices.',
                'Students use at least 2 appropriate cohesive devices in their body paragraph.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru menayangkan klip video pendek aktiviti riadah dan bersoal jawab dengan murid tentang kepentingan kesihatan fizikal.',
                en: 'Teacher shows a short video clip of exercise routines and initiates discussion on physical wellbeing.',
              },
              mainActivities: {
                bm: [
                  'Aktiviti Sumbang Saran (Think-Pair-Share): Murid berbincang dalam pasangan untuk menyenaraikan isi penting.',
                  'Aktiviti Kumpulan (Gallery Walk): Setiap kumpulan menulis draf perenggan isi pada kertas sebak dan menampal di stesen.',
                  'Sesi Semakan Rakan Sebaya: Murid menyemak ejaan dan struktur ayat kumpulan lain menggunakan senarai semak ringkas.',
                ],
                en: [
                  'Think-Pair-Share Brainstorming: Students discuss in pairs to list core essay points.',
                  'Gallery Walk: Groups draft body paragraphs on mahjong paper and pin them at stations.',
                  'Peer Editing: Students check grammar and sentence structure using a quick peer rubric.',
                ],
              },
              closure: {
                bm: 'Murid merumuskan nilai murni yang dipelajari dan menjawab soalan tiket keluar (Exit Ticket).',
                en: 'Students summarize learned moral values and submit an exit ticket reflection.',
              },
            },
            suggestedAids: ['Buku Teks', 'Kertas Sebak / Papan Putih Mini', 'Projektor LCD', 'Lembaran Kerja'],
            emk: ['Nilai Murni', 'Kelestarian Global', 'Bahasa'],
          },
          {
            id: 'bm-t1-tatabahasa',
            title: { bm: 'Tatabahasa: Kata Ganda Penuh & Berimbuhan', en: 'Grammar: Reduplicated Words' },
            contentStandard: '5.1 Memahami dan menggunakan perkataan daripada pelbagai golongan kata.',
            learningStandard: '5.1.3 Mengenal pasti dan menggunakan kata ganda penuh dan berimbuhan mengikut konteks.',
            suggestedObjectives: {
              bm: [
                'Mengenal pasti sekurang-kurangnya 4 kata ganda dalam petikan yang dibaca.',
                'Membina 3 ayat majmuk menggunakan kata ganda yang dipilih dengan betul.',
              ],
              en: [
                'Identify at least 4 reduplicated words in the reading excerpt.',
                'Construct 3 compound sentences using selected reduplicated words correctly.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat mengelaskan kata ganda mengikut jenis dalam jadual pengelasan.',
                'Murid dapat membina ayat gramatis tanpa kesalahan tanda baca.',
              ],
              en: [
                'Students can categorize reduplicated words into their correct types in a chart.',
                'Students construct grammatical sentences with correct punctuation.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Permainan teka kata pantas: Guru memaparkan kad imbasan kata ganda seperti "kanak-kanak" dan "gunung-ganang".',
                en: 'Quick word-guessing game: Teacher displays flashcards of reduplicated words.',
              },
              mainActivities: {
                bm: [
                  'Membaca petikan berita secara intensif untuk menggariskan kata ganda.',
                  'Aktiviti Meja Bulat (Round Robin): Setiap ahli menulis ayat sendiri menggunakan kata ganda berbeza.',
                  'Guru memberi peneguhan dan membetulkan kekeliruan struktur ayat secara interaktif.',
                ],
                en: [
                  'Close reading of a news article to highlight target words.',
                  'Round Robin activity: Each member constructs a sentence with a different word.',
                  'Teacher clarifies sentence structure and provides targeted positive feedback.',
                ],
              },
              closure: {
                bm: 'Kuiz pantas 3 soalan di papan putih mini untuk menilai kefahaman konsep.',
                en: 'Rapid 3-question mini-whiteboard quiz to gauge conceptual retention.',
              },
            },
            suggestedAids: ['Kad Imbasan', 'Papan Putih Mini', 'Lembaran Latihan'],
            emk: ['Bahasa', 'Pendidikan Nilai'],
          },
        ],
      },
      {
        levelId: 't4',
        levelName: { bm: 'Tingkatan 4', en: 'Form 4' },
        topics: [
          {
            id: 'bm-t4-rumusan',
            title: { bm: 'Kemahiran Merumus (Fokus 1 & Fokus 2)', en: 'Summary Writing Skills' },
            contentStandard: '3.5 Mengaplikasikan maklumat daripada pelbagai bahan untuk menghasilkan rumusan.',
            learningStandard: '3.5.1 Menulis rumusan lengkap tidak melebihi 120 patah perkataan dengan mengekalkan maksud asal.',
            suggestedObjectives: {
              bm: [
                'Mengenal pasti sekurang-kurangnya 4 isi tersurat (Fokus 1 dan Fokus 2) daripada petikan bahan.',
                'Menulis perenggan pendahuluan rumusan mengikut formula format standard SPM.',
              ],
              en: [
                'Identify at least 4 explicit points across Focus 1 and Focus 2.',
                'Write an introductory summary paragraph adhering to the SPM rubric.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat menggariskan kata kunci fokus dalam bahan 1 dan bahan 2.',
                'Murid dapat menghasilkan rumusan ringkas yang tidak melebihi had patah perkataan.',
              ],
              en: [
                'Students highlight focal keywords in source materials.',
                'Students produce a concise summary within the word limit.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru memaparkan infografik isu semasa dan meminta murid meringkaskannya dalam 1 ayat.',
                en: 'Teacher displays a current affairs infographic and asks students to summarize it in 1 sentence.',
              },
              mainActivities: {
                bm: [
                  'Menganalisis petikan menggunakan teknik penanda warna (merah untuk fokus 1, biru untuk fokus 2).',
                  'Latihan menulis rumusan terbimbing berpasangan mengikut perenggan.',
                  'Pembentangan wakil kumpulan dan semakan rubrik bersama guru.',
                ],
                en: [
                  'Color-coded source analysis (red for focus 1, blue for focus 2).',
                  'Paired guided summary drafting by paragraph.',
                  'Group presentations and collaborative rubric cross-checks.',
                ],
              },
              closure: {
                bm: 'Refleksi kendiri murid terhadap ketepatan jumlah patah perkataan dan isi penting.',
                en: 'Self-reflection check on word count precision and salient points.',
              },
            },
            suggestedAids: ['Modul Latihan Rumusan', 'Pen Penyerlah Berwarna', 'Slaid Panduan'],
            emk: ['Kemahiran Berfikir Aras Tinggi (KBAT)', 'Bahasa'],
          },
        ],
      },
      {
        levelId: 'y4',
        levelName: { bm: 'Tahun 4 (Rendah)', en: 'Year 4 (Primary)' },
        topics: [
          {
            id: 'bm-y4-bina-ayat',
            title: { bm: 'Membina Ayat Berdasarkan Gambar Tunggal', en: 'Sentence Construction from Pictures' },
            contentStandard: '3.2 Menulis perkataan, frasa, dan ayat yang bermakna.',
            learningStandard: '3.2.1 Membina dan menulis ayat tunggal dan ayat majmuk daripada bahan rangsangan.',
            suggestedObjectives: {
              bm: [
                'Membina 4 ayat lengkap berdasarkan kata kerja yang terdapat dalam gambar.',
                'Menulis ayat dengan ejaan dan tanda baca yang betul.',
              ],
              en: [
                'Construct 4 complete sentences based on observed action verbs.',
                'Write sentences with proper spelling and punctuation.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat mengenal pasti subjek, kata kerja, dan objek (SKOP).',
                'Murid dapat menulis ayat yang bermakna tanpa kesalahan ejaan asas.',
              ],
              en: [
                'Students identify Subject, Verb, Object, and Predicate correctly.',
                'Students write meaningful sentences free from basic spelling errors.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Aktiviti aksi pantun: Murid melakonkan aksi dalam gambar dan rakan meneka kata kerja yang terlibat.',
                en: 'Action charades: A student mimes an action and classmates guess the verb.',
              },
              mainActivities: {
                bm: [
                  'Penerokaan gambar bersiri di stesen pembelajaran menggunakan teknik jadual SKOP.',
                  'Murid menulis ayat dalam buku latihan dengan bimbingan rakan sebaya.',
                  'Guru membetulkan struktur ayat secara langsung di papan tulis.',
                ],
                en: [
                  'Picture investigation stations using sentence expansion scaffolds.',
                  'Students write sentences in exercise books with peer guidance.',
                  'Teacher reviews and reinforces accurate sentence models on the board.',
                ],
              },
              closure: {
                bm: 'Tiga murid dipilih secara rawak membaca ayat terbaik yang telah dibina.',
                en: 'Three students randomly share their best sentences with the class.',
              },
            },
            suggestedAids: ['Gambar Rangsangan Bersaiz Besar', 'Kad Kata Kerja', 'Buku Latihan'],
            emk: ['Kreativiti dan Inovasi', 'Bahasa'],
          },
        ],
      },
    ],
  },
  {
    id: 'matematik',
    name: { bm: 'Matematik', en: 'Mathematics' },
    levels: [
      {
        levelId: 't1',
        levelName: { bm: 'Tingkatan 1', en: 'Form 1' },
        topics: [
          {
            id: 'math-t1-integers',
            title: { bm: 'Nombor Nisbah: Operasi Asas Integer', en: 'Rational Numbers: Basic Integer Operations' },
            contentStandard: '1.2 Operasi asas aritmetik yang melibatkan integer.',
            learningStandard: '1.2.1 Menambah dan menolak integer menggunakan garis nombor atau kaedah lain yang sesuai.',
            suggestedObjectives: {
              bm: [
                'Menyelesaikan sekurang-kurangnya 5 daripada 6 soalan penambahan dan penolakan integer dengan tepat.',
                'Menjelaskan konsep integer negatif dalam situasi dunia sebenar (cth: suhu, paras laut).',
              ],
              en: [
                'Solve at least 5 out of 6 integer addition and subtraction problems accurately.',
                'Explain negative integers in real-life contexts (e.g. temperature, sea level).',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat melakar garis nombor bagi mewakili operasi integer.',
                'Murid dapat menggunakan hukum tanda kurung (+ x - = -) dengan betul.',
              ],
              en: [
                'Students plot a number line representing integer operations.',
                'Students apply bracket sign rules accurately.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru memaparkan simulator paras lif bawah tanah dan bumbung bangunan untuk merangsang konsep nombor positif dan negatif.',
                en: 'Teacher shows an elevator simulator traveling between rooftop and basement floors.',
              },
              mainActivities: {
                bm: [
                  'Penerangan konsep menggunakan cip dua warna (merah untuk positif, biru untuk negatif).',
                  'Latihan berpasangan menyelesaikan soalan operasi bercampur.',
                  'Pertandingan kuiz interaktif pantas di papan putih mini.',
                ],
                en: [
                  'Concept demonstration using dual-color integer counters.',
                  'Paired practice solving mixed operations problems.',
                  'Rapid interactive mini-whiteboard group competition.',
                ],
              },
              closure: {
                bm: 'Murid menyimpulkan peraturan tanda dalam penambahan dan penolakan integer.',
                en: 'Students summarize signs rules in integer addition and subtraction.',
              },
            },
            suggestedAids: ['Cip Dua Warna', 'Pembaris Garis Nombor', 'Lembaran Soalan'],
            emk: ['Sains & Teknologi', 'Penaakulan Matematik'],
          },
        ],
      },
      {
        levelId: 't2',
        levelName: { bm: 'Tingkatan 2', en: 'Form 2' },
        topics: [
          {
            id: 'math-t2-pythagoras',
            title: { bm: 'Teorem Pythagoras & Aplikasinya', en: 'Pythagoras Theorem & Real Applications' },
            contentStandard: '13.1 Teorem Pythagoras.',
            learningStandard: '13.1.2 Menentukan panjang sisi yang tidak diketahui bagi segi tiga bersudut tegak.',
            suggestedObjectives: {
              bm: [
                'Menyatakan hubungan hipotenus dengan sisi lain bagi segi tiga bersudut tegak (c² = a² + b²).',
                'Mengira panjang hipotenus bagi 3 contoh segi tiga dengan betul.',
              ],
              en: [
                'State the relationship between hypotenuse and adjacent sides (c² = a² + b²).',
                'Calculate the hypotenuse length for 3 triangles accurately.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat mengenal pasti sisi hipotenus dengan tepat.',
                'Murid dapat mengaplikasikan rumus c = √(a² + b²) langkah demi langkah.',
              ],
              en: [
                'Students accurately locate the hypotenuse opposite the right angle.',
                'Students apply c = √(a² + b²) step-by-step.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Aktiviti amali guntingan kertas: Membuktikan luas segi empat sama pada hipotenus sama dengan jumlah luas dua segi empat lain.',
                en: 'Paper cutting puzzle: Verifying square areas on hypotenuse equal the sum of adjacent squares.',
              },
              mainActivities: {
                bm: [
                  'Guru membimbing kaedah penggantian nilai ke dalam rumus teorem.',
                  'Aktiviti berpasangan menyelesaikan masalah tangga bersandar pada dinding.',
                  'Penyemakan hasil kerja dengan kalkulator saintifik.',
                ],
                en: [
                  'Teacher models value substitution into the theorem formula.',
                  'Paired real-world problem solving (ladder leaning against a wall).',
                  'Scientific calculator verification workshop.',
                ],
              },
              closure: {
                bm: 'Soalan semakan pantas secara lisan tentang cara mengenal pasti hipotenus.',
                en: 'Oral check on quickly identifying the hypotenuse.',
              },
            },
            suggestedAids: ['Kertas Grid', 'Gunting & Pembaris', 'Kalkulator Saintifik'],
            emk: ['Kreativiti & Inovasi', 'Penaakulan Matematik'],
          },
        ],
      },
      {
        levelId: 'y5',
        levelName: { bm: 'Tahun 5 (Rendah)', en: 'Year 5 (Primary)' },
        topics: [
          {
            id: 'math-y5-fractions',
            title: { bm: 'Pecahan: Penambahan Pecahan Wajar', en: 'Fractions: Addition of Proper Fractions' },
            contentStandard: '2.1 Pecahan.',
            learningStandard: '2.1.1 Menambah hingga tiga nombor melibatkan nombor bulat, pecahan wajar dan nombor bercampur.',
            suggestedObjectives: {
              bm: [
                'Menyamakan penyebut bagi dua pecahan menggunakan kaedah pecahan setara.',
                'Menyelesaikan sekurang-kurangnya 4 soalan penambahan pecahan wajar dengan betul.',
              ],
              en: [
                'Find common denominators using equivalent fraction models.',
                'Solve at least 4 addition problems involving proper fractions.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat menulis pecahan jawapan dalam bentuk termudah.',
                'Murid dapat melukis rajah pecahan bagi mewakili penambahan.',
              ],
              en: [
                'Students simplify fraction answers to lowest terms.',
                'Students draw fraction bars representing the sum.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru memotong kek mainan / kad bulatan kepada bahagian pecahan berbeza untuk mencetuskan rasa ingin tahu.',
                en: 'Teacher cuts toy cake circles to introduce un-equal denominators.',
              },
              mainActivities: {
                bm: [
                  'Penggunaan jalur pecahan magnetik di papan putih.',
                  'Latihan berkumpulan mencari gandaan sepunya terkecil (GSTK).',
                  'Permainan padanan kad soalan dan kad jawapan pecahan termudah.',
                ],
                en: [
                  'Magnetic fraction strips demonstration.',
                  'Group activity finding lowest common multiples.',
                  'Matching card game pairing questions with simplified answers.',
                ],
              },
              closure: {
                bm: 'Refleksi bersama: Mengapa kita mesti menyamakan penyebut sebelum menambah?',
                en: 'Group reflection: Why must denominators be identical before adding?',
              },
            },
            suggestedAids: ['Jalur Pecahan', 'Kad Padanan', 'Buku Aktiviti'],
            emk: ['Kreativiti', 'Penyelesaian Masalah'],
          },
        ],
      },
    ],
  },
  {
    id: 'sains',
    name: { bm: 'Sains', en: 'Science' },
    levels: [
      {
        levelId: 't2',
        levelName: { bm: 'Tingkatan 2', en: 'Form 2' },
        topics: [
          {
            id: 'sc-t2-ecosystem',
            title: { bm: 'Ekosistem: Rangkaian Makanan & Aliran Tenaga', en: 'Ecosystems: Food Webs & Energy Flow' },
            contentStandard: '2.1 Aliran tenaga dalam ekosistem.',
            learningStandard: '2.1.2 Membina siratan makanan dan menerangkan pemindahan tenaga antara organisma.',
            suggestedObjectives: {
              bm: [
                'Membina sekurang-kurangnya satu siratan makanan yang mengandungi 4 rantai makanan berbeza.',
                'Menjelaskan peranan pengeluar, pengguna primer, sekunder, dan pengurai.',
              ],
              en: [
                'Construct at least one food web containing 4 interconnected food chains.',
                'Explain roles of producers, primary consumers, secondary consumers, and decomposers.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat melukis anak panah pemindahan tenaga mengikut arah yang betul.',
                'Murid dapat meramalkan kesan kepupusan satu spesies dalam siratan makanan.',
              ],
              en: [
                'Students draw energy flow arrows in the correct direction.',
                'Students predict ecological impacts if a species goes extinct.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru memaparkan gambar hutan hujan tropika dan bertanya apa yang akan berlaku jika semua rumput mati.',
                en: 'Teacher displays a tropical rainforest photo asking what happens if grass disappears.',
              },
              mainActivities: {
                bm: [
                  'Aktiviti Anyaman Tali (Web of Life): Murid memegang kad haiwan dan tali untuk merasai saling kebergantungan hidupan.',
                  'Melukis siratan makanan kolaboratif di atas kertas mahjong.',
                  'Soalan KBAT: Meramalkan kesan penggunaan racun serangga berlebihan terhadap burung pemangsa.',
                ],
                en: [
                  'Web of Life string activity illustrating interdependence.',
                  'Collaborative food web diagramming on poster paper.',
                  'HOTS challenge: Predicting pesticide accumulation in apex raptors.',
                ],
              },
              closure: {
                bm: 'Rumusan kepentingan menjaga kelestarian biodiversiti alam.',
                en: 'Summary on the critical necessity of preserving biodiversity.',
              },
            },
            suggestedAids: ['Kad Gambar Haiwan & Tumbuhan', 'Segulung Tali', 'Slaid Canva'],
            emk: ['Kelestarian Alam Sekitar', 'Sains & Teknologi'],
          },
        ],
      },
      {
        levelId: 'y6',
        levelName: { bm: 'Tahun 6 (Rendah)', en: 'Year 6 (Primary)' },
        topics: [
          {
            id: 'sc-y6-micro',
            title: { bm: 'Mikroorganisma: Hidupan Seni di Sekeliling Kita', en: 'Microorganisms: Tiny Living Things Around Us' },
            contentStandard: '3.1 Mikroorganisma ialah hidupan.',
            learningStandard: '3.1.2 Memerihalkan proses hidup mikroorganisma melalui penyiasatan (bernafas, bergerak, bertumbuh).',
            suggestedObjectives: {
              bm: [
                'Menyatakan 4 jenis mikroorganisma (Bakteria, Fungi, Protozoa, Virus).',
                'Merekodkan hasil penyiasatan penapaian yis dan penghasilan gas karbon dioksida.',
              ],
              en: [
                'State 4 types of microorganisms (Bacteria, Fungi, Protozoa, Viruses).',
                'Record observation results of yeast respiration inflating a balloon.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat memerhatikan belon mengembang pada botol berisi yis dan air gula.',
                'Murid dapat menyimpulkan bahawa yis bernafas dan membebaskan gas.',
              ],
              en: [
                'Students observe balloon expansion over a bottle of yeast and sugar water.',
                'Students conclude that yeast breathes and emits carbon dioxide.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru menunjukkan sekeping roti berkulat dan sepeket yis kering untuk mencetuskan persoalan adakah ia bernyawa.',
                en: 'Teacher presents moldy bread and active dry yeast to spark life inquiry.',
              },
              mainActivities: {
                bm: [
                  'Eksperimen berkumpulan: Botol plastik, air suam, gula, yis dan belon.',
                  'Mencatat pemerhatian perubahan saiz belon selepas 15 minit dalam jadual laporan amali.',
                  'Perbincangan aplikasi mikroorganisma berfaedah dalam pembuatan roti dan tapai.',
                ],
                en: [
                  'Group experiment: Plastic bottles, warm water, sugar, yeast, and balloons.',
                  'Record balloon circumference changes after 15 minutes in observation tables.',
                  'Discussion on beneficial uses of microorganisms in baking and food fermentation.',
                ],
              },
              closure: {
                bm: 'Menghubungkaitkan kepentingan mencuci tangan dengan pencegahan jangkitan virus.',
                en: 'Connecting handwashing hygiene with virus transmission prevention.',
              },
            },
            suggestedAids: ['Yis, Gula, Air Suam, Belon', 'Kanta Pembesar / Mikroskop', 'Buku Teks Sains'],
            emk: ['Sains & Teknologi', 'Kebersihan & Kesihatan'],
          },
        ],
      },
    ],
  },
  {
    id: 'sejarah',
    name: { bm: 'Sejarah', en: 'History' },
    levels: [
      {
        levelId: 't1',
        levelName: { bm: 'Tingkatan 1', en: 'Form 1' },
        topics: [
          {
            id: 'sej-t1-zaman-air-batu',
            title: { bm: 'Zaman Air Batu & Perubahan Bentuk Muka Bumi', en: 'Ice Age & Landform Transformations' },
            contentStandard: '2.1 Zaman Air Batu.',
            learningStandard: '2.1.3 Menerangkan perubahan Zaman Air Batu Akhir dan kesannya kepada Asia Tenggara.',
            suggestedObjectives: {
              bm: [
                'Menjelaskan sekurang-kurangnya 2 kesan kecairan air batu terhadap Pentas Sunda.',
                'Menyatakan garis masa 4 epok penting dalam Zaman Air Batu.',
              ],
              en: [
                'Explain at least 2 impacts of melting ice sheets on the Sunda Shelf.',
                'Chronicle the timeline of key Ice Age epochs.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat melabelkan kawasan Pentas Sunda pada peta Asia Tenggara.',
                'Murid dapat menghubungkaitkan peningkatan paras laut dengan pembentukan pulau-pulau.',
              ],
              en: [
                'Students label the Sunda Shelf on a Southeast Asia regional map.',
                'Students connect rising sea levels with island formation.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Tayangan animasi ringkas pembentukan glasier dan mamot pada zaman prasejarah.',
                en: 'Short animated clip of glaciers and woolly mammoths in prehistoric times.',
              },
              mainActivities: {
                bm: [
                  'Kajian peta bersejarah Pentas Sunda secara berpasangan.',
                  'Simulasi ais mencair di dalam bekas berpasir untuk melihat perubahan paras air.',
                  'Menghasilkan garis masa kronologi epok menggunakan peta alir.',
                ],
                en: [
                  'Paired analysis of historical Sunda Shelf maps.',
                  'Hands-on melting ice experiment demonstrating coastline retreat.',
                  'Constructing chronological timeline flow maps.',
                ],
              },
              closure: {
                bm: 'Refleksi kesedaran pemanasan global masa kini berdasarkan pengajaran sejarah.',
                en: 'Reflection on modern global warming based on historical lessons.',
              },
            },
            suggestedAids: ['Peta Asia Tenggara', 'Slaid Video', 'Lembaran Peta Alir'],
            emk: ['Kelestarian Global', 'Patriotisme & Geografi'],
          },
        ],
      },
    ],
  },
  {
    id: 'bi',
    name: { bm: 'Bahasa Inggeris', en: 'English Language' },
    levels: [
      {
        levelId: 't1',
        levelName: { bm: 'Form 1 / Tingkatan 1', en: 'Form 1' },
        topics: [
          {
            id: 'bi-t1-speaking',
            title: { bm: 'Speaking: Expressing Preferences & Hobbies', en: 'Speaking: Expressing Preferences & Hobbies' },
            contentStandard: '2.1 Communicate information, ideas, opinions and feelings intelligibly.',
            learningStandard: '2.1.1 Ask about and give detailed information about themselves and their daily routines.',
            suggestedObjectives: {
              bm: [
                'Murid dapat menanyakan 3 soalan tentang hobi rakan menggunakan struktur bahasa yang betul.',
                'Murid dapat berkongsi sekurang-kurangnya 2 minat peribadi beserta alasan sokongan.',
              ],
              en: [
                'Students formulate 3 questions asking about a classmate’s hobby using correct question forms.',
                'Students share at least 2 personal interests with supporting justifications.',
              ],
            },
            suggestedSuccessCriteria: {
              bm: [
                'Murid dapat menggunakan frasa: "I prefer...", "I am keen on...", "Because..." dengan betul.',
                'Murid mengambil bahagian secara aktif dalam aktiviti dialog berpasangan.',
              ],
              en: [
                'Students use target phrases: "I prefer...", "I enjoy...", "Because..." correctly.',
                'Students participate actively in paired conversational exchanges.',
              ],
            },
            defaultActivities: {
              setInduction: {
                bm: 'Guru memaparkan kolaj gambar hobi popular dan meminta murid mengundi hobi pilihan.',
                en: 'Teacher shows a photo montage of hobbies and conducts a quick hand-raise poll.',
              },
              mainActivities: {
                bm: [
                  'Aktiviti Suai Kenal (Speed Dating / Mingling Activity): Murid bergerak dan menemu ramah 3 rakan berbeza.',
                  'Merekodkan maklumat hobi rakan ke dalam jadual soal selidik.',
                  'Dua pasangan terpilih membuat demonstrasi perbualan di hadapan kelas.',
                ],
                en: [
                  'Mingle activity: Students walk around interviewing 3 different classmates.',
                  'Record peers’ responses into survey matrices.',
                  'Volunteer pairs demonstrate their dialogues in front of the class.',
                ],
              },
              closure: {
                bm: 'Sesi rumusan kosa kata baharu dan maklum balas pembetulan sebutan oleh guru.',
                en: 'Vocabulary recap and targeted pronunciation feedback from the teacher.',
              },
            },
            suggestedAids: ['Survey Worksheets', 'Dialogue Cue Cards', 'Visual Slides'],
            emk: ['Language', 'Values & Social Etiquette'],
          },
        ],
      },
    ],
  },
];
