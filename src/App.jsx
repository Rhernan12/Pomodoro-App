import AppHeader from "./components/AppHeader";
import PomodoroCard from "./components/PomodoroCard";
import SettingsCard from "./components/SettingsCard";

export default function App() {
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
        <PomodoroCard />
        <SettingsCard />
      </div>

      <footer id="footer">
        <section>
          <p>UI styled with Stellar.</p>
        </section>
      </footer>
    </div>
  );
}
