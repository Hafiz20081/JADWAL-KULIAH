import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Calendar,
  BookOpen,
  MapPin,
  User,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Sparkles,
  Search,
  Sliders,
  ChevronRight,
  Info,
  CalendarDays,
  GraduationCap,
  Bell,
  RefreshCw,
  SunMedium
} from "lucide-react";

// Data Jadwal Kuliah Semester 3 sesuai foto
const SCHEDULE_DATA = {
  1: {
    dayName: "Senin",
    items: [
      {
        id: "sen-1",
        name: "PRAK (GEODESI SATELIT)",
        type: "Praktikum",
        start: "07:30",
        end: "10:10",
        room: "Labtek 5 5",
        lecturer: "-",
        color: "from-emerald-600 to-teal-700"
      },
      {
        id: "sen-2",
        name: "PANCASILA",
        type: "Teori",
        start: "11:10",
        end: "12:55",
        room: "GK2 410",
        lecturer: "Oktarina Maulidia, S.P., M.Si.",
        color: "from-blue-600 to-indigo-700"
      }
    ]
  },
  2: {
    dayName: "Selasa",
    items: [
      {
        id: "sel-1",
        name: "PRAK (PEMETAAN DASAR)",
        type: "Praktikum",
        start: "07:30",
        end: "10:10",
        room: "Lab GT",
        lecturer: "-",
        color: "from-emerald-600 to-teal-700"
      },
      {
        id: "sel-2",
        name: "KARTOGRAFI",
        type: "Teori",
        start: "15:45",
        end: "17:30",
        room: "E 308",
        lecturer: "Lea Kristi Agustina / Ilyas",
        color: "from-amber-600 to-orange-700"
      }
    ]
  },
  3: {
    dayName: "Rabu",
    items: [
      {
        id: "rab-1",
        name: "PRAK (KARTOGRAFI)",
        type: "Praktikum",
        start: "07:30",
        end: "10:10",
        room: "Labtek 5 6",
        lecturer: "-",
        color: "from-emerald-600 to-teal-700"
      },
      {
        id: "rab-2",
        name: "BAHASA INGGRIS",
        type: "Teori",
        start: "13:00",
        end: "14:40",
        room: "GK1 303",
        lecturer: "Moehammad Budhicahyanto, S.T., M.T.",
        color: "from-cyan-600 to-blue-700"
      }
    ]
  },
  4: {
    dayName: "Kamis",
    items: [
      {
        id: "kam-1",
        name: "GEODESI SATELIT",
        type: "Teori",
        start: "07:30",
        end: "09:15",
        room: "E 302",
        lecturer: "Misfallah Nurhayati / Zulfikar Adlan Nadzir",
        color: "from-indigo-600 to-violet-700"
      },
      {
        id: "kam-2",
        name: "PEMROGRAMAN GEOMATIKA",
        type: "Teori",
        start: "10:15",
        end: "12:00",
        room: "GK2 201",
        lecturer: "Ilyas",
        color: "from-purple-600 to-pink-700"
      },
      {
        id: "kam-3",
        name: "PRAK (BASIS DATA SPASIAL)",
        type: "Praktikum",
        start: "13:00",
        end: "15:40",
        room: "Labtek 5 6",
        lecturer: "-",
        color: "from-emerald-600 to-teal-700"
      },
      {
        id: "kam-4",
        name: "BASIS DATA SPASIAL",
        type: "Teori",
        start: "15:45",
        end: "17:30",
        room: "E 313",
        lecturer: "Ratna Mustika Sari / Ilyas",
        color: "from-teal-600 to-emerald-800"
      }
    ]
  },
  5: {
    dayName: "Jumat",
    items: [
      {
        id: "jum-1",
        name: "PEMETAAN DASAR",
        type: "Teori",
        start: "13:55",
        end: "15:40",
        room: "E 309",
        lecturer: "Ir. Een Lujainatul Isnaini",
        color: "from-rose-600 to-pink-700"
      },
      {
        id: "jum-2",
        name: "SISTEM REFERENSI GEODESI",
        type: "Teori",
        start: "15:45",
        end: "17:30",
        room: "E 306",
        lecturer: "Meraty Ramadhini / Ongky Anggara",
        color: "from-sky-600 to-blue-800"
      }
    ]
  }
};

// Helper waktu
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const formatSeconds = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s < 10 ? "0" : ""}${s}d`;
};

export default function App() {
  // State Waktu & Simulasi
  const [realTime, setRealTime] = useState(new Date());
  const [isSimulated, setIsSimulated] = useState(false);
  const [simulatedDay, setSimulatedDay] = useState(4); // Default Kamis untuk demo seru
  const [simulatedTime, setSimulatedTime] = useState("08:15"); // Format "HH:mm"

  // Filter & Pencarian
  const [selectedDayTab, setSelectedDayTab] = useState("auto"); // "auto" | 1 | 2 | 3 | 4 | 5 | "all"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "Praktikum" | "Teori"

  // Timer Tick setiap 1 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mendapatkan Waktu Aktif (Real atau Simulasi)
  const activeDateInfo = useMemo(() => {
    if (isSimulated) {
      const [sh, sm] = simulatedTime.split(":").map(Number);
      const curSec = realTime.getSeconds();
      return {
        day: simulatedDay,
        hours: sh,
        minutes: sm,
        seconds: curSec,
        totalMinutes: sh * 60 + sm + curSec / 60,
        formattedTime: `${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}:${String(curSec).padStart(2, "0")}`
      };
    } else {
      const day = realTime.getDay(); // 0 = Min, 1 = Sen, ... 6 = Sab
      const hours = realTime.getHours();
      const minutes = realTime.getMinutes();
      const seconds = realTime.getSeconds();
      return {
        day,
        hours,
        minutes,
        seconds,
        totalMinutes: hours * 60 + minutes + seconds / 60,
        formattedTime: realTime.toLocaleTimeString("id-ID", { hour12: false })
      };
    }
  }, [realTime, isSimulated, simulatedDay, simulatedTime]);

  // Tab aktif yang dipilih pengguna (jika auto, ikuti hari sekarang)
  const currentViewDay = useMemo(() => {
    if (selectedDayTab !== "auto") return selectedDayTab;
    const currentDay = activeDateInfo.day;
    if (currentDay >= 1 && currentDay <= 5) return currentDay;
    return 1; // Default ke Senin jika weekend
  }, [selectedDayTab, activeDateInfo.day]);

  // Analisis Realtime: Kelas Sedang Berlangsung & Kelas Berikutnya
  const realTimeStatus = useMemo(() => {
    const todayItems = SCHEDULE_DATA[activeDateInfo.day]?.items || [];
    const curMin = activeDateInfo.totalMinutes;

    let activeClass = null;
    let nextClassToday = null;
    let progressPercent = 0;
    let secondsRemaining = 0;

    for (let i = 0; i < todayItems.length; i++) {
      const item = todayItems[i];
      const startMin = timeToMinutes(item.start);
      const endMin = timeToMinutes(item.end);

      if (curMin >= startMin && curMin < endMin) {
        activeClass = item;
        const totalDuration = (endMin - startMin) * 60;
        const elapsedSec = (curMin - startMin) * 60;
        progressPercent = Math.min(100, Math.max(0, (elapsedSec / totalDuration) * 100));
        secondsRemaining = Math.max(0, Math.floor((endMin - curMin) * 60));
        break;
      } else if (curMin < startMin && !nextClassToday) {
        nextClassToday = item;
      }
    }

    // Cari kelas terdekat berikutnya di hari lain jika hari ini sudah selesai atau libur
    let upcomingClassAnywhere = null;
    if (!activeClass && !nextClassToday) {
      for (let offset = 1; offset <= 7; offset++) {
        const nextDayIndex = (activeDateInfo.day + offset) % 7;
        const daySchedule = SCHEDULE_DATA[nextDayIndex];
        if (daySchedule && daySchedule.items.length > 0) {
          upcomingClassAnywhere = {
            dayName: daySchedule.dayName,
            ...daySchedule.items[0]
          };
          break;
        }
      }
    }

    return {
      activeClass,
      nextClassToday,
      upcomingClassAnywhere,
      progressPercent,
      secondsRemaining,
      isWeekend: activeDateInfo.day === 0 || activeDateInfo.day === 6
    };
  }, [activeDateInfo]);

  

  // Mencari praktikum berikutnya
  const nextPracticum = useMemo(() => {
    const currentDay = activeDateInfo.day;
    const currentMinutes = activeDateInfo.totalMinutes;

    for (let offset = 0; offset <= 7; offset++) {
      const dayIndex = (currentDay + offset) % 7;
      const daySchedule = SCHEDULE_DATA[dayIndex];

      if (!daySchedule) continue;

      const practicum = daySchedule.items.find((item) => {
        if (item.type !== "Praktikum") return false;

        const startMinutes = timeToMinutes(item.start);

        // Jika hari ini, hanya ambil praktikum yang belum dimulai
        if (offset === 0) {
          return startMinutes > currentMinutes;
        }

        return true;
      });

      if (practicum) {
        return {
          ...practicum,
          dayName: daySchedule.dayName,
          daysFromNow: offset
        };
      }
    }

    return null;
  }, [activeDateInfo]);
  // Mencari mata kuliah berikutnya
// KHUSUS MATA KULIAH TEORI — PRAKTIKUM TIDAK MASUK
const nextCourse = useMemo(() => {
  const currentDay = activeDateInfo.day;
  const currentMinutes = activeDateInfo.totalMinutes;

  for (let offset = 0; offset <= 7; offset++) {
    const dayIndex = (currentDay + offset) % 7;
    const daySchedule = SCHEDULE_DATA[dayIndex];

    if (!daySchedule) continue;

    const course = daySchedule.items.find((item) => {
      // HANYA mata kuliah Teori
      if (item.type !== "Teori") return false;

      const startMinutes = timeToMinutes(item.start);

      // Kalau hari ini, hanya cari mata kuliah
      // yang belum dimulai
      if (offset === 0) {
        return startMinutes > currentMinutes;
      }

      return true;
    });

    if (course) {
      return {
        ...course,
        dayName: daySchedule.dayName,
        daysFromNow: offset,
      };
    }
  }

  return null;
}, [activeDateInfo]);
  // Mendapatkan status tiap item jadwal
  const getItemStatus = (dayNum, item) => {
    if (activeDateInfo.day !== dayNum) {
      return { status: "IDLE", label: "Terjadwal", badgeClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
    }
    const curMin = activeDateInfo.totalMinutes;
    const startMin = timeToMinutes(item.start);
    const endMin = timeToMinutes(item.end);

    if (curMin >= startMin && curMin < endMin) {
      return {
        status: "ACTIVE",
        label: "Sedang Berlangsung",
        badgeClass: "bg-emerald-500 text-white animate-pulse"
      };
    } else if (curMin < startMin) {
      const minLeft = Math.round(startMin - curMin);
      return {
        status: "UPCOMING",
        label: `Mulai ${minLeft > 60 ? Math.floor(minLeft / 60) + "j " + (minLeft % 60) + "m" : minLeft + " mnt lagi"}`,
        badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
      };
    } else {
      return {
        status: "PASSED",
        label: "Selesai",
        badgeClass: "bg-slate-100 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500"
      };
    }
  };

  // Helper nama hari format Indonesia
  const getDayLabel = (d) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[d] || "";
  };

  const getFullDateFormatted = () => {
    if (isSimulated) {
      return `Simulasi ${SCHEDULE_DATA[simulatedDay]?.dayName || "Hari"}, Waktu Uji Coba`;
    }
    return realTime.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      {/* Top Header Banner dengan Tema Welkom Bekk Hijau Alami */}
      <header className="relative bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl overflow-hidden">
        {/* Dekorasi Aksen Visual */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Judul & Semester */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Teknik Geomatika Semester 3
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight italic flex items-center gap-3">
                JADWAL PERKULIAHAN
                <span className="text-emerald-400 not-italic text-sm font-medium px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40">
                  Live Jadwal
                </span>
              </h1>
              <p className="text-emerald-100/80 text-sm mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-300" />
                {getFullDateFormatted()}
              </p>
            </div>

            {/* Jam Real-time Besar */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl shadow-inner flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-start">
              <div className="p-3 bg-emerald-500/30 rounded-xl text-emerald-200">
                <Clock className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-200/90 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  {isSimulated ? "Waktu Simulasi" : "Waktu"}
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white">
                  {activeDateInfo.formattedTime}
                  <span className="text-xs ml-1 font-sans text-emerald-200 font-normal">WIB</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* STATUS REAL-TIME + PRAKTIKUM + MATA KULIAH BERIKUTNYA */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* STATUS REAL-TIME */}
          <div className="relative overflow-hidden rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5">
            <div className="flex items-center gap-4">

              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                {realTimeStatus.activeClass ? (
                  <PlayCircle className="w-6 h-6" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  STATUS REAL-TIME
                </div>

                {realTimeStatus.activeClass ? (
                  <>
                    <h2 className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-emerald-100 mt-0.5">
                      Kelas sedang berlangsung
                    </h2>

                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      {realTimeStatus.activeClass.name}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                      <Clock className="w-3.5 h-3.5" />
                      {realTimeStatus.activeClass.start} - {realTimeStatus.activeClass.end} WIB
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-emerald-100 mt-0.5">
                      Tidak ada kelas yang berjalan saat ini
                    </h2>

                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      Belum ada perkuliahan yang sedang berlangsung.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>


          {/* PRAKTIKUM BERIKUTNYA */}
          <div className="relative overflow-hidden rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 p-5">
            <div className="flex items-center gap-4">

              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <PlayCircle className="w-6 h-6" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  PRAKTIKUM BERIKUTNYA
                </div>

                {nextPracticum ? (
                  <>
                    <h2 className="text-base sm:text-lg font-extrabold text-indigo-950 dark:text-indigo-100 mt-0.5 truncate">
                      {nextPracticum.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mt-2">

                      <span className="text-[11px] font-semibold bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-700">
                        {nextPracticum.dayName}
                      </span>

                      <span className="text-[11px] font-semibold bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-700">
                        {nextPracticum.start} - {nextPracticum.end}
                      </span>

                    </div>

                    <div className="flex items-center gap-1 mt-2 text-[11px] text-indigo-700 dark:text-indigo-300">
                      <MapPin className="w-3 h-3" />
                      {nextPracticum.room}
                    </div>

                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-700">
                        <Clock className="w-3 h-3" />

                        {nextPracticum.daysFromNow === 0
                          ? `Mulai pukul ${nextPracticum.start}`
                          : nextPracticum.daysFromNow === 1
                            ? `Besok • ${nextPracticum.start}`
                            : `${nextPracticum.daysFromNow} hari lagi • ${nextPracticum.start}`}
                      </span>
                    </div>
                  </>
                ) : (
                  <h2 className="text-base font-bold text-indigo-950 dark:text-indigo-100 mt-1">
                    Tidak ada praktikum berikutnya
                  </h2>
                )}

              </div>
            </div>
          </div>


          {/* MATA KULIAH BERIKUTNYA */}
          <div className="relative overflow-hidden rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-5">
            <div className="flex items-center gap-4">

              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  MATA KULIAH BERIKUTNYA
                </div>

                {nextCourse ? (
                  <>
                    <h2 className="text-base sm:text-lg font-extrabold text-blue-950 dark:text-blue-100 mt-0.5 truncate">
                      {nextCourse.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mt-2">

                      <span className="text-[11px] font-semibold bg-white dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-700">
                        {nextCourse.type}
                      </span>

                      <span className="text-[11px] font-semibold bg-white dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-700">
                        {nextCourse.dayName}
                      </span>

                    </div>

                    <div className="flex items-center gap-1 mt-2 text-[11px] text-blue-700 dark:text-blue-300">
                      <Clock className="w-3 h-3" />
                      {nextCourse.start} - {nextCourse.end}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-blue-700 dark:text-blue-300">
                      <MapPin className="w-3 h-3" />
                      {nextCourse.room}
                    </div>

                    <div className="mt-2">
                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                        {nextCourse.daysFromNow === 0
                          ? `Mulai pukul ${nextCourse.start}`
                          : nextCourse.daysFromNow === 1
                            ? `Besok • ${nextCourse.start}`
                            : `${nextCourse.daysFromNow} hari lagi • ${nextCourse.start}`}
                      </span>
                    </div>

                  </>
                ) : (
                  <h2 className="text-base font-bold text-blue-950 dark:text-blue-100 mt-1">
                    Tidak ada mata kuliah berikutnya
                  </h2>
                )}

              </div>
            </div>
          </div>

        </section>
{/* Filter & Kontrol Pencarian */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Tab Pemilihan Hari */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-slate-200/70 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedDayTab("auto")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedDayTab === "auto"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Hari Ini ({getDayLabel(activeDateInfo.day)})
            </button>

            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDayTab(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDayTab === d
                    ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {SCHEDULE_DATA[d].dayName}
              </button>
            ))}

            <button
              onClick={() => setSelectedDayTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDayTab === "all"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Semua Hari
            </button>
          </div>

          {/* Search & Filter Kategori */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari matkul, dosen, ruang..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  âœ•
                </button>
              )}
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Tipe</option>
              <option value="Praktikum">Praktikum</option>
              <option value="Teori">Teori</option>
            </select>
          </div>
        </div>

        {/* LIST JADWAL KULIAH */}
        <div className="space-y-6">
          {Object.entries(SCHEDULE_DATA)
            .filter(([dayNum]) => {
              if (selectedDayTab === "all") return true;
              return Number(dayNum) === currentViewDay;
            })
            .map(([dayNum, dayObj]) => {
              const dNum = Number(dayNum);
              const isToday = activeDateInfo.day === dNum;

              // Filter berdasarkan query & tipe
              const filteredItems = dayObj.items.filter((item) => {
                const matchQuery =
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
                const matchType = filterType === "all" || item.type === filterType;
                return matchQuery && matchType;
              });

              if (filteredItems.length === 0 && searchQuery) return null;

              return (
                <div
                  key={dNum}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                  {/* Header Hari */}
                  <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl font-bold text-sm ${
                        isToday
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                      }`}>
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                            {dayObj.dayName}
                          </h3>
                          {isToday && (
                            <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                              Hari Ini
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {filteredItems.length} Mata Kuliah Terjadwal
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* List Item Mata Kuliah */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => {
                        const status = getItemStatus(dNum, item);
                        const isCurrentActive = status.status === "ACTIVE";

                        return (
                          <div
                            key={item.id}
                            className={`p-5 sm:p-6 transition-all duration-200 ${
                              isCurrentActive
                                ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500"
                                : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              
                              {/* Info Waktu & Status */}
                              <div className="flex items-start sm:items-center gap-4">
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-center min-w-[110px] border border-slate-200/70 dark:border-slate-700">
                                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                                    {item.start}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-sans my-0.5">s/d</div>
                                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                                    {item.end}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                        item.type === "Praktikum"
                                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                          : "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                                      }`}
                                    >
                                      {item.type}
                                    </span>
                                    
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${status.badgeClass}`}>
                                      {status.label}
                                    </span>
                                  </div>

                                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    {item.name}
                                  </h4>

                                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        Ruang {item.room}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{item.lecturer !== "-" ? item.lecturer : "Asisten / Tim Lab"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Progress bar miniatur jika sedang aktif */}
                              {isCurrentActive && (
                                <div className="lg:w-60 bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
                                  <div className="flex justify-between text-[11px] font-medium text-emerald-800 dark:text-emerald-300 mb-1">
                                    <span>Sedang Berjalan</span>
                                    <span className="font-mono">{Math.round(realTimeStatus.progressPercent)}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                      style={{ width: `${realTimeStatus.progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        Tidak ada mata kuliah yang cocok dengan filter.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Ringkasan Beban Kuliah Semester 3 */}
        <section className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            Ringkasan Akademik
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">12</div>
              <div className="text-xs text-slate-300 mt-1">Sesi Perkuliahan / Minggu</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-teal-300">4</div>
              <div className="text-xs text-slate-300 mt-1">Sesi Praktikum Lab</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-cyan-300">8</div>
              <div className="text-xs text-slate-300 mt-1">Sesi Kuliah Teori</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">5 Hari</div>
              <div className="text-xs text-slate-300 mt-1">Senin s/d Jumat</div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Sederhana */}
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-12">
        <p>Jadwal Kuliah Semester 3 â€¢ Terintegrasi Pemantauan Waktu Real-Time</p>
      </footer>
    </div>
  );
}
