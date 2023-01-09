import dayjs from 'dayjs';

export default function getDisplayDate(date: string) {
  return dayjs(date, 'YYYY-MM-DD').format('YYYY년 M월 D일');
}
