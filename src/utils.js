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
