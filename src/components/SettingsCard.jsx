import { useEffect, useState } from "react";

export default function SettingsCard({ settings, defaults, onApplySettings }) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => setDraft(settings), [settings]); // Just in case more functionality is added later

  const updateField = (key) => {
    return (e) => {
      let digits = e.target.value.replace(/\D/g, "");
      if (digits === "") {
        digits = "0";
      }
      digits = digits.replace(/^0+(?=\d)/, "");
      setDraft((prev) => ({ ...prev, [key]: digits }));
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const focusMinutes = parseInt(draft.focusMinutes, 10);
    const shortBreakMinutes = parseInt(draft.shortBreakMinutes, 10);
    const longBreakMinutes = parseInt(draft.longBreakMinutes, 10);
    const sessionsBeforeLong = parseInt(draft.sessionsBeforeLong, 10);

    const valuesArray = [
      focusMinutes,
      shortBreakMinutes,
      longBreakMinutes,
      sessionsBeforeLong,
    ];
    // Prevent bad inputs
    if (!valuesArray.every((value) => value > 0)) {
      alert("Values should be grater than 0.");
    } else if (!valuesArray.every((value) => value < 720)) {
      alert("Values should be less than 720 (12 hours).");
    } else {
      onApplySettings({
        focusMinutes: focusMinutes,
        shortBreakMinutes: shortBreakMinutes,
        longBreakMinutes: longBreakMinutes,
        sessionsBeforeLong: sessionsBeforeLong,
      });
    }
  };

  return (
    <section className="main" id="settings" style={{ paddingTop: 0 }}>
      <header className="major">
        <h2>Settings</h2>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="row gtr-uniform">
          <div className="col-4">
            <label htmlFor="focusMinutes">Focus (minutes)</label>
            <input
              id="focusMinutes"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft.focusMinutes}
              onChange={updateField("focusMinutes")}
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-4">
            <label htmlFor="shortBreakMinutes">Short break</label>
            <input
              id="shortBreakMinutes"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft.shortBreakMinutes}
              onChange={updateField("shortBreakMinutes")}
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-4">
            <label htmlFor="longBreakMinutes">Long break</label>
            <input
              id="longBreakMinutes"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft.longBreakMinutes}
              onChange={updateField("longBreakMinutes")}
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-12">
            <label htmlFor="sessionsBeforeLong">
              Sessions before long break
            </label>
            <input
              id="sessionsBeforeLong"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft.sessionsBeforeLong}
              onChange={updateField("sessionsBeforeLong")}
              style={{ width: "30%" }}
            />
          </div>

          <div className="col-4">
            <button
              type="button"
              className="button"
              onClick={() => {
                setDraft(defaults);
              }}
            >
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
