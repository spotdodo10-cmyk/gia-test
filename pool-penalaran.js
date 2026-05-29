// ===== PENALARAN QUESTION POOL =====
// Diambil acak 20 soal setiap sesi.
// Tipe: (1) A lebih X → siapa X?  (2) A lebih X → siapa Y (kebalikan)?
//        (3) A tidak seX → siapa X?  (4) A tidak seX → siapa Y?

const PENALARAN_POOL = [
  // --- BERAT / RINGAN ---
  { statement: 'Tom lebih berat dari Fred.',      question: 'Siapa yang lebih berat?',   choices: ['Tom','Fred'],    answer: 'Tom' },
  { statement: 'Tom lebih berat dari Fred.',      question: 'Siapa yang lebih ringan?',  choices: ['Tom','Fred'],    answer: 'Fred' },
  { statement: 'Ani tidak seberat Budi.',         question: 'Siapa yang lebih berat?',   choices: ['Ani','Budi'],    answer: 'Budi' },
  { statement: 'Ani tidak seberat Budi.',         question: 'Siapa yang lebih ringan?',  choices: ['Ani','Budi'],    answer: 'Ani' },
  { statement: 'Galih lebih berat dari Surya.',   question: 'Siapa yang lebih ringan?',  choices: ['Galih','Surya'], answer: 'Surya' },
  { statement: 'Mita tidak seberat Rika.',        question: 'Siapa yang lebih ringan?',  choices: ['Mita','Rika'],   answer: 'Mita' },
  { statement: 'Lena lebih berat dari Mona.',     question: 'Siapa yang lebih berat?',   choices: ['Lena','Mona'],   answer: 'Lena' },

  // --- TINGGI / PENDEK ---
  { statement: 'Budi lebih tinggi dari Ani.',     question: 'Siapa yang lebih tinggi?',  choices: ['Budi','Ani'],    answer: 'Budi' },
  { statement: 'Budi lebih tinggi dari Ani.',     question: 'Siapa yang lebih pendek?',  choices: ['Budi','Ani'],    answer: 'Ani' },
  { statement: 'Nana lebih pendek dari Wati.',    question: 'Siapa yang lebih tinggi?',  choices: ['Nana','Wati'],   answer: 'Wati' },
  { statement: 'Nana lebih pendek dari Wati.',    question: 'Siapa yang lebih pendek?',  choices: ['Nana','Wati'],   answer: 'Nana' },
  { statement: 'Evan tidak setinggi Fina.',       question: 'Siapa yang lebih tinggi?',  choices: ['Evan','Fina'],   answer: 'Fina' },
  { statement: 'Evan tidak setinggi Fina.',       question: 'Siapa yang lebih pendek?',  choices: ['Evan','Fina'],   answer: 'Evan' },
  { statement: 'Reza lebih tinggi dari Sari.',    question: 'Siapa yang lebih pendek?',  choices: ['Reza','Sari'],   answer: 'Sari' },

  // --- PINTAR / BODOH ---
  { statement: 'John lebih pintar dari Pete.',    question: 'Siapa yang lebih pintar?',  choices: ['John','Pete'],   answer: 'John' },
  { statement: 'John lebih pintar dari Pete.',    question: 'Siapa yang lebih bodoh?',   choices: ['John','Pete'],   answer: 'Pete' },
  { statement: 'Riko tidak sepintar Dina.',       question: 'Siapa yang lebih pintar?',  choices: ['Riko','Dina'],   answer: 'Dina' },
  { statement: 'Riko tidak sepintar Dina.',       question: 'Siapa yang lebih bodoh?',   choices: ['Riko','Dina'],   answer: 'Riko' },
  { statement: 'Hilda lebih pintar dari Ivan.',   question: 'Siapa yang lebih bodoh?',   choices: ['Hilda','Ivan'],  answer: 'Ivan' },
  { statement: 'Omar tidak sepintar Pia.',        question: 'Siapa yang lebih pintar?',  choices: ['Omar','Pia'],    answer: 'Pia' },
  { statement: 'Qori lebih pintar dari Reza.',    question: 'Siapa yang lebih pintar?',  choices: ['Qori','Reza'],   answer: 'Qori' },

  // --- KUAT / LEMAH ---
  { statement: 'Wendy tidak sekuat Rachel.',      question: 'Siapa yang lebih lemah?',   choices: ['Wendy','Rachel'], answer: 'Wendy' },
  { statement: 'Wendy tidak sekuat Rachel.',      question: 'Siapa yang lebih kuat?',    choices: ['Wendy','Rachel'], answer: 'Rachel' },
  { statement: 'Doni lebih kuat dari Bagus.',     question: 'Siapa yang lebih lemah?',   choices: ['Doni','Bagus'],  answer: 'Bagus' },
  { statement: 'Doni lebih kuat dari Bagus.',     question: 'Siapa yang lebih kuat?',    choices: ['Doni','Bagus'],  answer: 'Doni' },
  { statement: 'Bagas tidak sekuat Rian.',        question: 'Siapa yang lebih kuat?',    choices: ['Bagas','Rian'],  answer: 'Rian' },
  { statement: 'Vera lebih kuat dari Wira.',      question: 'Siapa yang lebih lemah?',   choices: ['Vera','Wira'],   answer: 'Wira' },

  // --- CEPAT / LAMBAT ---
  { statement: 'Sarah lebih cepat dari Maya.',    question: 'Siapa yang lebih lambat?',  choices: ['Sarah','Maya'],  answer: 'Maya' },
  { statement: 'Sarah lebih cepat dari Maya.',    question: 'Siapa yang lebih cepat?',   choices: ['Sarah','Maya'],  answer: 'Sarah' },
  { statement: 'Lisa tidak selambat Rani.',       question: 'Siapa yang lebih lambat?',  choices: ['Lisa','Rani'],   answer: 'Rani' },
  { statement: 'Lisa tidak selambat Rani.',       question: 'Siapa yang lebih cepat?',   choices: ['Lisa','Rani'],   answer: 'Lisa' },
  { statement: 'Tika tidak secepat Udin.',        question: 'Siapa yang lebih cepat?',   choices: ['Tika','Udin'],   answer: 'Udin' },
  { statement: 'Ciko lebih cepat dari Dara.',     question: 'Siapa yang lebih lambat?',  choices: ['Ciko','Dara'],   answer: 'Dara' },

  // --- TUA / MUDA ---
  { statement: 'Aldo lebih muda dari Heri.',      question: 'Siapa yang lebih tua?',     choices: ['Aldo','Heri'],   answer: 'Heri' },
  { statement: 'Aldo lebih muda dari Heri.',      question: 'Siapa yang lebih muda?',    choices: ['Aldo','Heri'],   answer: 'Aldo' },
  { statement: 'Hana tidak setua Lina.',          question: 'Siapa yang lebih muda?',    choices: ['Hana','Lina'],   answer: 'Hana' },
  { statement: 'Hana tidak setua Lina.',          question: 'Siapa yang lebih tua?',     choices: ['Hana','Lina'],   answer: 'Lina' },
  { statement: 'Kiki lebih tua dari Lena.',       question: 'Siapa yang lebih muda?',    choices: ['Kiki','Lena'],   answer: 'Lena' },
  { statement: 'Mona tidak semuda Nina.',         question: 'Siapa yang lebih muda?',    choices: ['Mona','Nina'],   answer: 'Nina' },
  { statement: 'Xena lebih tua dari Yogi.',       question: 'Siapa yang lebih tua?',     choices: ['Xena','Yogi'],   answer: 'Xena' },

  // --- RAJIN / MALAS ---
  { statement: 'Siti lebih rajin dari Tono.',     question: 'Siapa yang lebih malas?',   choices: ['Siti','Tono'],   answer: 'Tono' },
  { statement: 'Siti lebih rajin dari Tono.',     question: 'Siapa yang lebih rajin?',   choices: ['Siti','Tono'],   answer: 'Siti' },
  { statement: 'Andi tidak serajin Bela.',        question: 'Siapa yang lebih rajin?',   choices: ['Andi','Bela'],   answer: 'Bela' },
  { statement: 'Andi tidak serajin Bela.',        question: 'Siapa yang lebih malas?',   choices: ['Andi','Bela'],   answer: 'Andi' },
  { statement: 'Yogi lebih rajin dari Zara.',     question: 'Siapa yang lebih malas?',   choices: ['Yogi','Zara'],   answer: 'Zara' },
  { statement: 'Gani tidak serajin Hilda.',       question: 'Siapa yang lebih rajin?',   choices: ['Gani','Hilda'],  answer: 'Hilda' },

  // --- LAMA / SEBENTAR ---
  { statement: 'Jack lebih lama dari Bill.',      question: 'Siapa yang lebih lama?',    choices: ['Jack','Bill'],   answer: 'Jack' },
  { statement: 'Jack lebih lama dari Bill.',      question: 'Siapa yang lebih sebentar?',choices: ['Jack','Bill'],   answer: 'Bill' },
  { statement: 'Gani tidak selama Hilda.',        question: 'Siapa yang lebih lama?',    choices: ['Gani','Hilda'],  answer: 'Hilda' },
  { statement: 'Gani tidak selama Hilda.',        question: 'Siapa yang lebih sebentar?',choices: ['Gani','Hilda'],  answer: 'Gani' },
  { statement: 'Tika lebih lama dari Udin.',      question: 'Siapa yang lebih sebentar?',choices: ['Tika','Udin'],   answer: 'Udin' },

  // --- SEHAT / SAKIT ---
  { statement: 'Mita tidak sesehat Rika.',        question: 'Siapa yang lebih sehat?',   choices: ['Mita','Rika'],   answer: 'Rika' },
  { statement: 'Mita tidak sesehat Rika.',        question: 'Siapa yang lebih sakit?',   choices: ['Mita','Rika'],   answer: 'Mita' },
  { statement: 'Julia lebih sehat dari Kiki.',    question: 'Siapa yang lebih sehat?',   choices: ['Julia','Kiki'],  answer: 'Julia' },
  { statement: 'Julia lebih sehat dari Kiki.',    question: 'Siapa yang lebih sakit?',   choices: ['Julia','Kiki'],  answer: 'Kiki' },
  { statement: 'Pia tidak sesehat Qori.',         question: 'Siapa yang lebih sehat?',   choices: ['Pia','Qori'],    answer: 'Qori' },

  // --- HEMAT / BOROS ---
  { statement: 'Arif lebih hemat dari Bowo.',     question: 'Siapa yang lebih boros?',   choices: ['Arif','Bowo'],   answer: 'Bowo' },
  { statement: 'Arif lebih hemat dari Bowo.',     question: 'Siapa yang lebih hemat?',   choices: ['Arif','Bowo'],   answer: 'Arif' },
  { statement: 'Sari tidak sehemat Tika.',        question: 'Siapa yang lebih hemat?',   choices: ['Sari','Tika'],   answer: 'Tika' },
  { statement: 'Sari tidak sehemat Tika.',        question: 'Siapa yang lebih boros?',   choices: ['Sari','Tika'],   answer: 'Sari' },
  { statement: 'Ivan lebih hemat dari Julia.',    question: 'Siapa yang lebih boros?',   choices: ['Ivan','Julia'],  answer: 'Julia' },

  // --- SOPAN / KASAR ---
  { statement: 'Cinta lebih sopan dari Dewi.',    question: 'Siapa yang lebih sopan?',   choices: ['Cinta','Dewi'],  answer: 'Cinta' },
  { statement: 'Cinta lebih sopan dari Dewi.',    question: 'Siapa yang kurang sopan?',  choices: ['Cinta','Dewi'],  answer: 'Dewi' },
  { statement: 'Vera tidak sesopan Wira.',        question: 'Siapa yang lebih sopan?',   choices: ['Vera','Wira'],   answer: 'Wira' },
  { statement: 'Vera tidak sesopan Wira.',        question: 'Siapa yang lebih kasar?',   choices: ['Vera','Wira'],   answer: 'Vera' },
  { statement: 'Nina lebih sopan dari Omar.',     question: 'Siapa yang lebih kasar?',   choices: ['Nina','Omar'],   answer: 'Omar' },

  // --- CERMAT / CEROBOH ---
  { statement: 'Rini lebih cermat dari Umi.',     question: 'Siapa yang lebih cermat?',  choices: ['Rini','Umi'],    answer: 'Rini' },
  { statement: 'Rini lebih cermat dari Umi.',     question: 'Siapa yang kurang cermat?', choices: ['Rini','Umi'],    answer: 'Umi' },
  { statement: 'Eko tidak secermat Fajar.',       question: 'Siapa yang lebih cermat?',  choices: ['Eko','Fajar'],   answer: 'Fajar' },
  { statement: 'Eko tidak secermat Fajar.',       question: 'Siapa yang lebih ceroboh?', choices: ['Eko','Fajar'],   answer: 'Eko' },
  { statement: 'Lena lebih cermat dari Mona.',    question: 'Siapa yang lebih ceroboh?', choices: ['Lena','Mona'],   answer: 'Mona' },

  // --- BERANI / PENAKUT ---
  { statement: 'Bagas tidak seberani Rian.',      question: 'Siapa yang lebih berani?',  choices: ['Bagas','Rian'],  answer: 'Rian' },
  { statement: 'Bagas tidak seberani Rian.',      question: 'Siapa yang lebih penakut?', choices: ['Bagas','Rian'],  answer: 'Bagas' },
  { statement: 'Qori lebih berani dari Reza.',    question: 'Siapa yang lebih berani?',  choices: ['Qori','Reza'],   answer: 'Qori' },
  { statement: 'Qori lebih berani dari Reza.',    question: 'Siapa yang lebih penakut?', choices: ['Qori','Reza'],   answer: 'Reza' },
  { statement: 'Zara tidak seberani Andi.',       question: 'Siapa yang lebih berani?',  choices: ['Zara','Andi'],   answer: 'Andi' },

  // --- GEMUK / KURUS ---
  { statement: 'Eko tidak segemuk Fajar.',        question: 'Siapa yang lebih kurus?',   choices: ['Eko','Fajar'],   answer: 'Eko' },
  { statement: 'Eko tidak segemuk Fajar.',        question: 'Siapa yang lebih gemuk?',   choices: ['Eko','Fajar'],   answer: 'Fajar' },
  { statement: 'Lena lebih gemuk dari Mona.',     question: 'Siapa yang lebih kurus?',   choices: ['Lena','Mona'],   answer: 'Mona' },
  { statement: 'Lena lebih gemuk dari Mona.',     question: 'Siapa yang lebih gemuk?',   choices: ['Lena','Mona'],   answer: 'Lena' },

  // --- KAYA / MISKIN ---
  { statement: 'Ivan lebih kaya dari Julia.',     question: 'Siapa yang lebih kaya?',    choices: ['Ivan','Julia'],  answer: 'Ivan' },
  { statement: 'Ivan lebih kaya dari Julia.',     question: 'Siapa yang lebih miskin?',  choices: ['Ivan','Julia'],  answer: 'Julia' },
  { statement: 'Xena tidak sekaya Yogi.',         question: 'Siapa yang lebih kaya?',    choices: ['Xena','Yogi'],   answer: 'Yogi' },
  { statement: 'Xena tidak sekaya Yogi.',         question: 'Siapa yang lebih miskin?',  choices: ['Xena','Yogi'],   answer: 'Xena' },

  // --- PANJANG / PENDEK ---
  { statement: 'Andi lebih panjang dari Bela.',   question: 'Siapa yang lebih panjang?', choices: ['Andi','Bela'],   answer: 'Andi' },
  { statement: 'Andi lebih panjang dari Bela.',   question: 'Siapa yang lebih pendek?',  choices: ['Andi','Bela'],   answer: 'Bela' },
  { statement: 'Ciko tidak sepanjang Dara.',      question: 'Siapa yang lebih panjang?', choices: ['Ciko','Dara'],   answer: 'Dara' },
  { statement: 'Ciko tidak sepanjang Dara.',      question: 'Siapa yang lebih pendek?',  choices: ['Ciko','Dara'],   answer: 'Ciko' },
];
