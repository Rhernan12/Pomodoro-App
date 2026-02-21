import {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useCallback,
} from "react";

import {
  formatTime,
  getNewDeadTime,
  requestNotificationPermission,
  notify,
} from "./utils";

const ACTIONS = {
  SET_MODE: "set-mode",
  RESET: "reset",
  DISABLE_AUTOSTART: "disable-autostart",
  START: "start",
  PAUSE: "pause",
  PERIOD_END: "period-end",
};

const MODES = {
  FOCUS: "focusMinutes",
  SHORTBREAK: "shortBreakMinutes",
  LONGBREAK: "longBreakMinutes",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MODE: {
      // stop interval, mark pausedAt, optionally autostart
      const mode = action.mode;
      const willRun = state.autoStartNext;

      return {
        ...state,
        mode,
        isRunning: state.autoStartNext, // start automatically only when autoStartNext is true
        pausedAt: willRun ? null : action.nowMs,
        deadline: getNewDeadTime(action.settings[mode], action.nowMs),
      };
    }

    case ACTIONS.RESET: {
      // deadline resets to current mode, start running when autoStartNext is true
      const willRun = state.autoStartNext;
      const deadline = getNewDeadTime(
        action.settings[state.mode],
        action.nowMs,
      );
      return {
        ...state,
        isRunning: state.autoStartNext,
        deadline,
        pausedAt: willRun ? null : action.nowMs,
      };
    }

    case ACTIONS.DISABLE_AUTOSTART: {
      return { ...state, autoStartNext: false };
    }

    case ACTIONS.START: {
      if (state.isRunning) return state;
      if (!state.pausedAt) return { ...state, isRunning: true };

      // if resuming, push deadline forward
      const pausedDurationMs = action.nowMs - state.pausedAt;
      const newDeadline = new Date(state.deadline.getTime() + pausedDurationMs);
      return {
        ...state,
        isRunning: true,
        pausedAt: null,
        deadline: newDeadline,
      };
    }

    case ACTIONS.PAUSE: {
      if (!state.isRunning) return state;
      return {
        ...state,
        isRunning: false,
        pausedAt: action.nowMs,
      };
    }

    case ACTIONS.PERIOD_END: {
      const { settings } = action;
      const autoStartNext = true;

      if (state.mode === MODES.FOCUS) {
        const nextFocus = state.focusSessionsCompleted + 1;

        // determine next break mode
        const nextMode =
          nextFocus % settings.sessionsBeforeLong === 0
            ? MODES.LONGBREAK
            : MODES.SHORTBREAK;

        return {
          ...state,
          autoStartNext,
          focusSessionsCompleted: nextFocus,
          mode: nextMode,
          isRunning: true, // because autoStartNext is true
          pausedAt: null,
          deadline: getNewDeadTime(settings[nextMode], action.nowMs),
        };
      } else {
        const nextMode = MODES.FOCUS;
        return {
          ...state,
          autoStartNext,
          breaksCompleted: state.breaksCompleted + 1,
          mode: nextMode,
          isRunning: true, // because autoStartNext is trues
          pausedAt: null,
          deadline: getNewDeadTime(settings[nextMode], action.nowMs),
        };
      }
    }

    default:
      return state;
  }
}

function initializeState(settings) {
  const mode = MODES.FOCUS;
  const nowMs = Date.now();
  return {
    mode,
    isRunning: false,
    deadline: getNewDeadTime(settings[mode], nowMs),
    pausedAt: nowMs,
    autoStartNext: false,
    focusSessionsCompleted: 0,
    breaksCompleted: 0,
  };
}

export function usePomodoroTimer({ settings, alarmSrc, restIcon, focusIcon }) {
  const [state, dispatch] = useReducer(reducer, settings, initializeState);

  const alarm = useMemo(() => new Audio(alarmSrc), [alarmSrc]);
  const notificationPermissionGiven = useRef(false);

  const intervalRef = useRef(null);
  const didCompleteRef = useRef(false);

  const [now, setNow] = useState(() => Date.now());
  const remainingMs = Math.max(0, state.deadline.getTime() - now);
  const display = formatTime(remainingMs);

  const clearIntervalSafe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = async () => {
    if (!notificationPermissionGiven.current) {
      notificationPermissionGiven.current =
        await requestNotificationPermission();
    }
    const nowMs = Date.now();
    setNow(nowMs);
    dispatch({ type: ACTIONS.START, nowMs });
  };

  const pause = () => {
    const nowMs = Date.now();
    setNow(nowMs);
    dispatch({ type: ACTIONS.PAUSE, nowMs });
  };

  const reset = () => {
    const nowMs = Date.now();
    didCompleteRef.current = false;
    setNow(nowMs);
    dispatch({ type: ACTIONS.RESET, settings, nowMs });
  };

  const setMode = (mode) => {
    const nowMs = Date.now();
    didCompleteRef.current = false;
    setNow(nowMs);
    dispatch({ type: ACTIONS.SET_MODE, mode, settings, nowMs });
  };

  const disableAutostart = () => dispatch({ type: ACTIONS.DISABLE_AUTOSTART });

  // reset timer if user changes settings
  useEffect(() => {
    reset();
  }, [settings]);

  // interval engine
  useEffect(() => {
    clearIntervalSafe();

    if (!state.isRunning) return;

    didCompleteRef.current = false;

    intervalRef.current = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      const remainingMs = Math.max(0, state.deadline.getTime() - currentNow);

      if (remainingMs <= 0 && !didCompleteRef.current) {
        didCompleteRef.current = true;
        // play alarm and send notification
        alarm.currentTime = 0;
        alarm.play().catch(() => {});
        if (state.mode === MODES.FOCUS) {
          notify("Finished focus period", "Enjoy your break!", restIcon);
        } else {
          notify("Finished rest period", "Time to focus!", focusIcon);
        }

        dispatch({ type: ACTIONS.PERIOD_END, settings, nowMs: currentNow });
      }
    }, 250);

    // cleanup
    return clearIntervalSafe;
  }, [
    state.isRunning,
    state.deadline,
    state.mode,
    settings,
    alarm,
    restIcon,
    focusIcon,
    clearIntervalSafe,
  ]);

  return {
    MODES,
    mode: state.mode,
    display,
    focusSessionsCompleted: state.focusSessionsCompleted,
    breaksCompleted: state.breaksCompleted,
    actions: {
      start,
      pause,
      reset,
      setMode,
      disableAutostart,
    },
  };
}
