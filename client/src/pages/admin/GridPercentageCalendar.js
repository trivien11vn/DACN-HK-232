import React, { useState, useEffect } from 'react';
import { apiGetOccupancyDataByMonth } from 'apis';
import { useSelector } from 'react-redux';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const GridPercentageCalendar = () => {
  const currentUser = useSelector(state => state.user.current);

  const [occupancyData, setOccupancyData] = useState([]);
  // const [selectedMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  // const [selectedYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoverInfo, setHoverInfo] = useState({ date: null, occupancy: null, isHovered: false });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2024);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const fetchOccupancyData = async () => {
    // const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    // const newData = Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 101));
    console.log(selectedMonth, ';;;;');
    let resp = await apiGetOccupancyDataByMonth({ currMonth: selectedMonth+1, currYear: selectedYear, spid: currentUser?.provider_id?._id });

    if (resp.success && resp.occupancySeries) {
      setOccupancyData(resp.occupancySeries);
    }
  };

  useEffect(() => {
    fetchOccupancyData();
  }, [selectedMonth, selectedYear]);

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const startDay = getStartDayOfMonth(selectedMonth, selectedYear);

  const getOccupancyColor = (percentage) => {
    if (percentage >= 81) return 'bg-blue-900';
    if (percentage >= 41) return 'bg-blue-700';
    if (percentage >= 21) return 'bg-blue-500';
    if (percentage > 0) return 'bg-blue-300';
    return 'bg-gray-200';
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const handleMouseEnter = (day, occupancy) => {
    console.log(day)
    const date = new Date(selectedYear, selectedMonth, day + 1).toLocaleDateString();
    setHoverInfo({ date, occupancy, isHovered: true });
  };

  const handleMouseLeave = () => {
    setHoverInfo({ ...hoverInfo, isHovered: false });
  };


  console.log(hoverInfo)
  console.log(new Date(hoverInfo.date).getDate())
  return (
    <div className="max-w-md p-4 bg-white border-2 rounded-lg w-full h-fit">
      <div className="flex flex-col justify-center items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Daily occupancy</h2>
  
        <div className="flex items-center justify-center text-gray-500 gap-2">
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <div key={index} className="text-gray-500">{day}</div>
        ))}

        {/* Empty placeholders for days before the start of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8"></div>
        ))}

        {/* Days of the month with occupancy data */}
        {occupancyData.map((percentage, day) => (
          <div
            key={day}
            className={`relative w-8 h-8 rounded-lg ${getOccupancyColor(percentage)} flex items-center justify-center text-white cursor-pointer`}
            onMouseEnter={() => handleMouseEnter(day, percentage)}
            onMouseLeave={handleMouseLeave}
          >
            {/* {day + 1} */}
            {hoverInfo?.isHovered && (+hoverInfo?.date.split('/')[0]) === day+1 && (
              <div className="absolute top-8 p-2 z-[999] bg-white border border-gray-300 rounded-lg shadow-lg text-sm text-gray-700 w-fit">
                <div><strong>Date:</strong>&nbsp;{hoverInfo.date}</div>
                <div><strong>Occupancy:</strong>&nbsp;{hoverInfo.occupancy || 0}%</div>
              </div>
            )}
          </div>
        ))}

      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold">Legend</div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-blue-900 rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">81% and higher</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-blue-700 rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">Between 41% and 80%</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">Between 21% and 40%</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-blue-300 rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">20% and lower</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="w-4 h-4 bg-gray-200 rounded-full mr-2"></span>
          <span className="text-gray-700 text-sm">0%</span>
        </div>
      </div>
    </div>
  );
};

export default GridPercentageCalendar;