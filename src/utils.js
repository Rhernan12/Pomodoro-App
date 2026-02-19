export function getNewDeadTime(durationSeconds) {
  let deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + durationSeconds);
  return deadline;
}

export function formatTime(totalMs) {
  const totalSeconds = Math.max(0, Math.ceil(totalMs / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}

// returns true when permission is granted, false otherwise
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  // if we have no user response yet
  const permissionStatus = await Notification.requestPermission();
  return permissionStatus === "granted";
}

export function notify(title, body, icon) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: icon,
    });
  }
}
