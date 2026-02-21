import alarmBeep from "../assets/alarm.mp3";
import restIcon from "../assets/restIcon.png";
import focusIcon from "../assets/focusIcon.jpg";
import { usePomodoroTimer } from "../usePomodoroTimer";

export default function PomodoroCard({ settings }) {
  const {
    MODES,
    mode,
    display,
    focusSessionsCompleted,
    breaksCompleted,
    actions,
  } = usePomodoroTimer({ settings, alarmSrc: alarmBeep, restIcon, focusIcon });

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
            onClick={() => {
              actions.disableAutostart();
              actions.setMode(MODES.FOCUS);
            }}
            type="button"
            className={`button ${mode === MODES.FOCUS ? "primary" : ""}`}
          >
            Focus
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              actions.disableAutostart();
              actions.setMode(MODES.SHORTBREAK);
            }}
            type="button"
            className={`button ${mode === MODES.SHORTBREAK ? "primary" : ""}`}
          >
            Short Break
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              actions.disableAutostart();
              actions.setMode(MODES.LONGBREAK);
            }}
            type="button"
            className={`button ${mode === MODES.LONGBREAK ? "primary" : ""}`}
          >
            Long Break
          </button>
        </li>
      </ul>

      {/* Time display */}
      <div style={{ marginTop: 15 }}>
        <h1 style={{ marginBottom: 0, letterSpacing: 2 }}>{display}</h1>
      </div>

      {/* Controls */}
      <ul
        className="actions special"
        style={{ marginTop: 15, gap: 12, flexWrap: "wrap" }}
      >
        <li>
          <button
            onClick={actions.start}
            type="button"
            className="button icon solid fa-play"
          >
            Start
          </button>
        </li>
        <li>
          <button
            onClick={actions.pause}
            type="button"
            className="button icon solid fa-pause"
          >
            Pause
          </button>
        </li>
        <li>
          <button
            onClick={actions.reset}
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
