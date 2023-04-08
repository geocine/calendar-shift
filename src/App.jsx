import moment from "moment";
import { useState, useEffect } from "react";
import { ReactComponent as NextIcon } from "./assets/next.svg";
import { ReactComponent as PreviousIcon } from "./assets/previous.svg";
import { getCalendar } from "./shift";
import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const history = useNavigate();
  const [date, setDate] = useState(moment());

  const getDaysInMonth = () => {
    const days = [];
    const daysInMonth = date.daysInMonth();
    const firstDay = moment(date).startOf("month").format("d");

    // Update the date state whenever the URL changes
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const year = searchParams.get("year");
      const month = searchParams.get("month");
      if (year && month) {
        setDate(moment(`${year}-${month}-01`));
      }
    }, []);

    // Update the URL whenever the date state changes
    useEffect(() => {
      const year = date.format("YYYY");
      const month = date.format("MM");
      history(`/?year=${year}&month=${month}`);
    }, [date, history]);

    let dates = getCalendar(
      "04/09/2023",
      "04/09/2024",
      ["11", "11", "00", "00"],
      1
    );

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    const isDay = (date) => {
      // if undefined, return false
      if (!date) return false;
      return date.workType == "10" || date.workType == "11";
    };

    const isNight = (date) => {
      if (!date) return false;
      return date.workType == "01" || date.workType == "11";
    };

    const isDayOff = (date) => {
      if (!date) return false;
      return date.workType == "00" || date.workType == "10";
    };

    const getShift = (date) => {
      if (date != undefined && date.workType == "11" && date.shiftType == "0")
        return <div className="w-full h-full bg-yellow-400"></div>;
      return (
        <>
          {isDay(date) ? (
            <div className="w-1/2 bg-slate-900 h-full"></div>
          ) : (
            <div className="w-1/2 h-full"></div>
          )}
          {isNight(date) ? (
            <div className="w-1/2 bg-slate-900 h-full"></div>
          ) : (
            <div className="w-1/2 h-full"></div>
          )}
        </>
      );
    };

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = dates.find((d) => {
        const shiftDate = moment(d.date);
        return (
          shiftDate.month() == date.month() &&
          shiftDate.year() == date.year() &&
          shiftDate.date() == i
        );
      });
      console.log(currentDate);
      days.push(
        <div key={`day-${i}`} className={`day-${i} day relative`}>
          <div className="w-full h-full">
            <div className="w-full h-[90%] flex">{getShift(currentDate)}</div>
            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {i}
            </div>
            {currentDate && !isDayOff(currentDate) ? (
              <div className="w-full h-[10%] bg-green-700" />
            ) : currentDate && isDayOff(currentDate) ? (
              <div className="w-full h-[10%] bg-yellow-600" />
            ) : (
              <div className="w-full h-[10%]" />
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const onPrevious = () => {
    if (date.month() === 3 && date.year() === 2023) return;
    setDate(moment(date).subtract(1, "month"));
  };

  const onNext = () => {
    if (date.month() === 3 && date.year() === 2024) return;
    setDate(moment(date).add(1, "month"));
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={onPrevious}>
          <PreviousIcon className="w-4 h-4" />
        </button>
        <h1>{date.format("MMMM YYYY")}</h1>
        <button onClick={onNext}>
          <NextIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="days">{getDaysInMonth()}</div>
    </div>
  );
}

export default App;
