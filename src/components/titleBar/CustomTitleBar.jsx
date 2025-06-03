import { useEffect, useState, useCallback } from "react";
import {
  Minimize2,
  Maximize2,
  Copy,
  X,
  RotateCcw,
  RefreshCw,
  Activity,
  Wifi,
  Minus,
} from "lucide-react";
import { debounce } from "lodash"; // Install lodash for debouncing

export default function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    if (!window.electron) {
      console.warn("Electron API not available. Running in browser mode?");
      setError("عملکردهای پنجره در حالت مرورگر در دسترس نیستند");
      return;
    }

    const removeMaximized = window.electron.onWindowMaximized(() =>
      setIsMaximized(true)
    );
    const removeUnmaximized = window.electron.onWindowUnmaximized(() =>
      setIsMaximized(false)
    );

    // Initialize window state
    window.electron.getWindowState().then((state) => {
      setIsMaximized(state.isMaximized || false);
    });

    return () => {
      removeMaximized();
      removeUnmaximized();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(navigator.onLine ? "connected" : "disconnected");
    };

    checkConnection();
    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  const handleButtonHover = (button, isEntering) => {
    setIsHovered(isEntering ? button : null);
    setShowTooltip(isEntering ? button : null);
  };

  // Debounced window control functions
  const handleMinimizeToTaskbar = useCallback(
    debounce(async () => {
      if (window.electron?.minimize) {
        try {
          const success = await window.electron.minimize();
          if (!success) setError("خطا در کوچک کردن پنجره");
        } catch (err) {
          console.error("Minimize error:", err);
          setError("خطا در کوچک کردن پنجره");
        }
      }
    }, 300),
    []
  );

  const handleMinimizeWindow = useCallback(
    debounce(async () => {
      if (window.electron?.minimize) {
        try {
          const success = await window.electron.minimize();
          if (!success) setError("خطا در کوچک کردن پنجره");
        } catch (err) {
          console.error("Minimize error:", err);
          setError("خطا در کوچک کردن پنجره");
        }
      }
    }, 300),
    []
  );

  const handleMaximizeRestore = useCallback(
    debounce(async () => {
      if (window.electron?.maximizeOrRestore) {
        try {
          const success = await window.electron.maximizeOrRestore();
          if (!success) setError("خطا در تغییر اندازه پنجره");
        } catch (err) {
          console.error("Maximize/Restore error:", err);
          setError("خطا در تغییر اندازه پنجره");
        }
      }
    }, 300),
    []
  );

  const handleClose = useCallback(
    debounce(async () => {
      if (window.electron?.close) {
        try {
          const success = await window.electron.close();
          if (!success) setError("خطا در بستن پنجره");
        } catch (err) {
          console.error("Close error:", err);
          setError("خطا در بستن پنجره");
        }
      }
    }, 300),
    []
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const handleForceRefresh = () => {
    setIsRefreshing(true);
    window.location.reload(true); // Note: `reload(true)` is deprecated; use cache clearing instead
  };

  const handleClearCache = async () => {
    try {
      if (window.electron?.clearCache) {
        const success = await window.electron.clearCache();
        if (!success) setError("خطا در پاک کردن کش");
      } else {
        // Fallback for web version
        if ("caches" in window) {
          const names = await caches.keys();
          await Promise.all(names.map((name) => caches.delete(name)));
        }
      }
    } catch (err) {
      console.error("Clear cache error:", err);
      setError("خطا در پاک کردن کش");
    }
    setShowQuickMenu(false);
  };

  const handleRestart = async () => {
    try {
      if (window.electron?.restart) {
        const success = await window.electron.restart();
        if (!success) setError("خطا در راه‌اندازی مجدد");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Restart error:", err);
      setError("خطا در راه‌اندازی مجدد");
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("fa-IR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const buttonBaseClass =
    "relative flex items-center justify-center w-11 h-9 transition-all duration-300 transform";
  const buttonHoverClass = "hover:scale-110 active:scale-95";

  return (
    <>
      <div
        style={{ WebkitAppRegion: "drag" }}
        className="flex items-center justify-between px-5 text-white border-b shadow-2xl h-14 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-gray-700/50 backdrop-blur-md"
      >
        {/* Right section - App info */}
        <div className="flex items-center space-x-4 space-x-reverse select-none">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-xl ring-2 ring-white/20">
              <span className="text-xl animate-pulse">🏋️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wide text-gray-100">
                اتوماسیون باشگاه
              </span>
              <span className="text-xs text-gray-400">
                سیستم مدیریت ورزشی حرفه‌ای
              </span>
            </div>
          </div>
        </div>

        {/* Center section - Status and time */}
        <div className="flex items-center space-x-6 space-x-reverse select-none">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Wifi
              size={14}
              className={
                connectionStatus === "connected"
                  ? "text-green-400"
                  : "text-red-400"
              }
            />
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400 animate-pulse"
                  : "bg-red-400"
              }`}
            ></div>
            <span className="text-xs text-gray-300">
              {connectionStatus === "connected" ? "متصل" : "قطع شده"}
            </span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-reverse space-x-2 px-4 py-1.5 bg-gray-800/60 rounded-full border border-gray-600/50 backdrop-blur-sm">
              <Activity size={12} className="text-blue-400" />
              <span className="font-mono text-sm tracking-wider text-gray-200">
                {formatTime(currentTime)}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(currentTime)}
            </span>
          </div>
        </div>

        {/* Left section - Controls */}
        <div
          className="flex items-center space-x-1 space-x-reverse"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          {/* Close button */}
          <div className="relative">
            <button
              onClick={handleClose}
              onMouseEnter={() => handleButtonHover("close", true)}
              onMouseLeave={() => handleButtonHover("close", false)}
              className={`${buttonBaseClass} ${buttonHoverClass} text-gray-300 hover:text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 rounded-lg`}
              disabled={!window.electron} // Disable if electron is unavailable
            >
              <X size={18} />
            </button>
            {showTooltip === "close" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900/95 rounded-md shadow-xl border border-gray-600 whitespace-nowrap z-50">
                بستن برنامه
                <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent top-full left-1/2 border-t-gray-900"></div>
              </div>
            )}
          </div>

          {/* Maximize/Restore button */}
          <div className="relative">
            <button
              onClick={handleMaximizeRestore}
              onMouseEnter={() => handleButtonHover("maximize", true)}
              onMouseLeave={() => handleButtonHover("maximize", false)}
              className={`${buttonBaseClass} ${buttonHoverClass} text-gray-300 hover:text-green-400 hover:bg-green-400/20 hover:shadow-lg hover:shadow-green-400/25 rounded-lg`}
              disabled={!window.electron}
            >
              {isMaximized ? <Copy size={17} /> : <Maximize2 size={17} />}
            </button>
            {showTooltip === "maximize" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900/95 rounded-md shadow-xl border border-gray-600 whitespace-nowrap z-50">
                {isMaximized ? "بازگردانی اندازه" : "بزرگ کردن"}
                <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent top-full left-1/2 border-t-gray-900"></div>
              </div>
            )}
          </div>

          {/* Minimize to window button */}
          <div className="relative">
            <button
              onClick={handleMinimizeWindow}
              onMouseEnter={() => handleButtonHover("minimize", true)}
              onMouseLeave={() => handleButtonHover("minimize", false)}
              className={`${buttonBaseClass} ${buttonHoverClass} text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/25 rounded-lg`}
              disabled={!window.electron}
            >
              <Minimize2 size={17} />
            </button>
            {showTooltip === "minimize" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900/95 rounded-md shadow-xl border border-gray-600 whitespace-nowrap z-50">
                کوچک کردن پنجره
                <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent top-full left-1/2 border-t-gray-900"></div>
              </div>
            )}
          </div>

          {/* Minimize to taskbar button */}
          <div className="relative">
            <button
              onClick={handleMinimizeToTaskbar}
              onMouseEnter={() => handleButtonHover("taskbar", true)}
              onMouseLeave={() => handleButtonHover("taskbar", false)}
              className={`${buttonBaseClass} ${buttonHoverClass} text-gray-300 hover:text-orange-400 hover:bg-orange-400/20 hover:shadow-lg hover:shadow-orange-400/25 rounded-lg`}
              disabled={!window.electron}
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            {showTooltip === "taskbar" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900/95 rounded-md shadow-xl border border-gray-600 whitespace-nowrap z-50">
                کوچک کردن به نوار وظیف
                <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent top-full left-1/2 border-t-gray-900"></div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-5 mx-3 bg-gray-600/50"></div>

          {/* Quick actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              onMouseEnter={() => handleButtonHover("quick", true)}
              onMouseLeave={() => handleButtonHover("quick", false)}
              className={`${buttonBaseClass} ${buttonHoverClass} text-gray-300 hover:text-blue-400 hover:bg-blue-400/20 hover:shadow-lg hover:shadow-blue-400/25 rounded-lg ${
                showQuickMenu ? "bg-blue-400/20 text-blue-400" : ""
              }`}
            >
              <RefreshCw
                size={17}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
            {showTooltip === "quick" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900/95 rounded-md shadow-xl border border-gray-600 whitespace-nowrap z-50">
                ابزارهای سریع
                <div className="absolute w-0 h-0 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent top-full left-1/2 border-t-gray-900"></div>
              </div>
            )}

            {/* Quick actions dropdown */}
            {showQuickMenu && (
              <div className="absolute left-0 z-50 mt-2 border border-gray-600 rounded-lg shadow-2xl top-full w-52 bg-gray-800/95 backdrop-blur-md">
                <div className="p-2">
                  <button
                    onClick={handleRefresh}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-right text-gray-300 rounded hover:text-white hover:bg-gray-700/50"
                  >
                    <RefreshCw size={14} />
                    <span>بارگیری مجدد</span>
                  </button>
                  <button
                    onClick={handleForceRefresh}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-right text-gray-300 rounded hover:text-white hover:bg-gray-700/50"
                  >
                    <RotateCcw size={14} />
                    <span>بارگیری مجدد اجباری</span>
                  </button>
                  <button
                    onClick={handleClearCache}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-right text-gray-300 rounded hover:text-white hover:bg-gray-700/50"
                  >
                    <X size={14} />
                    <span>پاک کردن کش</span>
                  </button>
                  <div className="my-1 border-t border-gray-700"></div>
                  <button
                    onClick={handleRestart}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-right text-gray-300 rounded hover:text-white hover:bg-gray-700/50"
                  >
                    <Activity size={14} />
                    <span>راه‌اندازی مجدد</span>
                  </button>
                  <button
                    onClick={() => setShowInfoModal(true)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-right text-gray-300 rounded hover:text-white hover:bg-gray-700/50"
                  >
                    <span>ℹ️</span>
                    <span>درباره برنامه</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="fixed z-50 p-4 text-white rounded-lg shadow-lg top-4 right-4 bg-red-500/90">
          <div className="flex items-center space-x-2 space-x-reverse">
            <X size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="absolute text-white top-1 right-1 hover:text-gray-200"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-w-md p-6 mx-4 border border-gray-600 shadow-2xl bg-gray-800/95 backdrop-blur-md rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">درباره برنامه</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <p>نام برنامه: اتوماسیون باشگاه</p>
              <p>نسخه: ۱.۰.۰</p>
              <p>توسعه‌دهنده: تیم توسعه</p>
              <p>تاریخ انتشار: ۱۴۰۳/۰۳/۱۳</p>
              <p className="pt-2 border-t border-gray-600">
                سیستم جامع مدیریت باشگاه با امکانات پیشرفته
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
