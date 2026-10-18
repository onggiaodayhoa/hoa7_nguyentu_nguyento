import React, { useState, useEffect, useMemo } from 'react';
import {
  StudentInfo,
  QuizSubmission,
  GoogleSyncConfig,
  TheoryQuestion,
  ElementSymbolQuiz,
  CompareAtomQuiz,
  SymbolCorrectionQuiz,
} from './types/chemistry';
import {
  THEORY_QUESTIONS,
  ELEMENT_QUIZZES,
  COMPARE_ATOM_QUIZZES,
  SYMBOL_CORRECTION_QUIZZES,
} from './data/questionsData';
import { shuffleArray, isAnswerCorrect } from './utils/shuffle';
import {
  getCachedSubmissions,
  saveCachedSubmissions,
  getSavedConfig,
  sendSubmissionToGoogleSheet,
} from './services/googleSheetsService';
import { Navbar } from './components/Navbar';
import { StudentInfoModal } from './components/StudentInfoModal';
import { AtomicModelViewer } from './components/AtomicModelViewer';
import { KeywordBank } from './components/KeywordBank';
import {
  TheoryQuestionCard,
  ElementQuizCard,
  CompareAtomCard,
  SymbolCorrectionCard,
} from './components/QuestionCard';
import { QuizResults } from './components/QuizResults';
import { TeacherPortal } from './components/TeacherPortal';
import { GoogleSheetsSetupModal } from './components/GoogleSheetsSetupModal';
import { ElementsReferenceModal } from './components/ElementsReferenceModal';
import { HumanBodyElementsModal } from './components/HumanBodyElementsModal';
import { CardSortingGame } from './components/CardSortingGame';
import { ConceptMapModal } from './components/ConceptMapModal';
import {
  Sparkles,
  Shuffle,
  Send,
  RotateCcw,
  Clock,
  Heart,
  Boxes,
  Atom,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Network,
} from 'lucide-react';

export default function App() {
  // Navigation & Modals state
  const [activeTab, setActiveTab] = useState<'quiz' | 'cards_game' | 'atom_viewer' | 'teacher_portal'>('quiz');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSheetsSetupOpen, setIsSheetsSetupOpen] = useState(false);
  const [isElementsModalOpen, setIsElementsModalOpen] = useState(false);
  const [isBodyElementsModalOpen, setIsBodyElementsModalOpen] = useState(false);
  const [isConceptMapModalOpen, setIsConceptMapModalOpen] = useState(false);

  // Student Profile state
  const [student, setStudent] = useState<StudentInfo | null>(() => {
    try {
      const saved = localStorage.getItem('hoa7_current_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Google Sheets Sync Config
  const [syncConfig, setSyncConfig] = useState<GoogleSyncConfig>(getSavedConfig);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>(getCachedSubmissions);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // ==========================================
  // REQUIREMENT 3: Trộn ngân hàng từ khóa khi mở link ứng dụng
  // ==========================================
  const allRawKeywords = useMemo(() => {
    const list: string[] = [];
    THEORY_QUESTIONS.forEach(q => {
      q.keywords.forEach(k => {
        if (!list.includes(k)) list.push(k);
      });
    });
    return list;
  }, []);

  const [shuffledKeywords, setShuffledKeywords] = useState<string[]>([]);
  const [theoryQuestions, setTheoryQuestions] = useState<TheoryQuestion[]>([]);
  const [elementQuizzes, setElementQuizzes] = useState<ElementSymbolQuiz[]>([]);
  const [compareQuizzes, setCompareQuizzes] = useState<CompareAtomQuiz[]>([]);
  const [correctionQuizzes, setCorrectionQuizzes] = useState<SymbolCorrectionQuiz[]>([]);

  // User responses state
  const [userTheoryAnswers, setUserTheoryAnswers] = useState<Record<string, string>>({});
  const [userElementAnswers, setUserElementAnswers] = useState<Record<string, string>>({});
  const [userCompareAnswers, setUserCompareAnswers] = useState<Record<string, number>>({});
  const [userCorrectionChoices, setUserCorrectionChoices] = useState<Record<string, 'dung' | 'sai'>>({});
  const [userCorrectionFixed, setUserCorrectionFixed] = useState<Record<string, string>>({});

  // Active blank currently selected to quickly insert from keyword bank
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null);

  // Submission result state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<QuizSubmission | null>(null);

  // Initialize and shuffle on first mount (App open)
  const initializeNewQuiz = () => {
    setShuffledKeywords(shuffleArray(allRawKeywords));
    setTheoryQuestions(shuffleArray(THEORY_QUESTIONS));
    setElementQuizzes(
      shuffleArray(ELEMENT_QUIZZES).map(q => ({
        ...q,
        options: shuffleArray(q.options),
      }))
    );
    setCompareQuizzes(shuffleArray(COMPARE_ATOM_QUIZZES));
    setCorrectionQuizzes(shuffleArray(SYMBOL_CORRECTION_QUIZZES));

    setUserTheoryAnswers({});
    setUserElementAnswers({});
    setUserCompareAnswers({});
    setUserCorrectionChoices({});
    setUserCorrectionFixed({});
    setActiveBlankId(null);
    setIsSubmitted(false);
    setCurrentSubmission(null);
    setSyncSuccess(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    initializeNewQuiz();
  }, [allRawKeywords]);

  // Timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  // Handle re-shuffle keywords explicitly
  const handleReshuffleKeywords = () => {
    setShuffledKeywords(shuffleArray(shuffledKeywords));
  };

  // Used keywords calculation
  const usedKeywords = useMemo(() => {
    return Object.values(userTheoryAnswers)
      .map(v => v.trim().toLowerCase())
      .filter(Boolean);
  }, [userTheoryAnswers]);

  // Handle selecting a keyword chip from the bank
  const handleSelectKeyword = (word: string) => {
    if (activeBlankId) {
      setUserTheoryAnswers(prev => ({
        ...prev,
        [activeBlankId]: word,
      }));
    } else {
      // Find the first unfilled blank in the current theory questions
      for (const q of theoryQuestions) {
        for (const b of q.blanks) {
          const key = `${q.id}_${b.id}`;
          if (!userTheoryAnswers[key]) {
            setUserTheoryAnswers(prev => ({
              ...prev,
              [key]: word,
            }));
            setActiveBlankId(key);
            return;
          }
        }
      }
    }
  };

  // Save student info handler
  const handleSaveStudent = (info: StudentInfo) => {
    setStudent(info);
    localStorage.setItem('hoa7_current_student', JSON.stringify(info));
    setIsStudentModalOpen(false);
  };

  // Calculate score and submit
  const handleSubmitQuiz = async () => {
    // If student info is missing, prompt user
    if (!student || !student.fullName) {
      setIsStudentModalOpen(true);
      return;
    }

    setIsTimerRunning(false);

    // 1. Calculate Nhận Biết
    let nbCorrect = 0;
    let nbTotal = 0;
    theoryQuestions.forEach(q => {
      q.blanks.forEach(b => {
        nbTotal++;
        const userVal = userTheoryAnswers[`${q.id}_${b.id}`] || '';
        if (isAnswerCorrect(userVal, b.correctAnswer, b.acceptableAnswers)) {
          nbCorrect++;
        }
      });
    });

    // 2. Calculate Thông Hiểu (20 elements)
    let thCorrect = 0;
    let thTotal = elementQuizzes.length;
    elementQuizzes.forEach(q => {
      if (userElementAnswers[q.id] === q.correctSymbol) {
        thCorrect++;
      }
    });

    // 3. Calculate Vận Dụng (Compare + Fix symbols)
    let vdCorrect = 0;
    let vdTotal = compareQuizzes.length + correctionQuizzes.length;
    compareQuizzes.forEach(q => {
      if (userCompareAnswers[q.id] === q.correctIndex) {
        vdCorrect++;
      }
    });

    correctionQuizzes.forEach(q => {
      const choice = userCorrectionChoices[q.id];
      const fixed = (userCorrectionFixed[q.id] || '').trim();
      const choiceIsCorrect =
        (q.isCorrect && choice === 'dung') || (!q.isCorrect && choice === 'sai');
      const fixIsCorrect = !q.isCorrect ? fixed === q.correctSymbol : true;

      if (choiceIsCorrect && fixIsCorrect) {
        vdCorrect++;
      }
    });

    const totalQuestions = nbTotal + thTotal + vdTotal;
    const totalCorrect = nbCorrect + thCorrect + vdCorrect;
    const rawScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 10 : 0;
    const finalScore = Math.round(rawScore * 10) / 10;

    let ranking: QuizSubmission['ranking'] = 'CẦN CỐ GẮNG';
    if (finalScore >= 9.0) ranking = 'XUẤT SẮC';
    else if (finalScore >= 8.0) ranking = 'GIỎI';
    else if (finalScore >= 6.5) ranking = 'KHÁ';
    else if (finalScore >= 5.0) ranking = 'ĐẠT';

    const submission: QuizSubmission = {
      id: `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      student: {
        ...student,
        submittedAt: new Date().toISOString(),
      },
      score: finalScore,
      correctCount: totalCorrect,
      totalQuestions: totalQuestions,
      durationSeconds: timerSeconds,
      ranking: ranking,
      breakdown: {
        nhanBiet: { correct: nbCorrect, total: nbTotal },
        thongHieu: { correct: thCorrect, total: thTotal },
        vanDung: { correct: vdCorrect, total: vdTotal },
      },
      answersDetail: {
        theory: userTheoryAnswers,
        elements: userElementAnswers,
        compare: userCompareAnswers,
        correctionChoices: userCorrectionChoices,
        correctionFixed: userCorrectionFixed,
      },
      submittedAt: new Date().toLocaleString('vi-VN'),
      syncedToGoogleSheet: false,
    };

    setCurrentSubmission(submission);
    setIsSubmitted(true);

    // Save locally
    const updatedSubmissions = [submission, ...submissions];
    setSubmissions(updatedSubmissions);
    saveCachedSubmissions(updatedSubmissions);

    // Automatic Sync to Google Sheet if configured
    if (syncConfig.autoSync && syncConfig.appsScriptUrl) {
      setIsSyncing(true);
      const res = await sendSubmissionToGoogleSheet(submission, syncConfig.appsScriptUrl);
      setIsSyncing(false);
      if (res.success) {
        setSyncSuccess(true);
      }
    }

    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manual sync to Google Sheet handler
  const handleManualSync = async () => {
    if (!currentSubmission) return;
    setIsSyncing(true);
    const res = await sendSubmissionToGoogleSheet(currentSubmission, syncConfig.appsScriptUrl);
    setIsSyncing(false);
    if (res.success) {
      setSyncSuccess(true);
    } else {
      if (!syncConfig.appsScriptUrl) {
        setIsSheetsSetupOpen(true);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Count answered blanks and questions
  const totalBlanksCount = theoryQuestions.reduce((acc, q) => acc + q.blanks.length, 0);
  const filledBlanksCount = Object.keys(userTheoryAnswers).filter(k => userTheoryAnswers[k]?.trim()).length;
  const answeredElementsCount = Object.keys(userElementAnswers).length;
  const answeredCompareCount = Object.keys(userCompareAnswers).length;
  const answeredCorrectionCount = Object.keys(userCorrectionChoices).length;

  const totalAnswered =
    filledBlanksCount + answeredElementsCount + answeredCompareCount + answeredCorrectionCount;
  const totalItems =
    totalBlanksCount + elementQuizzes.length + compareQuizzes.length + correctionQuizzes.length;
  const progressPercent = totalItems > 0 ? Math.round((totalAnswered / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Navbar with mobile & desktop layout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenSheetsSetup={() => setIsSheetsSetupOpen(true)}
        onOpenElementsModal={() => setIsElementsModalOpen(true)}
        onOpenBodyElementsModal={() => setIsBodyElementsModalOpen(true)}
        onOpenConceptMapModal={() => setIsConceptMapModalOpen(true)}
        isSheetConfigured={Boolean(syncConfig.appsScriptUrl)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* ==================================================== */}
        {/* TAB 1: BÀI TẬP ĐIỀN (3 MỨC ĐỘ) */}
        {/* ==================================================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-4 sm:p-7 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-[11px] sm:text-xs font-bold border border-white/20">
                      Khoa học tự nhiên 7 (Bài 2 & 3)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-semibold border border-emerald-400/30">
                      Kết Nối Tri Thức Với Cuộc Sống
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[11px] sm:text-xs font-semibold border border-purple-400/30">
                      Kết Hợp Liên Hoàn Chương I
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                    Bài Tập Điền: Nguyên Tử & Nguyên Tố Hoá Học
                  </h1>

                  <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                    Trọn vẹn 3 mức độ: <strong>Nhận biết</strong> (Mô hình Rutherford – Bohr, khối lượng amu, 118 nguyên tố, 96% cơ thể) &bull; <strong>Thông hiểu</strong> (20 nguyên tố đầu tiên) &bull; <strong>Vận dụng</strong> (So sánh nguyên tử cùng số proton, thám tử sửa sai kí hiệu).
                  </p>
                </div>

                {/* Student Info Card & Timer on phone & web */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/20 min-w-[240px] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-semibold text-indigo-200">Thí sinh:</span>
                    <button
                      onClick={() => setIsStudentModalOpen(true)}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 underline"
                    >
                      {student ? 'Đổi thông tin' : 'Điền thông tin'}
                    </button>
                  </div>

                  <div className="text-sm sm:text-base font-bold text-white truncate">
                    {student ? student.fullName : 'Chưa nhập tên học sinh'}
                  </div>

                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-indigo-200">
                    <span>Lớp: {student?.className || '---'}</span>
                    <span>SBD: {student?.studentId || '---'}</span>
                  </div>

                  {/* Timer & Progress */}
                  <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatSeconds(timerSeconds)}</span>
                    </div>
                    <div className="text-xs text-indigo-200">
                      Tiến độ: <strong>{progressPercent}%</strong> ({totalAnswered}/{totalItems})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS VIEW WHEN SUBMITTED */}
            {isSubmitted && currentSubmission && (
              <QuizResults
                submission={currentSubmission}
                onRetake={initializeNewQuiz}
                onSyncToSheet={handleManualSync}
                isSyncing={isSyncing}
                syncSuccess={syncSuccess}
              />
            )}

            {/* Sticky Keyword Bank (Mobile touch optimized) */}
            <div className="sticky top-14 sm:top-24 z-30">
              <KeywordBank
                keywords={shuffledKeywords}
                usedKeywords={usedKeywords}
                activeBlankId={activeBlankId}
                onSelectKeyword={handleSelectKeyword}
                onShuffle={handleReshuffleKeywords}
              />
            </div>

            {/* Quick Interactive Features Shortcuts (3 Columns Grid on Web & Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setIsConceptMapModalOpen(true)}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-left flex items-center justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-indigo-700">
                      Sơ Đồ Tư Duy Bài 2 & 3
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Bản chất p = Z kết nối nguyên tử & nguyên tố
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsBodyElementsModalOpen(true)}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-left flex items-center justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-rose-700">
                      4 Nguyên Tố Tạo 96% Cơ Thể
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Oxygen 65%, Carbon 18.5%, Hydrogen 9.5%...
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cards_game')}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-left flex items-center justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-700">
                      Xếp 12 Tấm Thẻ Nguyên Tử
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Hoạt động thực hành SGK Bài 3 trang 20
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* ==================================================== */}
            {/* PHẦN 1: NHẬN BIẾT - ĐIỀN KHUYẾT LÝ THUYẾT */}
            {/* ==================================================== */}
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 text-blue-800 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  I
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm sm:text-lg">
                    PHẦN 1: MỨC ĐỘ NHẬN BIẾT (Rutherford – Bohr, amu, 118 Nguyên Tố & Cơ Thể)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Chạm ô trống và chọn từ khóa tương ứng từ Ngân hàng từ khóa để điền
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {theoryQuestions.map((q, idx) => (
                  <TheoryQuestionCard
                    key={q.id}
                    question={q}
                    questionIndex={idx}
                    userAnswers={userTheoryAnswers}
                    activeBlankId={activeBlankId}
                    onSelectBlank={blankId => setActiveBlankId(blankId)}
                    onAnswerChange={(blankId, val) =>
                      setUserTheoryAnswers(prev => ({ ...prev, [blankId]: val }))
                    }
                    isSubmitted={isSubmitted}
                  />
                ))}
              </div>
            </section>

            {/* ==================================================== */}
            {/* PHẦN 2: THÔNG HIỂU - 20 NGUYÊN TỐ ĐẦU TIÊN */}
            {/* ==================================================== */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  II
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm sm:text-lg">
                    PHẦN 2: MỨC ĐỘ THÔNG HIỂU (20 Nguyên tố hoá học đầu tiên & Khối lượng amu)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Chọn kí hiệu hoá học chính xác theo danh pháp IUPAC chương trình mới 2018
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {elementQuizzes.map((quiz, idx) => (
                  <ElementQuizCard
                    key={quiz.id}
                    quiz={quiz}
                    index={idx}
                    selectedAnswer={userElementAnswers[quiz.id]}
                    onSelect={sym =>
                      setUserElementAnswers(prev => ({ ...prev, [quiz.id]: sym }))
                    }
                    isSubmitted={isSubmitted}
                  />
                ))}
              </div>
            </section>

            {/* ==================================================== */}
            {/* PHẦN 3: VẬN DỤNG - SO SÁNH NGUYÊN TỬ & SỬA SAI KÍ HIỆU */}
            {/* ==================================================== */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-100 text-purple-800 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
                  III
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm sm:text-lg">
                    PHẦN 3: MỨC ĐỘ VẬN DỤNG (So sánh nguyên tử & Thám tử sửa sai kí hiệu)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Vận dụng tính chất số proton xác định nguyên tố và quy tắc viết hoa - thường
                  </p>
                </div>
              </div>

              {/* Sub-section: So sánh nguyên tử */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  1. So sánh các nguyên tử có cùng một nguyên tố hoá học
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {compareQuizzes.map((quiz, idx) => (
                    <CompareAtomCard
                      key={quiz.id}
                      quiz={quiz}
                      index={idx}
                      selectedIndex={userCompareAnswers[quiz.id]}
                      onSelect={optIdx =>
                        setUserCompareAnswers(prev => ({ ...prev, [quiz.id]: optIdx }))
                      }
                      isSubmitted={isSubmitted}
                    />
                  ))}
                </div>
              </div>

              {/* Sub-section: Sửa sai kí hiệu */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  2. Thám tử hoá học: Sửa sai các kí hiệu nguyên tố chưa đúng chuẩn
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {correctionQuizzes.map((quiz, idx) => (
                    <SymbolCorrectionCard
                      key={quiz.id}
                      quiz={quiz}
                      index={idx}
                      userChoice={userCorrectionChoices[quiz.id]}
                      userFixedText={userCorrectionFixed[quiz.id]}
                      onChoiceChange={choice =>
                        setUserCorrectionChoices(prev => ({ ...prev, [quiz.id]: choice }))
                      }
                      onFixedTextChange={text =>
                        setUserCorrectionFixed(prev => ({ ...prev, [quiz.id]: text }))
                      }
                      isSubmitted={isSubmitted}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom Submit Action Bar (Responsive Mobile Floating) */}
            <div className="sticky bottom-3 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-5 rounded-3xl shadow-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                  {progressPercent}%
                </div>
                <div className="truncate">
                  <div className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                    {student ? student.fullName : 'Học sinh chưa điền tên'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Đã điền {totalAnswered} / {totalItems} câu
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={initializeNewQuiz}
                  className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                  title="Xáo trộn lại đề mới"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đảo đề mới</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-1.5 sm:gap-2 transition-all flex-1 sm:flex-none active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{isSubmitted ? 'Chấm Lại Điểm' : 'Nộp Bài & Chấm Điểm'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: XẾP 12 TẤM THẺ NGUYÊN TỬ (SGK BÀI 3 TRANG 20) */}
        {/* ==================================================== */}
        {activeTab === 'cards_game' && (
          <div className="space-y-4">
            <CardSortingGame />
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: MÔ HÌNH NGUYÊN TỬ RUTHERFORD - BOHR */}
        {/* ==================================================== */}
        {activeTab === 'atom_viewer' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-1">
                Phòng Thí Nghiệm Ảo: Mô Hình Nguyên Tử Rutherford – Bohr
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
                Mô phỏng chuyển động của electron quanh hạt nhân nguyên tử theo từng lớp (Lớp 1: tối đa 2e, Lớp 2: tối đa 8e)
              </p>
              <AtomicModelViewer initialZ={6} interactive={true} />
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: SỔ ĐIỂM & BÁO CÁO HỌC SINH (MEMBER / TEACHER PORTAL) */}
        {/* ==================================================== */}
        {activeTab === 'teacher_portal' && (
          <TeacherPortal
            submissions={submissions}
            syncConfig={syncConfig}
            onUpdateSubmissions={setSubmissions}
            onOpenSetupModal={() => setIsSheetsSetupOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <StudentInfoModal
        isOpen={isStudentModalOpen}
        initialInfo={student}
        onSave={handleSaveStudent}
      />

      <GoogleSheetsSetupModal
        isOpen={isSheetsSetupOpen}
        onClose={() => setIsSheetsSetupOpen(false)}
        config={syncConfig}
        onSaveConfig={setSyncConfig}
      />

      <ElementsReferenceModal
        isOpen={isElementsModalOpen}
        onClose={() => setIsElementsModalOpen(false)}
      />

      <HumanBodyElementsModal
        isOpen={isBodyElementsModalOpen}
        onClose={() => setIsBodyElementsModalOpen(false)}
      />

      <ConceptMapModal
        isOpen={isConceptMapModalOpen}
        onClose={() => setIsConceptMapModalOpen(false)}
      />
    </div>
  );
}
