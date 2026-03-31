import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'month' or 'year'

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  const handlePrevYear = () => {
    setDate(new Date(date.getFullYear() - 1, date.getMonth()));
  };

  const handleNextYear = () => {
    setDate(new Date(date.getFullYear() + 1, date.getMonth()));
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <h3>Calendar</h3>
      </div>

      <div className="calendar-navigation">
        <div className="nav-buttons">
          <button className="nav-btn prev-btn" onClick={handlePrevYear} title="Previous year">
            ⟨⟨
          </button>
          <button className="nav-btn prev-btn" onClick={handlePrevMonth} title="Previous month">
            ⟨
          </button>
        </div>

        <div className="current-date">
          <span className="month-year">
            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="nav-buttons">
          <button className="nav-btn next-btn" onClick={handleNextMonth} title="Next month">
            ⟩
          </button>
          <button className="nav-btn next-btn" onClick={handleNextYear} title="Next year">
            ⟩⟩
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          value={date}
          onChange={setDate}
          activeStartDate={date}
          maxDate={new Date(2100, 11, 31)}
          minDate={new Date(2000, 0, 1)}
        />
      </div>

      <div className="calendar-footer">
        <p className="selected-date">
          Selected: {date.toLocaleDateString('en-US', { weeks: 'long' })}
        </p>
      </div>
    </div>
  );
};

export default CalendarComponent;
