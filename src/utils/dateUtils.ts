// Tüm timezone kaymalarını engelleyen yardımcı fonksiyon
export const getLocalDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// "2026-07-28" tarihini "Temmuz 2026" formatına dönüştürür.
export const getFormattedMonthYear = (date: Date): string => {
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(date);
};

export const formatWeekRange = (start: Date, end: Date) => {
  const startDay = start.getDate();
  const startMonth = start.toLocaleDateString('tr-TR', { month: 'long' });
  const endDay = end.getDate();
  const endMonth = end.toLocaleDateString('tr-TR', { month: 'long' });

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }
}

