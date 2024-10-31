import React, { useState, useEffect } from 'react';

function ManageSetting() {
  // State variables for all inputs
  const [timeSlotStep, setTimeSlotStep] = useState('30min');
  const [useServiceDuration, setUseServiceDuration] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState('Approved');
  const [minTimeBooking, setMinTimeBooking] = useState('Disabled');
  const [minTimeCanceling, setMinTimeCanceling] = useState('Disabled');
  const [minTimeRescheduling, setMinTimeRescheduling] = useState('Disabled');
  const [daysInAdvance, setDaysInAdvance] = useState(100);
  const [dateFormat, setDateFormat] = useState('MMMM D, YYYY');
  const [timeFormat, setTimeFormat] = useState('h:mm a');
  const [timeZone, setTimeZone] = useState('Bangkok');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('Monday');
  const [phoneCountryCode, setPhoneCountryCode] = useState('United States');
  const [firstPage, setFirstPage] = useState('Dashboard');
  const [dashboardLanguage, setDashboardLanguage] = useState('English');

  // Effect to simulate loading current settings
  useEffect(() => {
    // Simulate fetching data from an API and updating state
    console.log('Fetching settings...');
  }, []);

  // Handler to simulate saving settings
  const handleSaveSettings = () => {
    const settings = {
      timeSlotStep,
      useServiceDuration,
      appointmentStatus,
      minTimeBooking,
      minTimeCanceling,
      minTimeRescheduling,
      daysInAdvance,
      dateFormat,
      timeFormat,
      timeZone,
      firstDayOfWeek,
      phoneCountryCode,
      firstPage,
      dashboardLanguage,
    };
    
    console.log('Settings saved:', settings);
    alert('Settings have been saved!');
    // Here you could send the data to an API endpoint
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
        
        {/* Sidebar */}
        <div className="flex mb-6">
          <div className="w-1/4 pr-8 border-r border-gray-200">
            <ul className="text-gray-600 space-y-4">
              <li className="font-semibold text-blue-600 cursor-pointer">General</li>
              <li className="cursor-pointer">Company</li>
              <li className="cursor-pointer">Office Hours</li>
              <li className="cursor-pointer">Company Days Off</li>
              <li className="cursor-pointer">SMS Notifications</li>
              <li className="cursor-pointer">Email Notifications</li>
              <li className="cursor-pointer">Payments</li>
              <li className="cursor-pointer">Users & Roles</li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="w-3/4 pl-8">
            {/* Appointment Settings */}
            <h2 className="font-semibold text-xl text-gray-800 mb-6">Appointment Settings</h2>
            <div className="space-y-6">
              
              {/* Default Time Slot Step */}
              <div className="flex items-center justify-between">
                <label className="text-gray-800 font-medium">Default Time Slot Step</label>
                <select value={timeSlotStep} onChange={(e) => setTimeSlotStep(e.target.value)} className="border rounded-lg p-2 w-1/2 text-gray-800">
                  <option>15min</option>
                  <option>30min</option>
                  <option>1hr</option>
                </select>
              </div>
              
              {/* Use Service Duration as Booking Slot */}
              <div className="flex items-center justify-between">
                <label className="text-gray-800 font-medium">Use service duration as booking time slot</label>
                <input
                  type="checkbox"
                  checked={useServiceDuration}
                  onChange={(e) => setUseServiceDuration(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
              
              {/* Default Appointment Status */}
              <div className="flex items-center justify-between">
                <label className="text-gray-800 font-medium">Default Appointment Status</label>
                <select value={appointmentStatus} onChange={(e) => setAppointmentStatus(e.target.value)} className="border rounded-lg p-2 w-1/2 text-gray-800">
                  <option>Approved</option>
                  <option>Pending</option>
                </select>
              </div>

              {/* Minimum Time Settings */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-800 font-medium">Minimum time required before booking</label>
                  <select value={minTimeBooking} onChange={(e) => setMinTimeBooking(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                    <option>Disabled</option>
                    <option>1 hour</option>
                    <option>24 hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-800 font-medium">Minimum time required before canceling</label>
                  <select value={minTimeCanceling} onChange={(e) => setMinTimeCanceling(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                    <option>Disabled</option>
                    <option>1 hour</option>
                    <option>24 hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-800 font-medium">Minimum time required before rescheduling</label>
                  <select value={minTimeRescheduling} onChange={(e) => setMinTimeRescheduling(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                    <option>Disabled</option>
                    <option>1 hour</option>
                    <option>24 hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-800 font-medium">The number of days available for booking in advance</label>
                  <input
                    type="number"
                    value={daysInAdvance}
                    onChange={(e) => setDaysInAdvance(Number(e.target.value))}
                    className="border rounded-lg p-2 w-full mt-1 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Global Settings */}
            <h2 className="font-semibold text-xl text-gray-800 mt-8 mb-6">Global Settings</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-800 font-medium">Date Format</label>
                <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option>MMMM D, YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </div>
              <div>
                <label className="text-gray-800 font-medium">Time Format</label>
                <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option>h:mm a</option>
                  <option>HH:mm</option>
                </select>
              </div>
              <div>
                <label className="text-gray-800 font-medium">Time Zone</label>
                <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option>Bangkok</option>
                  <option>UTC</option>
                  <option>New York</option>
                </select>
              </div>
              <div>
                <label className="text-gray-800 font-medium">First Day of the Week</label>
                <select value={firstDayOfWeek} onChange={(e) => setFirstDayOfWeek(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </div>
              <div>
                <label className="text-gray-800 font-medium">Default phone country code</label>
                <select value={phoneCountryCode} onChange={(e) => setPhoneCountryCode(e.target.value)} className="border rounded-lg p-2 w-full mt-1 text-gray-800">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
              <div>
                <label className="text-gray-800 font-medium">Default FirstPage</label>
                <select className="border rounded-lg p-2 w-full mt-1">
                  <option>Dashboard</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-medium">Dashboard language</label>
                <select className="border rounded-lg p-2 w-full mt-1">
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSetting;