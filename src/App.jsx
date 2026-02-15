import AppHeader from "./components/AppHeader";
import PomodoroCard from "./components/PomodoroCard";
import SettingsCard from "./components/SettingsCard";
import { useState } from "react";
import defaultConfig from "./config.json";

const {
  defaultFocusMinutes,
  defaultShortBreakMinutes,
  defaultLongBreakMinutes,
  defaultSessionsBeforeLong,
} = defaultConfig;

const DEFAULTS = {
  focusMinutes: defaultFocusMinutes,
  shortBreakMinutes: defaultShortBreakMinutes,
  longBreakMinutes: defaultLongBreakMinutes,
  sessionsBeforeLong: defaultSessionsBeforeLong,
};

export default function App() {
  const [settings, setSettings] = useState(DEFAULTS);

  const onApplySettingsHandler = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <div id="wrapper">
      <AppHeader />

      <div
        id="main"
        style={{
          width: "60%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <PomodoroCard settings={settings} />
        <SettingsCard
          settings={settings}
          defaults={{ ...DEFAULTS }}
          onApplySettings={onApplySettingsHandler}
        />
      </div>

      <footer id="footer">
        <section>
          <p>UI styled with Stellar by HTML5 UP.</p>
        </section>
      </footer>
    </div>
  );
}
