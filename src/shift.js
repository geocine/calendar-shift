const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SHIFT_TYPES = ["0", "1"];

class Day {
  constructor(date, day, workType, shiftType) {
    this.date = new Date(date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }));
    this.day = day;
    this.workType = workType;
    this.shiftType = shiftType;
  }
  toString() {
    let date = this.date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return `${date}_${this.day}_${this.workType}_${this.shiftType}`;
  }
}

function countCycleCount(work_days) {
  let work_count = 0;
  let off_count = 0;
  for (let day of work_days) {
    if (day == "11") {
      work_count += 1;
    } else {
      off_count += 1;
    }
  }
  return [off_count, work_count];
}

function getShiftCount(work_type, shift_count) {
  if (work_type == "00") {
    return shift_count;
  } else {
    return shift_count + 1;
  }
}

export function getCalendar(
  start_date,
  end_date,
  starting_work_days,
  starting_shift
) {
  let start_date_obj = new Date(start_date);
  let end_date_obj = new Date(end_date);
  let current_date = start_date_obj;
  let current_shift = starting_shift;
  let current_work_days = starting_work_days;
  let calendar = [];
  let day_index = 0;
  let shift_count = 0;

  while (current_date <= end_date_obj) {
    let day_of_week = DAYS[current_date.getDay()];
    let current_shift_type = SHIFT_TYPES[current_shift];
    let current_work_type;

    if (day_index < 4) {
      current_work_type = current_work_days[day_index];
      shift_count = getShiftCount(current_work_type, shift_count);
      calendar.push(new Day(
        current_date,
        day_of_week,
        current_work_type,
        current_shift_type
      ));
      day_index += 1;
    } else {
      let [off_count, work_count] = countCycleCount(current_work_days);

      if (off_count == 2 && work_count == 2) {
        current_work_days = current_work_days.slice(1);
        [off_count, work_count] = countCycleCount(current_work_days);
      }

      if (off_count < 2) {
        current_work_type = "00";
      }

      if (work_count < 2) {
        current_work_type = "11";
      }

      if (current_work_days.length == 4) {
        current_work_days = current_work_days
          .slice(1)
          .concat([current_work_type]);
      } else {
        current_work_days = current_work_days.concat([current_work_type]);
      }

      shift_count = getShiftCount(current_work_type, shift_count);

      calendar.push(new Day(
        current_date,
        day_of_week,
        current_work_type,
        current_shift_type
      ));
    }

    current_date.setDate(current_date.getDate() + 1);

    if (shift_count == 4) {
      current_shift = (current_shift + 1) % 2;
      shift_count = 0;
    }
  }

  day_index = 0;
  while (day_index < calendar.length) {
    let current_work_type = calendar[day_index].workType;
    let current_shift_type = calendar[day_index].shiftType;

    if (current_work_type == "00") {
      calendar[day_index].shiftType = "F";
    }

    if (current_shift_type == "1" && current_work_type == "11") {
      calendar[day_index].workType = "01";
      // check if index is out of bounds
      if (day_index + 2 < calendar.length) {
        calendar[day_index + 2].workType = "10";
        calendar[day_index + 2].shiftType = "1";
        day_index += 3;
      }
    } else {
      day_index += 1;
    }
  }

  return calendar;
}

// let start_date = "04/09/2023";
// let end_date = "04/30/2023";
// let starting_work_days = ["11", "11", "00", "00"];
// let starting_shift = 1;

// let calendar = getCalendar(
//   start_date,
//   end_date,
//   starting_work_days,
//   starting_shift
// );

// for (let day of calendar) {
//   console.log(day.toString());
// }
