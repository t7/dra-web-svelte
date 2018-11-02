import format from 'date-fns/format';
import isToday from 'date-fns/is_today';

export const combineCurrentWeek = (forecastWeek = []) => {
  const temp = {};
  // clear current week
  const currentWeek = [];
  forecastWeek.map(day => {
    const dayOfWeek = format(day.startTime, 'ddd');
    const isDateToday = isToday(day.startTime);
    if (!temp[dayOfWeek]) {
      // create new instance
      temp[dayOfWeek] = {
        name: dayOfWeek,
        isToday: isDateToday,
      };
      // set day/night
      day.isDaytime
        ? (temp[dayOfWeek].day = day)
        : (temp[dayOfWeek].night = day);
    } else {
      day.isDaytime
        ? (temp[dayOfWeek].day = day)
        : (temp[dayOfWeek].night = day);
      currentWeek.push(temp[dayOfWeek]);
    }
  });
  return currentWeek;
};