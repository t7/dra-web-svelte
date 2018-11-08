/** 
 * @function dayOfWeek
 * @argument number
 * @returns word day of the week - ex: Saturday
*/

export const dayOfWeek = day => {
  const map = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  return map[day];
}