export default function SettingsCard() {
  return (
    <section className="main" id="settings" style={{ paddingTop: 0 }}>
      <header className="major">
        <h2>Settings</h2>
      </header>

      <form>
        <div className="row gtr-uniform">
          <div className="col-4">
            <label htmlFor="focusMinutes">Focus (minutes)</label>
            <input
              id="focusMinutes"
              type="number"
              min="1"
              defaultValue="25"
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-4">
            <label htmlFor="shortBreakMinutes">Short break</label>
            <input
              id="shortBreakMinutes"
              type="number"
              min="1"
              defaultValue="5"
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-4">
            <label htmlFor="longBreakMinutes">Long break</label>
            <input
              id="longBreakMinutes"
              type="number"
              min="1"
              defaultValue="15"
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-12">
            <label htmlFor="sessionsBeforeLong">
              Sessions before long break
            </label>
            <input
              id="sessionsBeforeLong"
              type="number"
              min="1"
              defaultValue="4"
            />
          </div>

          <div className="col-4">
            <button type="button" className="button">
              Restore Defaults
            </button>
          </div>

          <div className="col-4">
            <button type="submit" className="button primary">
              Apply Settings
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
