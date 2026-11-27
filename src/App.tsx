import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ExternalLink,
  Minus,
  NotebookPen,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import skyBg from "./assets/sky-bg.jpg";
import { CATEGORIES, DOCS, SCHEDULE } from "./data/scheduleData";

const STORAGE_KEY = "starters_schedule_progress_v1";
const FREE_STUDY_STARS = 2;

type StudyMode = "schedule" | "free";

interface FreeSessionLog {
  count: number;
  lastDate?: string;
  todayCount?: number;
}

interface ProgressState {
  completed: Record<string, boolean>;
  activeDayId: string;
  studyMode: StudyMode;
  freeSessions: Record<string, FreeSessionLog>;
  bookNotes: Record<string, string>;
}

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      const todayKey = getTodayKey();
      const rawFree = parsed.freeSessions ?? {};
      const normalizedFree: Record<string, FreeSessionLog> = {};

      for (const [key, val] of Object.entries(rawFree)) {
        if (val && typeof val.count === "number" && val.count > 0) {
          normalizedFree[key] = {
            count: val.count,
            lastDate: val.lastDate,
            todayCount: val.lastDate === todayKey ? (val.todayCount ?? 0) : 0,
          };
        }
      }

      return {
        completed: parsed.completed ?? {},
        activeDayId: parsed.activeDayId ?? "mon",
        studyMode: parsed.studyMode === "free" ? "free" : "schedule",
        freeSessions: normalizedFree,
        bookNotes: parsed.bookNotes ?? {},
      };
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return {
    completed: {},
    activeDayId: "mon",
    studyMode: "schedule",
    freeSessions: {},
    bookNotes: {},
  };
}

interface ToastPayload {
  message: string;
  undoState?: {
    completed: Record<string, boolean>;
    freeSessions: Record<string, FreeSessionLog>;
  };
}

export default function App() {
  const initialState = useMemo(() => loadState(), []);

  const [completed, setCompleted] = useState<Record<string, boolean>>(initialState.completed);
  const [activeDayId, setActiveDayId] = useState<string>(initialState.activeDayId);
  const [studyMode, setStudyMode] = useState<StudyMode>(initialState.studyMode);
  const [freeSessions, setFreeSessions] = useState<Record<string, FreeSessionLog>>(
    initialState.freeSessions
  );
  const [bookNotes, setBookNotes] = useState<Record<string, string>>(initialState.bookNotes);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [onlyWithNotes, setOnlyWithNotes] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toast, setToast] = useState<ToastPayload | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const dayTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const librarySectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completed,
          activeDayId,
          studyMode,
          freeSessions,
          bookNotes,
        })
      );
    } catch {
      // Ignore storage write errors
    }
  }, [completed, activeDayId, studyMode, freeSessions, bookNotes]);

  const showToast = (message: string, undoState?: ToastPayload["undoState"]) => {
    setToast({ message, undoState });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, undoState ? 4500 : 2400);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const { scheduleStars, maxScheduleStars, freeStars, totalFreeSessions, todayFreeSessions, totalStars } =
    useMemo(() => {
      let schedEarned = 0;
      let schedPossible = 0;

      for (const day of SCHEDULE) {
        let allDone = day.tasks.length > 0;
        for (const task of day.tasks) {
          schedPossible += task.stars;
          if (completed[task.id]) {
            schedEarned += task.stars;
          } else {
            allDone = false;
          }
        }
        if (day.tasks.length > 0) {
          schedPossible += 2;
        }
        if (allDone) {
          schedEarned += 2;
        }
      }

      const todayKey = getTodayKey();
      let sessionsCount = 0;
      let todayCount = 0;

      for (const log of Object.values(freeSessions)) {
        sessionsCount += log.count;
        if (log.lastDate === todayKey) {
          todayCount += log.todayCount ?? 0;
        }
      }

      const freeEarned = sessionsCount * FREE_STUDY_STARS;

      return {
        scheduleStars: schedEarned,
        maxScheduleStars: schedPossible,
        freeStars: freeEarned,
        totalFreeSessions: sessionsCount,
        todayFreeSessions: todayCount,
        totalStars: schedEarned + freeEarned,
      };
    }, [completed, freeSessions]);

  const activeDay = useMemo(
    () => SCHEDULE.find((d) => d.id === activeDayId) ?? SCHEDULE[0],
    [activeDayId]
  );

  const dayStats = useMemo(() => {
    const totalTasks = activeDay.tasks.length;
    const doneTasks = activeDay.tasks.filter((t) => !!completed[t.id]).length;
    const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const isDayComplete = totalTasks > 0 && doneTasks === totalTasks;
    return { totalTasks, doneTasks, pct, isDayComplete };
  }, [activeDay, completed]);

  const notedBooksCount = useMemo(
    () => Object.values(bookNotes).filter((note) => note.trim().length > 0).length,
    [bookNotes]
  );

  const filteredDocs = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return Object.entries(DOCS)
      .map(([key, doc]) => ({ key, ...doc }))
      .filter((doc) => {
        const matchCat = activeCategory === "all" || doc.cat === activeCategory;
        const matchNotes = !onlyWithNotes || (bookNotes[doc.key] ?? "").trim().length > 0;
        const noteText = (bookNotes[doc.key] ?? "").toLowerCase();
        const matchSearch =
          !keyword ||
          doc.name.toLowerCase().includes(keyword) ||
          doc.desc.toLowerCase().includes(keyword) ||
          doc.cat.toLowerCase().includes(keyword) ||
          noteText.includes(keyword);
        return matchCat && matchNotes && matchSearch;
      });
  }, [activeCategory, onlyWithNotes, searchQuery, bookNotes]);

  const selectDay = (dayId: string) => {
    setActiveDayId(dayId);
    const btn = dayTabRefs.current[dayId];
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const toggleTask = (taskId: string, stars: number) => {
    const isCurrentlyChecked = !!completed[taskId];
    const nextChecked = !isCurrentlyChecked;

    const day = SCHEDULE.find((d) => d.tasks.some((t) => t.id === taskId));
    const wasDayComplete = day ? day.tasks.every((t) => !!completed[t.id]) : false;

    const nextCompleted = { ...completed };
    if (nextChecked) {
      nextCompleted[taskId] = true;
    } else {
      delete nextCompleted[taskId];
    }

    setCompleted(nextCompleted);

    const isNowDayComplete = day ? day.tasks.every((t) => !!nextCompleted[t.id]) : false;
    if (nextChecked && !wasDayComplete && isNowDayComplete) {
      showToast(`Hoàn thành trọn ngày! Nhận +${stars} sao & +2 sao thưởng thêm!`);
    } else if (nextChecked) {
      showToast(`Giỏi quá! Con vừa nhận +${stars} sao!`);
    } else {
      showToast("Đã bỏ tích mục này.");
    }
  };

  const addFreeSession = (docKey: string, docName: string) => {
    const todayKey = getTodayKey();
    const current = freeSessions[docKey];
    const prevToday = current?.lastDate === todayKey ? (current.todayCount ?? 0) : 0;

    setFreeSessions((prev) => ({
      ...prev,
      [docKey]: {
        count: (prev[docKey]?.count ?? 0) + 1,
        lastDate: todayKey,
        todayCount: prevToday + 1,
      },
    }));

    showToast(`Đã ghi nhận +1 buổi tự học "${docName}" (+${FREE_STUDY_STARS} ★)!`);
  };

  const removeFreeSession = (docKey: string, docName: string) => {
    const current = freeSessions[docKey];
    if (!current || current.count <= 0) return;
    const todayKey = getTodayKey();

    setFreeSessions((prev) => {
      const item = prev[docKey];
      if (!item || item.count <= 1) {
        const next = { ...prev };
        delete next[docKey];
        return next;
      }
      const nextToday =
        item.lastDate === todayKey ? Math.max(0, (item.todayCount ?? 0) - 1) : 0;
      return {
        ...prev,
        [docKey]: {
          count: item.count - 1,
          lastDate: item.lastDate,
          todayCount: nextToday,
        },
      };
    });

    showToast(`Đã giảm 1 buổi tự học của "${docName}".`);
  };

  const updateBookNote = (docKey: string, value: string) => {
    setBookNotes((prev) => {
      if (!value) {
        const next = { ...prev };
        delete next[docKey];
        return next;
      }
      return {
        ...prev,
        [docKey]: value,
      };
    });
  };

  const resetCurrentDay = () => {
    const hasAny = activeDay.tasks.some((t) => !!completed[t.id]);
    if (!hasAny) {
      showToast(`${activeDay.tab} chưa có mục nào được tích.`);
      return;
    }
    const previousCompleted = { ...completed };
    const nextCompleted = { ...completed };
    for (const t of activeDay.tasks) {
      delete nextCompleted[t.id];
    }
    setCompleted(nextCompleted);
    showToast(`Đã đặt lại tiến độ ${activeDay.tab}.`, {
      completed: previousCompleted,
      freeSessions: { ...freeSessions },
    });
  };

  const resetAllProgress = () => {
    if (Object.keys(completed).length === 0 && Object.keys(freeSessions).length === 0) {
      showToast("Chưa có tiến độ nào để xóa.");
      return;
    }
    const previousState = {
      completed: { ...completed },
      freeSessions: { ...freeSessions },
    };
    setCompleted({});
    setFreeSessions({});
    showToast("Đã xóa toàn bộ tiến độ & sao thưởng (vẫn giữ ghi chú Unit/trang).", previousState);
  };

  const resetFreeSessions = () => {
    if (Object.keys(freeSessions).length === 0) {
      showToast("Chưa có buổi học tự do nào được ghi nhận.");
      return;
    }
    const previousState = {
      completed: { ...completed },
      freeSessions: { ...freeSessions },
    };
    setFreeSessions({});
    showToast("Đã đặt lại số buổi học tự do (vẫn giữ ghi chú Unit/trang).", previousState);
  };

  const handleUndo = () => {
    if (!toast?.undoState) return;
    setCompleted(toast.undoState.completed);
    setFreeSessions(toast.undoState.freeSessions);
    setToast(null);
    showToast("Đã khôi phục tiến độ trước đó.");
  };

  const switchToSchedule = () => {
    setStudyMode("schedule");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchToFreeStudy = () => {
    setStudyMode("free");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpToLibrary = () => {
    if (studyMode === "free") {
      librarySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    librarySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const jumpToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const starRingPct =
    maxScheduleStars > 0
      ? Math.min(100, Math.round((Math.min(scheduleStars, maxScheduleStars) / maxScheduleStars) * 100))
      : 0;
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - starRingPct / 100);

  return (
    <>
      <div
        className="sky-backdrop"
        style={{ backgroundImage: `url(${skyBg})` }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 pt-4 pb-24 sm:px-6 sm:pt-6 sm:pb-14">
        {/* Hero Header */}
        <header className="glass-panel rounded-2xl p-5 sm:p-6 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 min-w-0">
              <h1 className="font-display text-xl sm:text-2xl lg:text-[1.65rem] font-bold tracking-tight text-[#0E4D6C] text-balance">
                Thời Khóa Biểu Tiếng Anh Starters (60 Phút/Ngày)
              </h1>
              <p className="text-sm sm:text-[0.95rem] font-medium text-[#1D82B4] leading-relaxed">
                Tích hoàn thành từng phần để nhận sao thưởng • Tất cả tài liệu &amp; link học tập tập trung tại 1 trang
              </p>
            </div>

            <div
              className="flex items-center gap-3.5 bg-[#EBF7FC] border border-[#1D82B4]/35 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shrink-0 self-start lg:self-auto"
              aria-live="polite"
            >
              <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
                  <circle
                    cx="22"
                    cy="22"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(29, 130, 180, 0.2)"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={ringRadius}
                    fill="none"
                    stroke="#1D82B4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringDashOffset}
                    className="transition-all duration-300"
                  />
                </svg>
                <Star
                  className="w-5 h-5 text-[#1D82B4] fill-[#1D82B4] absolute"
                  aria-hidden="true"
                />
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-[#0E4D6C] leading-tight tabular-nums">
                  <span id="totalStars">{totalStars}</span> Sao
                </div>
                <div className="text-xs font-semibold text-[#1D82B4] mt-0.5 tabular-nums">
                  {freeStars > 0
                    ? `Lịch mẫu: ${scheduleStars} ★ · Tự do: ${freeStars} ★`
                    : "Hoàn thành đủ 1 ngày: +2 ★ thưởng thêm"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Study Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div
            role="tablist"
            aria-label="Chọn chế độ học"
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/95 border border-[#0E4D6C]/15 self-start w-full sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={studyMode === "schedule"}
              onClick={() => setStudyMode("schedule")}
              className={`flex-1 sm:flex-initial whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-150 cursor-pointer inline-flex items-center justify-center gap-2 ${
                studyMode === "schedule"
                  ? "bg-[#0E4D6C] text-[#EBF7FC]"
                  : "text-[#0E4D6C] hover:bg-[#EBF7FC]"
              }`}
            >
              <CalendarDays className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Học theo lịch mẫu</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={studyMode === "free"}
              onClick={() => setStudyMode("free")}
              className={`flex-1 sm:flex-initial whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-150 cursor-pointer inline-flex items-center justify-center gap-2 tabular-nums ${
                studyMode === "free"
                  ? "bg-[#0E4D6C] text-[#EBF7FC]"
                  : "text-[#0E4D6C] hover:bg-[#EBF7FC]"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Học tự do theo sách</span>
              {totalFreeSessions > 0 && (
                <span
                  className={`text-xs font-semibold ${
                    studyMode === "free" ? "text-[#EBF7FC]/85" : "text-[#1D82B4]"
                  }`}
                >
                  ({totalFreeSessions})
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 shrink-0">
            {studyMode === "schedule" ? (
              <>
                <button
                  type="button"
                  onClick={jumpToLibrary}
                  className="whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/95 text-[#0E4D6C] border border-[#0E4D6C]/15 hover:border-[#1D82B4] hover:bg-[#EBF7FC] transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-[#1D82B4]" aria-hidden="true" />
                  <span>Kho tài liệu</span>
                </button>
                <button
                  type="button"
                  onClick={resetCurrentDay}
                  className="whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/95 text-[#0E4D6C] border border-[#0E4D6C]/15 hover:border-[#1D82B4] hover:bg-[#EBF7FC] transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-[#1D82B4]" aria-hidden="true" />
                  <span>Đặt lại ngày này</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={resetFreeSessions}
                className="whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/95 text-[#0E4D6C] border border-[#0E4D6C]/15 hover:border-[#1D82B4] hover:bg-[#EBF7FC] transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-[#1D82B4]" aria-hidden="true" />
                <span>Đặt lại buổi tự do</span>
              </button>
            )}
            <button
              type="button"
              onClick={resetAllProgress}
              className="whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/95 text-[#0E4D6C] border border-[#0E4D6C]/15 hover:border-[#1D82B4] hover:bg-[#EBF7FC] transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-[#1D82B4]" aria-hidden="true" />
              <span>Xóa toàn bộ tiến độ</span>
            </button>
          </div>
        </div>

        {/* SCHEDULE VIEW */}
        {studyMode === "schedule" && (
          <>
            {/* Day Tabs */}
            <nav
              aria-label="Chọn ngày học trong tuần"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 lg:flex-wrap mb-4"
            >
              {SCHEDULE.map((day) => {
                const doneCount = day.tasks.filter((t) => !!completed[t.id]).length;
                const isComplete = doneCount === day.tasks.length;
                const isActive = day.id === activeDay.id;
                const badgeText = isComplete ? " ✓" : ` (${doneCount}/${day.tasks.length})`;

                return (
                  <button
                    key={day.id}
                    ref={(el) => {
                      dayTabRefs.current[day.id] = el;
                    }}
                    type="button"
                    onClick={() => selectDay(day.id)}
                    aria-pressed={isActive}
                    className={`snap-start whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 cursor-pointer flex items-center gap-1.5 tabular-nums ${
                      isActive
                        ? "bg-[#0E4D6C] text-[#EBF7FC] border-[#0E4D6C] shadow-sm"
                        : "bg-white/95 text-[#0E4D6C] border-[#0E4D6C]/15 hover:border-[#1D82B4] hover:bg-[#EBF7FC]"
                    }`}
                  >
                    <span>{day.tab}</span>
                    <span
                      className={`text-xs font-medium ${
                        isActive
                          ? "text-[#EBF7FC]/90"
                          : isComplete
                            ? "text-[#1D82B4] font-bold"
                            : "text-[#1D82B4]"
                      }`}
                    >
                      {badgeText}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Main Day Schedule Card */}
            <main id="dayCard" className="glass-panel rounded-2xl p-4 sm:p-6 mb-7">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 mb-4 border-b border-dashed border-[#1D82B4]/30">
                <div className="space-y-1 min-w-0">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#0E4D6C] text-balance">
                    {activeDay.title}
                  </h2>
                  <p className="text-sm font-medium text-[#1D82B4]">{activeDay.theme}</p>
                </div>

                <div className="w-full md:w-72 shrink-0 bg-[#EBF7FC] border border-[#1D82B4]/20 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0E4D6C] mb-2 tabular-nums">
                    <span>
                      Tiến độ ngày: {dayStats.doneTasks}/{dayStats.totalTasks} mục
                    </span>
                    <span className="font-mono-num text-[#1D82B4]">{dayStats.pct}%</span>
                  </div>
                  <div
                    className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#1D82B4]/25"
                    role="progressbar"
                    aria-valuenow={dayStats.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#1D82B4] to-[#0E4D6C] rounded-full transition-all duration-300"
                      style={{ width: `${dayStats.pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {activeDay.tasks.map((task) => {
                  const checked = !!completed[task.id];
                  const taskDocs = (task.docs || [])
                    .map((key) => ({ key, ...DOCS[key] }))
                    .filter((d) => !!d.url);

                  return (
                    <article
                      key={task.id}
                      className={`glass-card rounded-2xl p-4 sm:p-5 ${
                        checked
                          ? "bg-[#EBF7FC] border-[#1D82B4]/45"
                          : "bg-white border-[#0E4D6C]/12"
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          aria-label={`Hoàn thành ${task.title}`}
                          onClick={() => toggleTask(task.id, task.stars)}
                          className="min-w-[44px] min-h-[44px] -ml-2 -mt-1.5 flex items-center justify-center rounded-xl cursor-pointer shrink-0 group"
                        >
                          <span
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-150 ${
                              checked
                                ? "bg-[#0E4D6C] border-[#0E4D6C] text-white"
                                : "bg-white border-[#1D82B4]/55 text-transparent group-hover:border-[#0E4D6C]"
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                          </span>
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[0.8rem]">
                              <span className="font-bold text-[#0E4D6C] tabular-nums">
                                {task.time}
                              </span>
                              <span className="text-[#1D82B4]/60" aria-hidden="true">
                                ·
                              </span>
                              <span className="font-semibold text-[#1D82B4]">{task.skill}</span>
                            </div>

                            <div
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums shrink-0 border transition-colors duration-150 ${
                                checked
                                  ? "bg-[#0E4D6C] text-[#EBF7FC] border-[#0E4D6C]"
                                  : "bg-[#EBF7FC] text-[#0E4D6C] border-[#1D82B4]/30"
                              }`}
                            >
                              +{task.stars} ★
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleTask(task.id, task.stars)}
                            className="text-left w-full cursor-pointer group/text"
                          >
                            <h3
                              className={`font-display text-base sm:text-[1.04rem] font-bold text-[#0E4D6C] mb-1 transition-opacity ${
                                checked ? "line-through opacity-65" : "group-hover/text:text-[#1D82B4]"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <p className="text-sm text-[#0E4D6C]/85 leading-relaxed mb-2.5">
                              {task.desc}
                            </p>
                          </button>

                          {taskDocs.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {taskDocs.map((doc) => {
                                const savedNote = (bookNotes[doc.key] ?? "").trim();
                                return (
                                  <a
                                    key={doc.key}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[34px] px-3 py-1.5 rounded-lg text-xs sm:text-[0.82rem] font-semibold bg-[#EBF7FC] text-[#0E4D6C] border border-[#1D82B4]/40 hover:bg-[#1D82B4] hover:text-white hover:border-[#1D82B4] transition-colors duration-150"
                                  >
                                    <span>{doc.name}</span>
                                    {savedNote && (
                                      <span className="opacity-75 font-medium">({savedNote})</span>
                                    )}
                                    <ExternalLink
                                      className="w-3.5 h-3.5 shrink-0 opacity-80"
                                      aria-hidden="true"
                                    />
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {dayStats.isDayComplete && (
                <div
                  role="status"
                  className="mt-4 p-4 sm:px-5 rounded-2xl bg-[#0E4D6C] text-[#EBF7FC] border border-[#1D82B4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#EBF7FC] shrink-0" aria-hidden="true" />
                    <span className="text-sm sm:text-base">
                      Tuyệt vời! Con đã hoàn thành trọn vẹn lịch học ngày hôm nay!
                    </span>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap shrink-0 tabular-nums self-start sm:self-auto bg-[#1D82B4] px-3 py-1 rounded-lg">
                    +2 ★ Thưởng hoàn thành ngày
                  </span>
                </div>
              )}
            </main>
          </>
        )}

        {/* FREE STUDY SUMMARY BANNER (shown prominently at top when in Free Study mode) */}
        {studyMode === "free" && (
          <section className="glass-panel rounded-2xl p-4 sm:p-5 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0E4D6C]">
                  Học tự do theo từng đầu sách
                </h2>
                <p className="text-sm text-[#1D82B4] font-medium">
                  Mở bất kỳ sách nào bên dưới để học, ghi chú lại Unit/trang đang dừng và bấm{" "}
                  <span className="font-bold text-[#0E4D6C]">+1 buổi (+{FREE_STUDY_STARS} ★)</span>{" "}
                  khi học xong.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#EBF7FC] border border-[#1D82B4]/25 rounded-xl px-4 py-3 shrink-0 tabular-nums">
                <div>
                  <div className="text-xs font-semibold text-[#1D82B4]">Hôm nay</div>
                  <div className="font-display text-lg font-bold text-[#0E4D6C]">
                    {todayFreeSessions} buổi
                  </div>
                </div>
                <div className="w-px h-8 bg-[#1D82B4]/25" aria-hidden="true" />
                <div>
                  <div className="text-xs font-semibold text-[#1D82B4]">Tổng tích lũy</div>
                  <div className="font-display text-lg font-bold text-[#0E4D6C]">
                    {totalFreeSessions} buổi · {freeStars} ★
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RESOURCE LIBRARY & FREE-STUDY BOOK CARDS */}
        <section
          id="librarySection"
          ref={librarySectionRef}
          className="glass-panel rounded-2xl p-4 sm:p-6 scroll-mt-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0E4D6C]">
              Kho Tài Liệu Tập Trung (Starters &amp; Bricks)
            </h2>
            <div className="text-xs sm:text-sm font-medium text-[#1D82B4] tabular-nums">
              {Object.keys(DOCS).length} đầu sách · {notedBooksCount} sách có ghi chú Unit/trang
            </div>
          </div>

          {/* Search & Category Controls */}
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#1D82B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="libSearch"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh tài liệu (Harcourt, Bricks, Quizlet, Read Along...)"
                aria-label="Tìm nhanh tài liệu"
                className="w-full min-h-[44px] pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#1D82B4]/30 text-base sm:text-sm text-[#0E4D6C] placeholder:text-[#1D82B4]/75 focus:border-[#0E4D6C] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-[#1D82B4] hover:text-[#0E4D6C] rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              role="tablist"
              aria-label="Lọc theo nhóm tài liệu"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const label = cat === "all" ? "Tất cả" : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#1D82B4] text-white border-[#1D82B4] shadow-sm"
                        : "bg-[#EBF7FC] text-[#0E4D6C] border-[#1D82B4]/25 hover:border-[#1D82B4]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              <button
                type="button"
                aria-pressed={onlyWithNotes}
                onClick={() => setOnlyWithNotes((prev) => !prev)}
                className={`whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5 tabular-nums ${
                  onlyWithNotes
                    ? "bg-[#0E4D6C] text-white border-[#0E4D6C] shadow-sm"
                    : "bg-white text-[#0E4D6C] border-[#1D82B4]/25 hover:border-[#1D82B4]"
                }`}
              >
                <NotebookPen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Đang ghi chú ({notedBooksCount})</span>
              </button>
            </div>
          </div>

          {/* Library Grid */}
          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-[#0E4D6C]/12 rounded-2xl p-6 text-center space-y-3">
              <p className="text-sm font-medium text-[#1D82B4]">
                {searchQuery.trim()
                  ? `Không tìm thấy tài liệu phù hợp với từ khóa "${searchQuery.trim()}".`
                  : "Chưa có tài liệu nào khớp bộ lọc đang chọn."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setOnlyWithNotes(false);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold bg-[#EBF7FC] text-[#0E4D6C] border border-[#1D82B4]/35 hover:bg-[#1D82B4] hover:text-white transition-colors cursor-pointer"
              >
                Tất cả
              </button>
            </div>
          ) : (
            <div id="libGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredDocs.map((doc) => {
                const sessionLog = freeSessions[doc.key];
                const sessionCount = sessionLog?.count ?? 0;
                const todayCount =
                  sessionLog?.lastDate === getTodayKey() ? (sessionLog.todayCount ?? 0) : 0;
                const noteVal = bookNotes[doc.key] ?? "";

                return (
                  <article
                    key={doc.key}
                    className={`glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 ${
                      todayCount > 0 ? "border-[#1D82B4]/45 bg-[#F7FCFF]" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      <div>
                        {/* Unboxed clean metadata kicker */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                          <span className="font-semibold text-[#1D82B4]">{doc.cat}</span>
                          {sessionCount > 0 && (
                            <span className="font-bold text-[#0E4D6C] tabular-nums">
                              {sessionCount} buổi{todayCount > 0 ? ` · Hôm nay: ${todayCount}` : ""}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-base font-bold text-[#0E4D6C] mb-1.5 leading-snug">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-[#0E4D6C]/80 leading-relaxed">{doc.desc}</p>
                      </div>

                      {/* Unit / Page Bookmark Input */}
                      <div className="relative">
                        <NotebookPen
                          className="w-3.5 h-3.5 text-[#1D82B4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          value={noteVal}
                          onChange={(e) => updateBookNote(doc.key, e.target.value)}
                          placeholder="Ghi chú Unit / trang (vd: Unit 3 - tr.24)"
                          aria-label={`Ghi chú Unit hoặc trang cho ${doc.name}`}
                          className="w-full min-h-[42px] sm:min-h-[38px] pl-8 pr-8 py-1.5 rounded-xl bg-[#EBF7FC]/80 border border-[#1D82B4]/25 text-base sm:text-xs font-medium text-[#0E4D6C] placeholder:text-[#1D82B4]/75 focus:bg-white focus:border-[#0E4D6C] focus:outline-none transition-colors"
                        />
                        {noteVal && (
                          <button
                            type="button"
                            onClick={() => updateBookNote(doc.key, "")}
                            aria-label={`Xóa ghi chú của ${doc.name}`}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-[#1D82B4] hover:text-[#0E4D6C] rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions: Preserved External Link + Free Study Session Counter */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#1D82B4] text-white hover:bg-[#0E4D6C] transition-colors duration-150 whitespace-nowrap"
                      >
                        <span>Mở tài liệu →</span>
                      </a>

                      <div className="inline-flex items-center gap-1 ml-auto">
                        {sessionCount > 0 && (
                          <button
                            type="button"
                            onClick={() => removeFreeSession(doc.key, doc.name)}
                            aria-label={`Giảm 1 buổi học của ${doc.name}`}
                            title="Giảm 1 buổi"
                            className="min-w-[44px] sm:min-w-[38px] min-h-[44px] sm:min-h-[38px] flex items-center justify-center rounded-xl bg-[#EBF7FC] text-[#0E4D6C] border border-[#1D82B4]/30 hover:border-[#0E4D6C] transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => addFreeSession(doc.key, doc.name)}
                          className="min-h-[44px] sm:min-h-[38px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#EBF7FC] text-[#0E4D6C] border border-[#1D82B4]/40 hover:bg-[#0E4D6C] hover:text-[#EBF7FC] hover:border-[#0E4D6C] transition-colors duration-150 cursor-pointer inline-flex items-center gap-1 whitespace-nowrap tabular-nums"
                        >
                          <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>1 buổi (+{FREE_STUDY_STARS} ★)</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="glass-panel rounded-2xl mt-6 px-4 py-3.5 text-center text-xs sm:text-sm font-semibold text-[#0E4D6C]">
          Created by Le Hanh (Tài liệu có thể lỗi không mở được nếu chủ sở hữu file gốc thay đổi)
        </footer>
      </div>

      {/* Compact Mobile Thumb-Zone Bottom Bar (< 10% viewport height) */}
      <nav
        aria-label="Điều hướng nhanh trên di động"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#1D82B4]/25 pb-safe"
      >
        <div className="grid grid-cols-3 h-14 max-w-md mx-auto">
          <button
            type="button"
            onClick={switchToSchedule}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold cursor-pointer transition-colors ${
              studyMode === "schedule" ? "text-[#0E4D6C]" : "text-[#1D82B4]"
            }`}
          >
            <CalendarDays className="w-5 h-5" aria-hidden="true" />
            <span>Lịch mẫu</span>
          </button>

          <button
            type="button"
            onClick={switchToFreeStudy}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold cursor-pointer transition-colors ${
              studyMode === "free" ? "text-[#0E4D6C]" : "text-[#1D82B4]"
            }`}
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            <span>Học tự do</span>
          </button>

          <button
            type="button"
            onClick={jumpToTop}
            className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold text-[#0E4D6C] cursor-pointer tabular-nums"
          >
            <Star className="w-5 h-5 text-[#1D82B4] fill-[#1D82B4]" aria-hidden="true" />
            <span>{totalStars} Sao</span>
          </button>
        </div>
      </nav>

      {/* Toast Feedback */}
      <div
        id="toast"
        role="status"
        aria-live="polite"
        className={`fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 transition-all duration-200 ${
          toast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {toast && (
          <div className="bg-[#0E4D6C] text-[#EBF7FC] border border-[#EBF7FC]/40 rounded-xl px-4 py-3 shadow-lg flex items-center justify-between gap-3 text-sm font-semibold">
            <span>{toast.message}</span>
            {toast.undoState && (
              <button
                type="button"
                onClick={handleUndo}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-[#1D82B4] text-white text-xs font-bold hover:bg-white hover:text-[#0E4D6C] transition-colors cursor-pointer"
              >
                Hoàn tác
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
