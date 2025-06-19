/**
 *
 * @param value Date object
 * @param showTime boolean to show time or not
 * @returns if showTime is true, returns "D/M/YYYY HH:mm:ss", otherwise returns "D/M/YYYY"
 */
export function formatDate(value: Date, showTime = false) {
  const date = new Date(value);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-indexed
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  const secs = date.getSeconds().toString().padStart(2, '0');

  if (showTime) {
    return `${day}/${month}/${year} ${hours}:${mins}:${secs}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

export function isValidDate(value: any) {
  const date = new Date(value);
  return !isNaN(date.getTime());
}
