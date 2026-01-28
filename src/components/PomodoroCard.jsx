import { useState, useRef, useEffect } from "react";
import { formatTime, getNewDeadTime } from "../utils";

export default function PomodoroCard({ settings }) {
  const intervalRef = useRef(null);
  const deadlineRef = useRef(null);
  const pausedAtRef = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(null); // this is a display string
  const [currentMode, setCurrentMode] = useState("focusMinutes"); // Placeholder

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
    } else {
      // timer is done
      setTimer(formatTime(0));
      clearIntervalSafe();
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearIntervalSafe();
    setIsRunning(false);

    deadlineRef.current = getNewDeadTime(settings[currentMode] * 60);
    pausedAtRef.current = Date.now(); // important
    timerTick(deadlineRef.current);
  };

  const start = () => {
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

  const pause = () => {
    if (!isRunning) return;
    // record when user pauses
    pausedAtRef.current = Date.now();
    setIsRunning(false);
  };

  // If total time changes, refresh the display
  useEffect(() => {
    resetTimer();
  }, [settings[currentMode]]);

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
  }, [isRunning]);

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
          <button type="button" className="button primary">
            Focus
          </button>
        </li>
        <li>
          <button type="button" className="button">
            Short Break
          </button>
        </li>
        <li>
          <button type="button" className="button">
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
            onClick={resetTimer}
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
          <strong>0</strong> Focus Sessions
        </li>
        <li className="style2">
          <span className="icon solid fa-clock" />
          <strong>0m</strong> Focus Time
        </li>
        <li className="style3">
          <span className="icon solid fa-mug-hot" />
          <strong>0</strong> Breaks
        </li>
      </ul>
    </section>
  );
}
