export interface DocItem {
  key: string;
  name: string;
  url: string;
  cat: string;
  desc: string;
}

export interface TaskItem {
  id: string;
  time: string;
  skill: string;
  title: string;
  desc: string;
  stars: number;
  docs: string[];
}

export interface DaySchedule {
  id: string;
  tab: string;
  title: string;
  theme: string;
  tasks: TaskItem[];
}

export const CATEGORIES = [
  "all",
  "Đọc hiểu & Phát âm",
  "Nghe nói & Thuyết trình",
  "Nghe – Chép chính tả",
  "Ngữ pháp & Viết",
] as const;

export const DOCS: Record<string, Omit<DocItem, "key">> = {
  quizletHarcourt1A: {
    name: "Quizlet – Từ vựng Harcourt 1A",
    url: "https://quizlet.com/user/lehanhliy/folders/harcourt-1a?i=7er3o2&x=1xqt",
    cat: "Đọc hiểu & Phát âm",
    desc: "Thư mục flashcard ôn tập từ vựng Harcourt 1A trực tuyến.",
  },
  readAlong: {
    name: "Google Read Along",
    url: "https://readalong.google.com",
    cat: "Đọc hiểu & Phát âm",
    desc: "Đọc to để AI chấm điểm phát âm, rèn độ trôi chảy và nhận sao.",
  },
  harcourtG1: {
    name: "Harcourt Reading Grade 1",
    url: "https://drive.google.com/drive/folders/12s39Fyr7f8F_X61JVVwxeLeoaa4sPPOk?usp=sharing",
    cat: "Đọc hiểu & Phát âm",
    desc: "Bài đọc chuẩn Mỹ Grade 1, luyện kỹ năng đọc hiểu & tìm bằng chứng.",
  },
  harcourtG2: {
    name: "Harcourt Reading Grade 2",
    url: "https://drive.google.com/drive/folders/10T04PIZxCk0wDuO2lrXqU6iOp7QwcUKQ?usp=drive_link",
    cat: "Đọc hiểu & Phát âm",
    desc: "Bài đọc Grade 2 mở rộng từ vựng và câu hỏi đọc hiểu.",
  },
  harcourtSup1: {
    name: "Tài liệu bổ trợ Harcourt (Phần 1)",
    url: "https://drive.google.com/drive/folders/1XjyqE2Mq7wH2RrbPIMakPV6OV_W2PHbM?usp=drive_link",
    cat: "Đọc hiểu & Phát âm",
    desc: "Từ vựng, phonics/word study và phiếu luyện tập bổ trợ Harcourt.",
  },
  harcourtSup2: {
    name: "Tài liệu bổ trợ Harcourt (Phần 2)",
    url: "https://drive.google.com/drive/folders/15R6czZKucIatvRr8NU4sckWy_JPgji1U?usp=drive_link",
    cat: "Đọc hiểu & Phát âm",
    desc: "Học liệu bổ trợ thêm cho các bài đọc Harcourt.",
  },
  brainBankSocial: {
    name: "Brain Bank Social Grade 1",
    url: "https://drive.google.com/drive/folders/1fGe2jocIpaMzq9V9wZp8eaJkFZTJ7-e1?usp=drive_link",
    cat: "Nghe nói & Thuyết trình",
    desc: "Video & tư liệu chủ đề xã hội phục vụ Watch & Shadow, Mindmap và thuyết trình.",
  },
  brainBankAloud: {
    name: "Brain Bank Book Aloud 1",
    url: "https://drive.google.com/drive/folders/18AMPMDm1095yHv67m19YbQkJyuo69Cna?usp=drive_link",
    cat: "Nghe nói & Thuyết trình",
    desc: "Sách đọc to Brain Bank 1 hỗ trợ luyện nói chủ động và kể lại nội dung.",
  },
  littleFox: {
    name: "Little Fox (5 Levels)",
    url: "https://drive.google.com/drive/folders/1P-1VFDTNZTGzFVYw29tDrA2QgagfZ9IW?fbclid=IwAR2gUAUCMU3wcx5zQJ8yoW-tGG2UgZ5EkB8JiWpvBdS8f28gdNUfT0aYimk",
    cat: "Nghe nói & Thuyết trình",
    desc: "Truyện hoạt hình luyện Shadowing và ngữ điệu tự nhiên.",
  },
  elfast1: {
    name: "ELFAST 1 – Start Reading for Children (I)",
    url: "https://www.eslfast.com/kidsenglish/",
    cat: "Nghe – Chép chính tả",
    desc: "Luyện nghe – chép chính tả, đọc và củng cố ngữ pháp cơ bản.",
  },
  bricksListening100: {
    name: "Bricks Easy Listening 100 (SB + WB + Test)",
    url: "https://drive.google.com/drive/folders/1hsJol3Zhm6kXtwimBamxcPXBGw4ahwF3?usp=drive_link",
    cat: "Nghe – Chép chính tả",
    desc: "Sách nghe, bài tập và bài kiểm tra trình độ cơ bản (từ đơn, cụm từ, hội thoại ngắn).",
  },
  cdDictationL1: {
    name: "CD-ROM Dictation – Listening 100 Level 1",
    url: "https://drive.google.com/file/d/1Kw1c5gLVrVHusvZrHGSReRmNxEQcAaSO/view?usp=drive_link",
    cat: "Nghe – Chép chính tả",
    desc: "Phần mềm cài đặt luyện nghe chép chính tả Level 1.",
  },
  cdDictationL2: {
    name: "CD-ROM Dictation – Listening 100 Level 2",
    url: "https://drive.google.com/file/d/1z6x7uSovOEDJHUDq9Egs-JJj3I_FqJ71/view?usp=drive_link",
    cat: "Nghe – Chép chính tả",
    desc: "Phần mềm cài đặt luyện nghe chép chính tả Level 2.",
  },
  cdDictationL3: {
    name: "CD-ROM Dictation – Listening 100 Level 3",
    url: "https://drive.google.com/file/d/1l3jFxKIS-UNAYiX3fNbJ4w7LbXvCLh5X/view?usp=drive_link",
    cat: "Nghe – Chép chính tả",
    desc: "Phần mềm cài đặt luyện nghe chép chính tả Level 3.",
  },
  bricksGrammarL1: {
    name: "Bricks First Grammar – Level 1",
    url: "https://drive.google.com/drive/folders/1tQJYwedQeWBmLo7t4RtoSjzVlDYiKOUj?usp=drive_link",
    cat: "Ngữ pháp & Viết",
    desc: "Ngữ pháp nền tảng dạng truyện tranh trực quan (Level 1).",
  },
  bricksGrammarL2: {
    name: "Bricks First Grammar – Level 2",
    url: "https://drive.google.com/drive/folders/1Ny8ctwspninS6PZRHUBk-54cw9ZpQw4q?usp=drive_link",
    cat: "Ngữ pháp & Viết",
    desc: "Ngữ pháp nền tảng dạng truyện tranh trực quan (Level 2).",
  },
  roundUpStarter: {
    name: "New Round-Up Starter (Bổ trợ Grammar)",
    url: "https://drive.google.com/drive/folders/1RoWmf-eKgVlDqyz_eSAWwNb7Ka7YkFXQ?usp=drive_link",
    cat: "Ngữ pháp & Viết",
    desc: "Bài tập ngữ pháp bổ trợ thêm kèm bộ Bricks.",
  },
  bricksWriting50L1: {
    name: "Bricks Writing 50 – Level 1",
    url: "https://drive.google.com/drive/folders/1YFh_f99JqW4eneWQ-42wJPMGGlpf5O2G?usp=drive_link",
    cat: "Ngữ pháp & Viết",
    desc: "Rèn câu đơn (S + V + O), chính tả và dấu câu – Level 1.",
  },
  bricksWriting50L2: {
    name: "Bricks Writing 50 – Level 2",
    url: "https://drive.google.com/drive/folders/1n3vspbGd2vNKfkd4Zl5AwjZmoiQPOtqH?usp=drive_link",
    cat: "Ngữ pháp & Viết",
    desc: "Rèn câu đơn (S + V + O), chính tả và dấu câu – Level 2.",
  },
  bricksWriting50L3: {
    name: "Bricks Writing 50 – Level 3",
    url: "https://drive.google.com/drive/folders/1JJasZdf19r5ETQs0oLxyM8WIIPWo-Ylz?usp=drive_link",
    cat: "Ngữ pháp & Viết",
    desc: "Rèn câu đơn (S + V + O), chính tả và dấu câu – Level 3.",
  },
};

export const SCHEDULE: DaySchedule[] = [
  {
    id: "mon",
    tab: "Thứ Hai",
    title: "Thứ Hai – Mở đầu chủ đề & Khai phá bài đọc mới",
    theme: "60 phút • Ôn từ vựng, xem video tuần, đọc bài Harcourt mới & làm quen ngữ pháp",
    tasks: [
      {
        id: "mon-1",
        time: "10 phút",
        skill: "Từ vựng",
        title: "Warm-up & Vocabulary Review",
        desc: "Ôn từ vựng qua flashcard liên quan đến bài đọc trong ngày.",
        stars: 1,
        docs: ["quizletHarcourt1A", "harcourtG1", "harcourtG2"],
      },
      {
        id: "mon-2",
        time: "15 phút",
        skill: "Nghe – Nói",
        title: "Listening & Speaking (Brain Bank)",
        desc: "Xem video chủ đề tuần (Bước 1: Watch & Shadow – xem 1–2 lần và nhại lại ngữ điệu).",
        stars: 2,
        docs: ["brainBankSocial", "brainBankAloud"],
      },
      {
        id: "mon-3",
        time: "15 phút",
        skill: "Đọc hiểu",
        title: "Reading – Thám tử nhí (Harcourt)",
        desc: "Áp dụng Preview – Question First – Read & Color Vowel đọc bài mới và gạch chân từ mới.",
        stars: 2,
        docs: ["harcourtG1", "harcourtG2"],
      },
      {
        id: "mon-4",
        time: "10 phút",
        skill: "Phát âm",
        title: "Pronunciation Check (Read Along)",
        desc: "Luyện đọc lại đoạn 1 của bài đọc để AI nhận diện và chỉnh âm.",
        stars: 1,
        docs: ["readAlong"],
      },
      {
        id: "mon-5",
        time: "10 phút",
        skill: "Ngữ pháp",
        title: "Grammar mở đầu (Bricks First Grammar)",
        desc: "Học lý thuyết dạng truyện tranh và làm bài tập ngữ pháp mở đầu.",
        stars: 1,
        docs: ["bricksGrammarL1", "bricksGrammarL2"],
      },
    ],
  },
  {
    id: "tue",
    tab: "Thứ Ba",
    title: "Thứ Ba – Đọc sâu hiểu kỹ & Rèn viết câu",
    theme: "60 phút • Tìm bằng chứng đọc hiểu, chỉnh âm toàn bài & viết câu đơn chuẩn xác",
    tasks: [
      {
        id: "tue-1",
        time: "10 phút",
        skill: "Chính tả",
        title: "Warm-up & Dictation nhanh",
        desc: "Đố vui từ vựng nhanh hoặc nghe – chép chính tả từ ngắn.",
        stars: 1,
        docs: ["elfast1"],
      },
      {
        id: "tue-2",
        time: "15 phút",
        skill: "Đọc hiểu",
        title: "Harcourt Comprehension",
        desc: "Tìm bằng chứng trong bài (Evidence) và trả lời câu hỏi trắc nghiệm/tự luận.",
        stars: 2,
        docs: ["harcourtG1", "harcourtG2"],
      },
      {
        id: "tue-3",
        time: "15 phút",
        skill: "Phát âm",
        title: "Google Read Along",
        desc: "Đọc toàn bộ bài đọc (hoặc truyện tương đương trên app) để lấy sao và sửa từ khó.",
        stars: 2,
        docs: ["readAlong"],
      },
      {
        id: "tue-4",
        time: "20 phút",
        skill: "Viết",
        title: "Bricks Writing 50",
        desc: "Hoàn thiện cấu trúc câu đơn (S + V + O), rèn chính tả và dấu câu.",
        stars: 2,
        docs: ["bricksWriting50L1", "bricksWriting50L2", "bricksWriting50L3"],
      },
    ],
  },
  {
    id: "wed",
    tab: "Thứ Tư",
    title: "Thứ Tư – Luyện nghe chuyên sâu & Ngữ pháp",
    theme: "60 phút • Nghe hội thoại ngắn, vẽ Mindmap mở rộng, củng cố ngữ pháp & Phonics",
    tasks: [
      {
        id: "wed-1",
        time: "10 phút",
        skill: "Nghe – Nói",
        title: "Warm-up Nghe & Nhại lại",
        desc: "Nghe và nhại lại từ vựng, cụm từ ngắn.",
        stars: 1,
        docs: ["bricksListening100"],
      },
      {
        id: "wed-2",
        time: "15 phút",
        skill: "Nghe & Mindmap",
        title: "Listening 100 & Build Mindmap",
        desc: "Luyện phản xạ nghe hội thoại 2–3 lượt và vẽ sơ đồ tư duy mở rộng từ chủ đề tuần.",
        stars: 2,
        docs: ["bricksListening100", "cdDictationL1", "cdDictationL2", "cdDictationL3"],
      },
      {
        id: "wed-3",
        time: "15 phút",
        skill: "Ngữ pháp",
        title: "Củng cố Grammar",
        desc: "Làm bài tập củng cố ngữ pháp nền tảng (danh từ, to be, tính từ sở hữu, hiện tại đơn).",
        stars: 2,
        docs: ["bricksGrammarL1", "bricksGrammarL2"],
      },
      {
        id: "wed-4",
        time: "20 phút",
        skill: "Phonics",
        title: "Harcourt Phonics / Word Study",
        desc: "Làm bài tập về nguyên âm, phụ âm, từ loại (nouns/verbs) đi kèm bài đọc.",
        stars: 2,
        docs: ["harcourtG1", "harcourtG2"],
      },
    ],
  },
  {
    id: "thu",
    tab: "Thứ Năm",
    title: "Thứ Năm – Đọc mở rộng & Phát âm nâng cao",
    theme: "60 phút • Shadowing truyện, thuyết trình 4–6 câu theo Mindmap, đọc trôi chảy & viết đoạn",
    tasks: [
      {
        id: "thu-1",
        time: "10 phút",
        skill: "Shadowing",
        title: "Phonics Warm-up & Little Fox",
        desc: "Khởi động khẩu hình và luyện ngữ điệu đuổi qua truyện hoạt hình.",
        stars: 1,
        docs: ["littleFox"],
      },
      {
        id: "thu-2",
        time: "15 phút",
        skill: "Thuyết trình",
        title: "Brain Bank & Mini Presentation",
        desc: "Xem tiếp video Brain Bank, đóng vai nhân vật và thuyết trình 4–6 câu theo Mindmap.",
        stars: 2,
        docs: ["brainBankSocial", "brainBankAloud"],
      },
      {
        id: "thu-3",
        time: "20 phút",
        skill: "Đọc trôi chảy",
        title: "Google Read Along Workshop",
        desc: "Tự đọc 2–3 mẩu truyện ngắn trên ứng dụng, tập trung đọc trôi chảy và ngắt nghỉ đúng dấu câu.",
        stars: 2,
        docs: ["readAlong"],
      },
      {
        id: "thu-4",
        time: "15 phút",
        skill: "Viết",
        title: "Bricks Writing 50 (Đoạn ngắn)",
        desc: "Viết đoạn ngắn (3–4 câu) theo cấu trúc đã học.",
        stars: 2,
        docs: ["bricksWriting50L1", "bricksWriting50L2", "bricksWriting50L3"],
      },
    ],
  },
  {
    id: "fri",
    tab: "Thứ Sáu",
    title: "Thứ Sáu – Tổng kết tuần & Luyện nghe chép",
    theme: "60 phút • Ôn từ vựng cốt lõi, đọc lại bài tuần, tổng hợp Writing/Dictation & chốt sao",
    tasks: [
      {
        id: "fri-1",
        time: "10 phút",
        skill: "Từ vựng & Chính tả",
        title: "Warm-up Ôn Từ Vựng & ELFAST 1",
        desc: "Đọc to từ vựng cốt lõi trong tuần qua flashcard/Quizlet và luyện nghe – chép chính tả.",
        stars: 1,
        docs: ["quizletHarcourt1A", "elfast1"],
      },
      {
        id: "fri-2",
        time: "25 phút",
        skill: "Đọc – Nói",
        title: "Harcourt Review Lesson",
        desc: "Đọc lại bài đọc chính trong tuần, hỏi – đáp nhanh nội dung bằng tiếng Anh đơn giản.",
        stars: 2,
        docs: ["harcourtG1", "harcourtG2"],
      },
      {
        id: "fri-3",
        time: "15 phút",
        skill: "Viết & Nghe",
        title: "Tổng hợp Writing & Dictation",
        desc: "Hoàn thành bài tập tổng hợp cuối Unit trong Writing và luyện nghe Listening 100.",
        stars: 2,
        docs: ["bricksWriting50L1", "bricksWriting50L2", "bricksWriting50L3", "bricksListening100"],
      },
      {
        id: "fri-4",
        time: "10 phút",
        skill: "Tổng kết",
        title: "Tổng kết sao Read Along",
        desc: "Tổng kết số sao đạt được trong tuần trên ứng dụng và tuyên dương tiến bộ.",
        stars: 1,
        docs: ["readAlong"],
      },
    ],
  },
  {
    id: "sat",
    tab: "Thứ Bảy",
    title: "Thứ Bảy – Giải trí & Tương tác nhẹ nhàng (Fun Saturday)",
    theme: "60 phút • Trò chơi tương tác, xem truyện/video yêu thích & đọc tự do thư giãn",
    tasks: [
      {
        id: "sat-1",
        time: "10 phút",
        skill: "Trò chơi",
        title: "Warm-up Tương tác",
        desc: "Trò chơi từ vựng hoặc làm bài tập tương tác bổ trợ.",
        stars: 1,
        docs: ["quizletHarcourt1A"],
      },
      {
        id: "sat-2",
        time: "25 phút",
        skill: "Giải trí Nghe – Nói",
        title: "Brain Bank & Little Fox Fun Time",
        desc: "Xem lại video yêu thích, hát theo bài hát hoặc xem truyện hoạt hình giải trí.",
        stars: 2,
        docs: ["brainBankSocial", "littleFox"],
      },
      {
        id: "sat-3",
        time: "15 phút",
        skill: "Đọc tự do",
        title: "Free Reading on Read Along",
        desc: "Tự chọn 1 cuốn sách bất kỳ theo sở thích trên Read Along để đọc giải trí.",
        stars: 2,
        docs: ["readAlong"],
      },
      {
        id: "sat-4",
        time: "10 phút",
        skill: "Khen thưởng",
        title: "Khen thưởng & Dặn dò",
        desc: "Chúc mừng con đã hoàn thành lịch học cuối tuần vui vẻ.",
        stars: 1,
        docs: [],
      },
    ],
  },
  {
    id: "sun",
    tab: "Chủ Nhật",
    title: "Chủ Nhật – Tự kiểm tra & Quay video báo cáo (Sunday Check-in)",
    theme: "60 phút • Kể lại chủ đề qua Mindmap, đọc/thuyết trình ghi hình & sửa lỗi trong tuần",
    tasks: [
      {
        id: "sun-1",
        time: "10 phút",
        skill: "Nói",
        title: "Kể lại chủ đề qua Mindmap",
        desc: "Nhìn sơ đồ tư duy kể lại các chủ đề đã học trong tuần.",
        stars: 1,
        docs: ["brainBankAloud"],
      },
      {
        id: "sun-2",
        time: "20 phút",
        skill: "Đọc & Thuyết trình",
        title: "Mini-Reading Test & Quay Video",
        desc: "Đọc trôi chảy đoạn ngắn trong Harcourt và quay video thuyết trình qua Mindmap gửi cô/ba mẹ.",
        stars: 2,
        docs: ["harcourtG1", "harcourtG2"],
      },
      {
        id: "sun-3",
        time: "20 phút",
        skill: "Sửa lỗi",
        title: "Ôn lỗi Writing, Dictation & Read Along",
        desc: "Xem lại lỗi chính tả trong Writing 50, Dictation hoặc từ bị báo đỏ nhiều lần trên Read Along.",
        stars: 2,
        docs: [
          "bricksWriting50L1",
          "bricksWriting50L2",
          "bricksWriting50L3",
          "cdDictationL1",
          "cdDictationL2",
          "cdDictationL3",
          "readAlong",
        ],
      },
      {
        id: "sun-4",
        time: "10 phút",
        skill: "Thư giãn",
        title: "Nghỉ ngơi & Chuẩn bị tuần mới",
        desc: "Thư giãn, nạp năng lượng cho tuần học tiếp theo.",
        stars: 1,
        docs: [],
      },
    ],
  },
];
