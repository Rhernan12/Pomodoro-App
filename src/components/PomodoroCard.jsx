import { useState, useRef, useEffect } from "react";
import {
  formatTime,
  getNewDeadTime,
  requestNotificationPermission,
  notify,
} from "../utils";

import alarmBeep from "../assets/alarm.mp3";
import restIcon from "../assets/restIcon.png";
import focusIcon from "../assets/focusIcon.jpg";

const alarm = new Audio(alarmBeep);
const MODES = {
  FOCUS: "focusMinutes",
  SHORTBREAK: "shortBreakMinutes",
  LONGBREAK: "longBreakMinutes",
};

export default function PomodoroCard({ settings }) {
  const intervalRef = useRef(null);
  const deadlineRef = useRef(null);
  const pausedAtRef = useRef(null);
  const autoStartRef = useRef(false);
  const notificationPermissionGiven = useRef(false);

  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(null); // this is a display string
  const [currentMode, setCurrentMode] = useState(MODES.FOCUS);
  const [focusSessionsCompleted, setFocusSessionsCompleted] = useState(0);
  const [breaksCompleted, setBreaksCompleted] = useState(0);

  const clearIntervalSafe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const timerTick = (deadline) => {
    const total = Date.parse(deadline) - Date.now();

    if (total >= 0) {
      setTimer(formatTime(total));
      return;
    }

    // timer is done
    alarm.play();
    autoStartRef.current = true;
    if (currentMode === MODES.FOCUS) {
      notify("Finished focus period", "Enjoy your break!", restIcon);

      const nextFocusSessionsCompleted = focusSessionsCompleted + 1;
      setFocusSessionsCompleted(nextFocusSessionsCompleted);

      if (nextFocusSessionsCompleted % settings.sessionsBeforeLong === 0) {
        switchMode(MODES.LONGBREAK);
      } else {
        switchMode(MODES.SHORTBREAK);
      }
    } else {
      notify("Finished rest period", "Time to focus!", focusIcon);
      setBreaksCompleted((prev) => prev + 1);
      switchMode(MODES.FOCUS);
    }
  };

  const resetTimer = () => {
    clearIntervalSafe();
    setIsRunning(autoStartRef.current);

    deadlineRef.current = getNewDeadTime(settings[currentMode] * 60);
    pausedAtRef.current = Date.now();
    timerTick(deadlineRef.current);
  };

  const start = async () => {
    // Ask for notification permission if not given
    if (!notificationPermissionGiven.current) {
      notificationPermissionGiven.current =
        await requestNotificationPermission();
    }

    // Push deadline forward by paused duration
    if (pausedAtRef.current) {
      const pausedDurationMs = Date.now() - pausedAtRef.current;
      deadlineRef.current = new Date(
        Date.parse(deadlineRef.current) + pausedDurationMs,
      );
      pausedAtRef.current = null;
    }

    setIsRunning(true);
  };

  const switchMode = (mode) => {
    console.log(autoStartRef.current);
    clearIntervalSafe();
    setIsRunning(autoStartRef.current);
    pausedAtRef.current = Date.now();
    setCurrentMode(mode);
  };

  const pause = () => {
    if (!isRunning) return;
    // record when user pauses
    pausedAtRef.current = Date.now();
    setIsRunning(false);
  };

  // If total time changes, refresh the display
  useEffect(() => {
    resetTimer();
  }, [currentMode, settings]);

  useEffect(() => {
    clearIntervalSafe();

    if (!isRunning) {
      return;
    }

    const deadline = deadlineRef.current;

    timerTick(deadline); // update UI to avoid 1 second delay

    intervalRef.current = setInterval(
      () => timerTick(deadlineRef.current),
      1000,
    );

    // cleanup on pause/unmount
    return () => clearIntervalSafe();
  }, [isRunning, currentMode]);

  return (
    <section
      className="main special"
      id="timer"
      style={{ paddingTop: 10, paddingBottom: 0 }}
    >
      <header className="major">
        <h2>Pomodoro Timer</h2>
      </header>

      <ul className="actions special" style={{ gap: 12, flexWrap: "wrap" }}>
        <li>
          <button
            onClick={() => switchMode(MODES.FOCUS)}
            type="button"
            className={`button ${currentMode === MODES.FOCUS ? "primary" : ""}`}
          >
            Focus
          </button>
        </li>
        <li>
          <button
            onClick={() => switchMode(MODES.SHORTBREAK)}
            type="button"
            className={`button ${currentMode === MODES.SHORTBREAK ? "primary" : ""}`}
          >
            Short Break
          </button>
        </li>
        <li>
          <button
            onClick={() => switchMode(MODES.LONGBREAK)}
            type="button"
            className={`button ${currentMode === MODES.LONGBREAK ? "primary" : ""}`}
          >
            Long Break
          </button>
        </li>
      </ul>

      {/* Time display */}
      <div style={{ marginTop: 15 }}>
        <h1 style={{ marginBottom: 0, letterSpacing: 2 }}>{timer}</h1>
      </div>

      {/* Controls */}
      <ul
        className="actions special"
        style={{ marginTop: 15, gap: 12, flexWrap: "wrap" }}
      >
        <li>
          <button
            onClick={start}
            type="button"
            className="button icon solid fa-play"
          >
            Start
          </button>
        </li>
        <li>
          <button
            onClick={pause}
            type="button"
            className="button icon solid fa-pause"
          >
            Pause
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              autoStartRef.current = false;
              resetTimer();
            }}
            type="button"
            className="button icon solid fa-undo-alt"
          >
            Reset
          </button>
        </li>
      </ul>

      {/* Quick stats row */}
      <ul className="statistics" style={{ marginTop: 34 }}>
        <li className="style1">
          <span className="icon solid fa-bolt" />
          <strong>{focusSessionsCompleted}</strong> Focus Sessions
        </li>
        <li className="style3">
          <span className="icon solid fa-mug-hot" />
          <strong>{breaksCompleted}</strong> Breaks
        </li>
      </ul>
    </section>
  );
}
