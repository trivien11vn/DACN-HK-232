import React, { useCallback, useEffect, useState } from 'react';
// import ApexCharts from 'apexcharts';
// import ReactApexChart from 'react-apexcharts';
import { apiGetDailyRevenueByDateRange, apiGetUserVisitByDateRange, apiGet3RecentRevenueStatistic,
        apiGet3RecentOccupancyStatistic, apiGet3RecentNewCustomerStatistic } from 'apis'
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { formatPrice } from 'ultils/helper';
import { apiGetMostPurchasedServicesByYear } from 'apis'
import { FaAngleDoubleUp, FaAngleDoubleDown, FaBars } from "react-icons/fa";
import GridPercentageCalendar from './GridPercentageCalendar';
import CenterChart from './CenterChart';
import OrdersList from './OrdersList';
// // import './style.css';
import bgImage from '../../assets/clouds.svg'
import PerformanceSummary from './PerformanceSummary';
// import { SlPlane } from 'react-icons/sl';
import { Line } from 'react-chartjs-2';

const button_string_style = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 roundedtext-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 text-sm'

const MetricIndicator = ({ prev, current }) => {
  return (
    <span className='mt-3'>
      {
      current > prev &&
        (<span className="flex">
            <span className="text-teal-500 text-xs"><FaAngleDoubleUp style={{color: 'green' }} className='text-teal-500 rotate-45'/></span>
            <span className='text-teal-500 pr-1 text-base'>&nbsp;{(current >= 1 ? (current - prev)/current*100.0 : 0)?.toFixed(2)} %</span>
        </span>)
      }
      {
      current < prev && 
        (<span className="flex">
            <span className="text-rose-700 text-xs"><FaAngleDoubleDown className='text-rose-700 -rotate-45'/></span>
            <span className='text-rose-700 pr-1 text-base'>&nbsp;{(current >= 1 ? (current - prev)/current*100.0 : 0)?.toFixed(2)} %</span>
        </span>)
      }
      {current === prev && (<span className="flex items-center flex-col flex-wrap">
            <span className="text-gray-500 text-xs text-center">No Change</span>
            {/* <FaBars /> */}
        </span>)}
    </span>
  )  
}

const DashBoard = () => {
  const currentUser = useSelector(state => state.user.current);

  const {current} = useSelector((state) => state.user);
  // const [totalRevenue, setTotalRevenue] = useState(0)
  // const [monthRevenue, setMonthRevenue] = useState(0)
  // const [monthOrders, setMonthOrders] = useState(0)
  // const [monthCustomer, setMonthCustomer] = useState(0);
  // const [totalServices, setTotalServices] = useState(0);

  const [currentMetricView, setCurrentMetricView] = useState({
    occupancy: 3,
    new_customer: 3,
    revenue: 3
  });
  const lineOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
          beginAtZero: true,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const genericLineData = {
    labels: ['p', 'c', 't'],
    datasets: [
      {
        label: '',
        data: [],
        borderColor: '#2563EB',
        fill: {
          target: 'origin',
          above: 'rgba(37, 99, 235, 0.1)',
        },
        tension: 0.4,
      },
    ],
  };

  const [revenueTriplet, setRevenueTriplet] = useState([0,0,0]);
  const [newCustomerTriplet, setNewCustomerTriplet] = useState([0,0,0]);
  const [occupancyTriplet, setOccupancyTriplet] = useState([0,0,0]);

  // const [lineDataReveunue, setLineDataRevenue] = 

  const metricViewOptions = [
    { value: 3, label: "Current Week" },
    { value: 2, label: "Last Week" },
    { value: 1, label: "Current Month" },
    { value: 0, label: "Last Month" },
  ];

  const fetchRevenueTriplet = async (periodData) => {
    const resp = await apiGet3RecentRevenueStatistic({ periodData, spid: currentUser.provider_id?._id  });
    if (resp.success && resp.revenue?.length) {
      return resp.revenue;
    }
    return [];
  };
  const fetchOccupancyTriplet = async (periodData) => {
    const resp = await apiGet3RecentOccupancyStatistic({ periodData, spid: currentUser.provider_id?._id  });
    if (resp.success && resp.occupancy?.length) {
      return resp.occupancy;
    }
    return [];
  };
  const fetchNewCustomerTriplet = async (periodData) => {
    const resp = await apiGet3RecentNewCustomerStatistic({ periodData, spid: currentUser.provider_id?._id  });
    if (resp.success && resp.newCustomer?.length) {
      console.log('++++', resp.newCustomer);
      return resp.newCustomer;
    }
    return [];
  };
  const onChangeMetricViewOption = async (event, objectData) => {
    const viewOptionInt = parseInt(event.target.value);

    if (objectData === "revenue") {
      const periodData = (viewOptionInt > 1) ? "week" : "month";
      const data = await fetchRevenueTriplet(periodData);
      setRevenueTriplet(data);
      setCurrentMetricView({
        ...currentMetricView,
        revenue: viewOptionInt
      });
    }
    else if(objectData === "occupancy") {
      const periodData = (viewOptionInt > 1) ? "week" : "month";
      const data = await fetchOccupancyTriplet(periodData);
      setOccupancyTriplet(data);
      console.log({
        ...currentMetricView,
        occupancy: viewOptionInt
      });
      setCurrentMetricView({
        ...currentMetricView,
        occupancy: viewOptionInt
      });
    }
    else if(objectData === "new_customer") {
      const periodData = (viewOptionInt > 1) ? "week" : "month";
      const data = await fetchNewCustomerTriplet(periodData);
      setNewCustomerTriplet(data);
      setCurrentMetricView({
        ...currentMetricView,
        new_customer: viewOptionInt
      });
    }
    // setCurrentMetricView({
    //   ...currentMetricView,
    //   [objectData]: viewOptionInt
    // });
  };
  useEffect(() => {
      (async () => {
        const periodData = "week";

        let data = await fetchRevenueTriplet(periodData);
        setRevenueTriplet(data);

        data = await fetchOccupancyTriplet(periodData);
        setOccupancyTriplet(data);

        data = await fetchNewCustomerTriplet(periodData);
        setNewCustomerTriplet(data);
      })();
  }, []);

  // const revenueLast3Months = [88.8, 68.8, 39.6];// sort by time line [2w ago, 1w ago, now]
  // const revenueLast3Weeks = [8.8, 6.8, 9.6];// sort by time line [2m ago, 1m ago, now]

  const actualWorkHoursThisMonth = [];// sort by time line [2m ago, 1m ago, now]
  // const actualWorkHoursThisMonth = [];

  return (
    <div className="w-full h-full relative">
      <div className='inset-0 absolute z-0'>
        <img src={bgImage} className='w-full h-full object-cover' alt='background decorate image'/>
      </div>
      <div className="relative z-10"> {/* Thêm lớp này để đảm bảo dòng chữ không bị che mất */}
        <div className='w-full h-20 flex justify-between p-4'>
          <span className='text-[#00143c] text-3xl font-semibold'>Dashboard</span>
        </div>
        <div className='w-[95%] h-[fit] shadow-2xl rounded-md bg-white ml-4 mb-[200px] p-6 flex flex-col gap-4'>
      {/* <div className="flex justify-center mb-8 flex-wrap"> */}
        {/* <div className="max-w-sm rounded overflow-hidden grow">
          <div className="px-6 py-4">
            <p className="font-bold text-xl mb-2 text-center">Total Revenue</p>
            <p className="font-bold text-blue-700 text-xl text-center">
              {totalRevenue}
            </p>
          </div>
        </div> */}

        <div className="flex gap-4 justify-center">
          <section className='grid grid-cols-2 gap-2 bg-white p-3 text-gray-900 rounded-md grow border-2'>
            <div className='flex flex-col justify-start items-center gap-2'>
              <h5 className='pb-1 fond-semibold text-sm'>
                New Customers
              </h5>
              <span className='text-lg font-bold text-center'>
                {/* { currentMetricView.new_customer + '---' } */}
                { currentMetricView.new_customer === 3 && newCustomerTriplet[2] }
                { currentMetricView.new_customer === 2 && newCustomerTriplet[1] }
                { currentMetricView.new_customer === 1 && newCustomerTriplet[2] }
                { currentMetricView.new_customer === 0 && newCustomerTriplet[1] }

                {
                    currentMetricView.new_customer === 3 &&
                      <MetricIndicator
                        prev={newCustomerTriplet[1]} current={newCustomerTriplet[2]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.new_customer === 2 &&
                      <MetricIndicator
                        prev={newCustomerTriplet[0]} current={newCustomerTriplet[1]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.new_customer === 1 &&
                      <MetricIndicator
                        prev={newCustomerTriplet[1]} current={newCustomerTriplet[2]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.new_customer === 0 &&
                      <MetricIndicator
                        prev={newCustomerTriplet[1]} current={newCustomerTriplet[0]}>
                      </MetricIndicator>
                  }
              </span>
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
              <select
                className="border-2 rounded-md p-1"
                onChange={(event) => { onChangeMetricViewOption(event, "new_customer"); }}
              >
                {metricViewOptions.map(
                  (opt, idx) => { 
                    if (idx > 0)
                      return <option className="text-xs" value={opt?.value}>{opt?.label}</option>
                    return <option className="text-xs" selected="selected" value={opt?.value}>{opt?.label}</option>
                  }
                )}
              </select>


              <div className="w-24 h-16 mt-2">     
                  <Line data={{
                    labels: ['p', 'c', 't'],
                    datasets: [
                        {
                          label: '',
                          data: newCustomerTriplet,
                          borderColor: '#2563EB',
                          fill: {
                            target: 'origin',
                            above: 'rgba(37, 99, 235, 0.1)',
                          },
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={lineOptions}
                  />
              </div>

              {/* <div className='mt-3'>
              </div> */}
            </div>
          </section>

          <section className='grid grid-cols-2 gap-2 bg-white p-2 text-gray-900 rounded-md grow border-2'>
            <div className='flex flex-col justify-start items-center'>
              <h5 className='pb-1 fond-semibold text-sm'>
                Revenue
              </h5>
              <span className='text-lg font-bold flex flex-col text-center'>
                { currentMetricView.revenue === 3 && formatPrice(revenueTriplet[2]) }
                { currentMetricView.revenue === 2 && formatPrice(revenueTriplet[1]) }
                { currentMetricView.revenue === 1 && formatPrice(revenueTriplet[2]) }
                { currentMetricView.revenue === 0 && formatPrice(revenueTriplet[1]) }
                <span className='text-sm font-semibold'>VND</span>

                  {
                    currentMetricView.revenue === 3 &&
                    <MetricIndicator
                      prev={revenueTriplet[1]} current={revenueTriplet[2]}>
                    </MetricIndicator>
                  }
                  {
                    currentMetricView.revenue === 2 &&
                      <MetricIndicator
                        prev={revenueTriplet[0]} current={revenueTriplet[1]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.revenue === 1 &&
                      <MetricIndicator
                        prev={revenueTriplet[1]} current={revenueTriplet[2]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.revenue === 0 &&
                      <MetricIndicator
                        prev={revenueTriplet[1]} current={revenueTriplet[0]}>
                      </MetricIndicator>
                  }
              </span>
            </div>

            <div className='flex flex-col justify-center items-center gap-2'>
              <select
                className="p-1 border-2 rounded-md"
                onChange={(event) => { onChangeMetricViewOption(event, "revenue"); }}
              >
                {metricViewOptions.map(
                  (opt, idx) => { 
                    if (idx > 0)
                      return <option className="text-xs" value={opt?.value}>{opt?.label}</option>
                    return <option className="text-xs" selected="selected" value={opt?.value}>{opt?.label}</option>
                  }
                )}
              </select>
              <div className="w-24 h-16 mt-2">     
                  <Line data={{
                    labels: ['p', 'c', 't'],
                    datasets: [
                        {
                          label: '',
                          data: revenueTriplet,
                          borderColor: '#2563EB',
                          fill: {
                            target: 'origin',
                            above: 'rgba(37, 99, 235, 0.1)',
                          },
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={lineOptions}
                  />
              </div>
  
            </div>
          </section>


          <section className='grid grid-cols-2 gap-2 bg-white p-3 text-gray-900 rounded-md grow border-2'>
          <div className='flex flex-col justify-start items-center gap-2'>
                <h5 className='pb-1 fond-semibold text-sm'>
                  Occupancy
              </h5>
              <span className='text-lg font-bold flex flex-col text-center'>
                { currentMetricView.occupancy === 3 && occupancyTriplet[2]?.toFixed(2) }
                { currentMetricView.occupancy === 2 && occupancyTriplet[1]?.toFixed(2) }
                { currentMetricView.occupancy === 1 && occupancyTriplet[2]?.toFixed(2) }
                { currentMetricView.occupancy === 0 && occupancyTriplet[1]?.toFixed(2) }
                <span className='text-sm font-semibold'>%</span>
              
                  {
                    currentMetricView.occupancy === 3 &&
                      <MetricIndicator
                        prev={occupancyTriplet[1]} current={occupancyTriplet[2]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.occupancy === 2 &&
                      <MetricIndicator
                        prev={occupancyTriplet[0]} current={occupancyTriplet[1]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.occupancy === 1 &&
                      <MetricIndicator
                        prev={occupancyTriplet[1]} current={occupancyTriplet[2]}>
                      </MetricIndicator>
                  }
                  {
                    currentMetricView.occupancy === 0 &&
                      <MetricIndicator
                        prev={occupancyTriplet[0]} current={occupancyTriplet[1]}>
                      </MetricIndicator>
                  }
              </span>
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
              <select
                className="p-1 border-2 rounded-md"
                onChange={(event) => { onChangeMetricViewOption(event, "occupancy"); }}
                defaultValue={3}
              >
                {metricViewOptions.map(
                  (opt, idx) => { 
                    if (idx > 0)
                      return <option className="text-xs" value={opt?.value}>{opt?.label}</option>
                    return <option className="text-xs" value={opt?.value}>{opt?.label}</option>
                  }
                )}
              </select>


              <div className="w-24 h-16 mt-2">     
                  <Line data={{
                    labels: ['p', 'c', 't'],
                    datasets: [
                        {
                          label: '',
                          data: occupancyTriplet,
                          borderColor: '#2563EB',
                          fill: {
                            target: 'origin',
                            above: 'rgba(37, 99, 235, 0.1)',
                          },
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={lineOptions}
                  />
              </div>
  
              {/* <div className='mt-3'>
              </div> */}
            </div>
          </section>
        </div>

      <div className="flex justify-start gap-4">
        <div className="w-[65%]">
          <CenterChart providerId={currentUser.provider_id?._id}/>
          <OrdersList />
        </div>
        <div className="w-[33%]">
          <GridPercentageCalendar providerId={currentUser.provider_id?._id}/>
          <PerformanceSummary providerId={currentUser.provider_id?._id}/>
        </div>
      </div>
{/* 
      <div className="flex justify-center gap-4">
        <div className="w-[65%]">

        </div>
      </div> */}

        </div>
      </div>
    </div>
  );
}

const MostPurchasedServicesByYear = ({currentUser}) => {
  const [dataSeries, setDataSeries] = useState([]);
  const [currentYear, setCurrentYear] = useState([]);

  const fetchMostPurchasedServicesByYear = useCallback(async () => {
    // let response = await apiGetMostPurchasedServicesByYear({
    //   provider_id: currentUser.provider_id,
    //   year: (new Date()).getFullYear()
    // });

    // if (response.success && response?.services) {
    //   setDataSeries(response.services);
    // }
    // else {
    //   Swal.fire({
    //     title: 'Error Occured',
    //     text: 'Error Occured Fetching Data',
    //     icon: 'warning',
    //     showCancelButton: true
    //   })
    // }
  }, []);
  useEffect(() => {
    fetchMostPurchasedServicesByYear()
  }, [])

  const state = {
    series: [44, 55, 13, 43, 22],
    options: {
    // theme: {
    //   monochrome: {
    //     enabled: true,
    //   },
    // },
    chart: {
      // height: 220,
      type: 'pie',
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    legend: {
      show: false,
    },
    // responsive: [{
    //   breakpoint: 480,
    //   options: {
    //     chart: {
    //       width: 200
    //     },
    //     legend: {
    //       position: 'bottom'
    //     }
    //   }
    // }]
    },
  };

  return (
    <div className="grow" style={{width: '45%'}}>
      {/* <p className="font-bold text-xl mb-2 text-center">Top Services</p>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type='pie' height={300} />
      </div> */}
      {/* <div id="html-dist"></div> */}
    </div>
  );
}

const UserVisitStatChart = ({currentUser}) => {
  const [dataSeries, setDataSeries] = useState([])
  const minDate = moment().subtract(2, 'months').startOf('month').toDate()
  const maxDate = moment().add(2, 'months').startOf('month').toDate()

  const fetchUserVisit = useCallback(async () => {
    // const requestBody = {
    //   provider_id: currentUser.provider_id,
    //   start_date: minDate,
    //   end_date: maxDate
    // }
    // let response = await apiGetUserVisitByDateRange(requestBody)

    // if (response.success && response?.userVisit) {
    //   setDataSeries(response.userVisit)
    // }
    // else {
    //   Swal.fire({
    //     title: 'Error Occured',
    //     text: 'Error Occured Fetching Data',
    //     icon: 'warning',
    //     showCancelButton: true
    //   })
    // }
  }, [])
  useEffect(() => {
    fetchUserVisit()
  }, [])

  const state = {
    series: [{
      name: "user visit",
      data: dataSeries
    }],
    options: {
      chart: {
        type: 'bar',
        height: 380
      },
      xaxis: {
        type: 'category',
        // labels: {
        //   formatter: function(val) {
        //     return "Q" + dayjs(val).quarter()
        //   }
        // },
        // group: {
        //   style: {
        //     fontSize: '10px',
        //     fontWeight: 700
        //   },
        //   groups: [
        //     { title: '2019', cols: 4 },
        //     { title: '2020', cols: 4 }
        //   ]
        // },
        borderColor: '#999',
        labels: {
          show: true,
          style: {
            colors: "white",
            background: '#00E396'
          }
        }
      },
      yaxis: {
        borderColor: '#999',
        labels: {
          show: true,
          style: {
            colors: "white",
            background: '#00E396'
          }
        }
      }
      // tooltip: {
      //   x: {
      //     formatter: function(val) {
      //       return "Q" + dayjs(val).quarter() + " " + dayjs(val).format("YYYY")
      //     }  
      //   }
      // },
    },
  
  };

    return (
      <div className="grow" style={{width: '200px'}}>
        {/* <p className="font-bold text-xl mb-2 text-center">Monthly Visit</p>
        <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="bar" height={400} />
        </div> */}
        {/* <div id="html-dist"></div> */}
      </div>
    );
}


function ApexChart() {
  const [chartSelection, setChartSelection] = useState("one_year")
  const {current} = useSelector((state) => state.user);

  const [dailyRevenue, setDailyRevenue] = useState([])
  const minDate = moment().subtract(2, 'months').startOf('month').toDate()
  const maxDate = moment().add(2, 'months').startOf('month').toDate()

  const fetchDailyRevenue = useCallback(async () => {
    const requestBody = {
      provider_id: current.provider_id,
      start_date: minDate,
      end_date: maxDate
    }
    let response = await apiGetDailyRevenueByDateRange(requestBody)

    // if (response.success && response?.revenue) {
    //   setDailyRevenue(response.revenue)
    // }
    // else {
    //   Swal.fire({
    //     title: 'Error Occured',
    //     text: 'Error Occured Reading Data',
    //     icon: 'warning',
    //     showCancelButton: true
    //   })
    // }
  }, [])
  useEffect(() => {
    fetchDailyRevenue()
  }, [])

  const state = {   
    series: [{
      data: dailyRevenue
    }],
    options: {
      chart: {
        id: 'area-datetime',
        type: 'area',
        // zoom: {
        //   autoScaleYaxis: true
        // },
      },
      // annotations: {
        yaxis:{
          y: 30,
          borderColor: '#999',
          labels: {
            show: true,
            style: {
              colors: "white",
              background: '#00E396'
            }
          }
        },
        xaxis: {
          type: 'datetime',
          min: minDate.getTime(),
          tickAmount: 6,
          max: maxDate.getTime(),
          borderColor: '#999',
          yAxisIndex: 0,
          labels: {
            show: true,
            style: {
              colors: "white",
              background: '#775DD0'
            }
          }
        },
      // },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        style: 'hollow',
        strokeWidth: 2,
      },
      tooltip: {
        x: {
          format: 'dd MMMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    },
    selection: chartSelection,
  };

  // const updateData = useCallback((timeline) => {
  //   setChartSelection(timeline)
  
  //   switch (timeline) {
  //     case 'one_month':
  //       ApexCharts.exec(
  //         'area-datetime',
  //         'zoomX',
  //         new Date('28 Jan 2013').getTime(),
  //         new Date('27 Feb 2013').getTime()
  //       )
  //       break
  //     case 'six_months':
  //       ApexCharts.exec(
  //         'area-datetime',
  //         'zoomX',
  //         new Date('27 Sep 2012').getTime(),
  //         new Date('27 Feb 2013').getTime()
  //       )
  //       break
  //     case 'one_year':
  //       ApexCharts.exec(
  //         'area-datetime',
  //         'zoomX',
  //         new Date('27 Feb 2012').getTime(),
  //         new Date('27 Feb 2013').getTime()
  //       )
  //       break
  //     case 'ytd':
  //       ApexCharts.exec(
  //         'area-datetime',
  //         'zoomX',
  //         new Date('01 Jan 2013').getTime(),
  //         new Date('27 Feb 2013').getTime()
  //       )
  //       break
  //     case 'all':
  //       ApexCharts.exec(
  //         'area-datetime',
  //         'zoomX',
  //         new Date('23 Jan 2012').getTime(),
  //         new Date('27 Feb 2013').getTime()
  //       )
  //       break
  //     default:
  //   }
  // }, [])


    return (
      <div className="grow" style={{width: '55%'}}>
        {/* <p className="font-bold text-xl mb-2 text-center">Recent Revenue</p>
        <div id="chart">
        
          <div id="chart-timeline">
            <ReactApexChart options={state.options} series={state.series} type="area" height={380} />
          </div>
        </div> */}
        
        {/* <div id="html-dist"></div> */}
      </div>
  );
}

export default DashBoard