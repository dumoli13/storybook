import { PickerType } from '../const/datePicker';

/**
 *
 * @param value Date object
 * @param showTime boolean to show time or not
 * @returns if showTime is true, returns "D/M/YYYY HH:mm:ss", otherwise returns "D/M/YYYY"
 */
export function formatDate(
  value: Date,
  showTime = false,
  picker: PickerType = 'date',
) {
  const date = new Date(value);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-indexed
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  const secs = date.getSeconds().toString().padStart(2, '0');

  let formattedDate: string;
  if (picker === 'date') {
    formattedDate = `${day}/${month}/${year}`;
  } else if (picker === 'month') {
    formattedDate = `${month}/${year}`;
  } else {
    formattedDate = `${year}`;
  }
  if (showTime) {
    return `${formattedDate} ${hours}:${mins}:${secs}`;
  } else {
    return formattedDate;
  }
}

export function isValidDate(value: any) {
  const date = new Date(value);
  return !isNaN(date.getTime());
}
