// Islamic Theme Configuration for AL-Rehmat Online Quran Academy

export const islamicTheme = {
  colors: {
    primary: {
      green: '#2D7A4F',      // Islamic green
      darkGreen: '#1E5A3A',
      lightGreen: '#4A9D6F',
      gold: '#D4AF37',        // Gold accent
      darkGold: '#B8941F',
    },
    neutral: {
      white: '#FFFFFF',
      cream: '#F5F5DC',
      beige: '#F5E6D3',
      lightGray: '#F8F9FA',
      gray: '#6C757D',
      darkGray: '#343A40',
      black: '#1A1A1A',
    },
    accent: {
      blue: '#4A90E2',
      lightBlue: '#E3F2FD',
      teal: '#008B8B',
    }
  },
  
  fonts: {
    arabic: {
      primary: "'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif",
      secondary: "'Noto Naskh Arabic', 'Traditional Arabic', serif",
      modern: "'Cairo', 'Tajawal', sans-serif",
    },
    english: {
      heading: "'Poppins', 'Inter', sans-serif",
      body: "'Inter', 'Roboto', sans-serif",
    }
  },

  quranicVerses: [
    {
      arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
      translation: "Read in the name of your Lord who created",
      reference: "Surah Al-'Alaq (96:1)",
    },
    {
      arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
      translation: "And say: My Lord, increase me in knowledge",
      reference: "Surah Ta-Ha (20:114)",
    },
    {
      arabic: "إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ",
      translation: "Only those fear Allah, from among His servants, who have knowledge",
      reference: "Surah Fatir (35:28)",
    },
    {
      arabic: "وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا قَلِيلًا",
      translation: "And you have not been given of knowledge except a little",
      reference: "Surah Al-Isra (17:85)",
    },
    {
      arabic: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
      translation: "So ask the people of knowledge if you do not know",
      reference: "Surah An-Nahl (16:43)",
    }
  ],

  courses: [
    {
      id: 'noorani-qaida',
      title: 'Basic Noorani Qaida',
      titleArabic: 'القاعدة النورانية',
      description: 'Learn the fundamentals of Quranic Arabic pronunciation and reading with proper Tajweed rules.',
      ageGroup: 'Ages 5-12',
      level: 'Beginner',
      duration: '3-6 months',
      features: ['One-on-one classes', 'Interactive lessons', 'Progress tracking'],
      image: '/courses/noorani-qaida.jpg'
    },
    {
      id: 'quran-recitation',
      title: 'Quran Recitation with Tajweed',
      titleArabic: 'تلاوة القرآن بالتجويد',
      description: 'Master the art of beautiful Quran recitation with proper Tajweed rules and Makharij.',
      ageGroup: 'All Ages',
      level: 'Intermediate',
      duration: '6-12 months',
      features: ['Tajweed rules', 'Makharij practice', 'Recitation correction'],
      image: '/courses/tajweed.jpg'
    },
    {
      id: 'hifz-quran',
      title: 'Hifz-ul-Quran (Memorization)',
      titleArabic: 'حفظ القرآن الكريم',
      description: 'Comprehensive Quran memorization program with revision techniques and spiritual guidance.',
      ageGroup: 'Ages 7+',
      level: 'Advanced',
      duration: '2-4 years',
      features: ['Daily memorization', 'Revision system', 'Spiritual mentoring'],
      image: '/courses/hifz.jpg'
    },
    {
      id: 'translation-tafseer',
      title: 'Translation & Tafseer',
      titleArabic: 'الترجمة والتفسير',
      description: 'Understand the meanings and deeper wisdom of the Quran through authentic Tafseer.',
      ageGroup: 'Ages 15+',
      level: 'Intermediate',
      duration: '12-18 months',
      features: ['Word-by-word translation', 'Classical Tafseer', 'Contemporary context'],
      image: '/courses/tafseer.jpg'
    },
    {
      id: 'islamic-studies-kids',
      title: 'Islamic Studies for Kids',
      titleArabic: 'الدراسات الإسلامية للأطفال',
      description: 'Engaging Islamic education covering Aqeedah, Fiqh, Seerah, and Islamic manners for children.',
      ageGroup: 'Ages 6-14',
      level: 'Beginner',
      duration: '6-12 months',
      features: ['Stories of Prophets', 'Islamic manners', 'Basic Fiqh'],
      image: '/courses/kids-islamic.jpg'
    },
    {
      id: 'one-on-one',
      title: 'One-on-One Quran Classes',
      titleArabic: 'دروس القرآن الفردية',
      description: 'Personalized Quran learning experience tailored to your pace and learning style.',
      ageGroup: 'All Ages',
      level: 'All Levels',
      duration: 'Flexible',
      features: ['Customized curriculum', 'Flexible timing', 'Personal attention'],
      image: '/courses/one-on-one.jpg'
    },
    {
      id: 'weekend-school',
      title: 'Weekend Islamic School',
      titleArabic: 'المدرسة الإسلامية لعطلة نهاية الأسبوع',
      description: 'Comprehensive weekend program combining Quran, Arabic, and Islamic studies.',
      ageGroup: 'Ages 5-16',
      level: 'All Levels',
      duration: 'Ongoing',
      features: ['Group classes', 'Interactive activities', 'Community building'],
      image: '/courses/weekend-school.jpg'
    }
  ],

  services: [
    {
      id: 'one-on-one-tutoring',
      title: 'One-on-One Quran Tutoring',
      titleArabic: 'التعليم الفردي للقرآن',
      description: 'Personalized Quran lessons with experienced teachers dedicated to your learning journey.',
      icon: 'user',
      features: ['Customized pace', 'Individual attention', 'Flexible schedule']
    },
    {
      id: 'kids-classes',
      title: 'Online Classes for Kids',
      titleArabic: 'دروس عبر الإنترنت للأطفال',
      description: 'Engaging and interactive Quran classes designed specifically for young learners.',
      icon: 'users',
      features: ['Age-appropriate', 'Fun learning', 'Progress reports']
    },
    {
      id: 'female-teachers',
      title: 'Female Quran Teachers Available',
      titleArabic: 'معلمات القرآن متاحات',
      description: 'Qualified female teachers for sisters who prefer learning from female instructors.',
      icon: 'female',
      features: ['Experienced sisters', 'Comfortable environment', 'Islamic etiquette']
    },
    {
      id: 'flexible-scheduling',
      title: 'Flexible Scheduling',
      titleArabic: 'جدولة مرنة',
      description: 'Choose class times that fit your schedule with our flexible booking system.',
      icon: 'calendar',
      features: ['24/7 availability', 'Reschedule option', 'Multiple time zones']
    },
    {
      id: 'free-trial',
      title: 'Free Trial Class',
      titleArabic: 'درس تجريبي مجاني',
      description: 'Experience our teaching methodology with a complimentary trial class before enrolling.',
      icon: 'gift',
      features: ['No commitment', 'Meet your teacher', 'Assess your level']
    },
    {
      id: 'support',
      title: '24/7 Support for Students',
      titleArabic: 'دعم على مدار الساعة',
      description: 'Round-the-clock support team ready to assist with any questions or concerns.',
      icon: 'headset',
      features: ['Quick response', 'Technical help', 'Academic guidance']
    }
  ],

  testimonials: [
    {
      name: 'Fatima Ahmed',
      nameArabic: 'فاطمة أحمد',
      role: 'Parent',
      location: 'London, UK',
      rating: 5,
      text: 'My daughter has made incredible progress in her Quran recitation. The teachers are patient, knowledgeable, and truly care about their students.',
      image: '/testimonials/fatima.jpg'
    },
    {
      name: 'Abdullah Khan',
      nameArabic: 'عبد الله خان',
      role: 'Student',
      location: 'Toronto, Canada',
      rating: 5,
      text: 'The Hifz program is excellent. My teacher helps me memorize efficiently and the revision system keeps everything fresh in my memory.',
      image: '/testimonials/abdullah.jpg'
    },
    {
      name: 'Aisha Rahman',
      nameArabic: 'عائشة رحمن',
      role: 'Parent',
      location: 'Sydney, Australia',
      rating: 5,
      text: 'Alhamdulillah, my children love their Quran classes. The female teachers are amazing and the flexible timing works perfectly for us.',
      image: '/testimonials/aisha.jpg'
    }
  ]
}

export const getRandomVerse = () => {
  const verses = islamicTheme.quranicVerses
  return verses[Math.floor(Math.random() * verses.length)]
}
