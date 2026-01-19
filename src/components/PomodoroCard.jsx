export default function PomodoroCard({ settings }) {
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
        <h1 style={{ marginBottom: 0, letterSpacing: 2 }}>25:00</h1>
      </div>

      {/* Controls */}
      <ul
        className="actions special"
        style={{ marginTop: 15, gap: 12, flexWrap: "wrap" }}
      >
        <li>
          <button type="button" className="button icon solid fa-play">
            Start
          </button>
        </li>
        <li>
          <button type="button" className="button icon solid fa-pause">
            Pause
          </button>
        </li>
        <li>
          <button type="button" className="button icon solid fa-undo-alt">
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
