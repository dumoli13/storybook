export const SUNDAY_DATE = new Date('2023-01-01');

export function isToday(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function areDatesEqual(dateA: Date, dateB: Date | Date[]): boolean {
  if (!Array.isArray(dateB)) {
    dateB = [dateB];
  }

  return dateB.some(
    (b) =>
      dateA.getFullYear() === b.getFullYear() &&
      dateA.getMonth() === b.getMonth() &&
      dateA.getDate() === b.getDate(),
  );
}

export function isDateABeforeDateB(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() < dateB.getFullYear() ||
    (dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() < dateB.getMonth()) ||
    (dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() < dateB.getDate())
  );
}

export function isDateTimeABeforeOrEqualToDateB(
  dateA: Date,
  dateB: Date,
): boolean {
  const isTimeABeforeOrEqualToTimeB =
    dateA.getHours() < dateB.getHours() ||
    (dateA.getHours() === dateB.getHours() &&
      dateA.getMinutes() < dateB.getMinutes()) ||
    (dateA.getHours() === dateB.getHours() &&
      dateA.getMinutes() === dateB.getMinutes() &&
      dateA.getSeconds() <= dateB.getSeconds());
  return (
    isDateABeforeDateB(dateA, dateB) ||
    (areDatesEqual(dateA, dateB) && isTimeABeforeOrEqualToTimeB)
  );
}

export function isDateBetween({
  date,
  startDate,
  endDate,
}: {
  date: Date;
  startDate: Date;
  endDate: Date;
}): boolean {
  const isAfterStartDate = isDateABeforeDateB(startDate, date);
  const isBeforeEndDate = isDateABeforeDateB(date, endDate);
  return isAfterStartDate && isBeforeEndDate;
}

export function getYearRange(year: number) {
  const step = 12;

  const lowerBound = Math.floor(year / step) * step;
  const upperBound = lowerBound + step;
  return Array.from(
    { length: upperBound - lowerBound },
    (_, i) => lowerBound + i,
  );
}
