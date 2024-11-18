import { apiGetOneOrderByAdmin } from 'apis';
import React, { useEffect, useState } from 'react'
import { FiCalendar, FiClock, FiMail, FiPhone, FiTag } from 'react-icons/fi';
import { useParams, useSearchParams } from 'react-router-dom';
import { formatPrice } from 'ultils/helper';

const BookingHistoryDetail = () => {
  const [booking, setBooking] = useState(null);
  const {bid} = useParams()
  const [status, setStatus] = useState("Pending");

  const fetchBookingData = async () => {
    const response = await apiGetOneOrderByAdmin(bid);
    if (response?.success) {
      setBooking(response?.booking);
    }
  };

  useEffect(() => {
    setStatus(booking?.status)
  }, [booking])

  useEffect(() => {
    fetchBookingData();
  }, [bid]);

  const getStatusClass = (status) => {
    switch(status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Successful":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-yellow-200 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={booking?.info[0]?.service?.thumb}
                    alt="Service"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white">{booking?.info[0]?.service.name}</h1>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                          <div className="flex items-center text-gray-700">
                            <FiClock className="mr-2 text-blue-600" />
                            <span>{`${booking?.info[0]?.service.duration}min`}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <FiCalendar className="mr-2 text-blue-600" />
                            <span>{`${booking?.info[0]?.time} ${booking?.info[0]?.date}`}</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(booking?.info[0]?.service.price)} VNĐ
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                        <img
                          src={booking?.info[0]?.staff?.avatar}
                          alt={`${booking?.info[0]?.staff?.lastName} ${booking?.info[0]?.staff?.firstName}`}
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-200"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2";
                          }}
                        />
                        <div>
                          <h2 className="text-xl font-semibold text-purple-900">Service Provider</h2>
                          <p className="text-purple-700">{`${booking?.info[0]?.staff?.lastName} ${booking?.info[0]?.staff?.firstName}`}</p>
                        </div>
                      </div>

                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100">
                        <div className="space-y-3">
                          <div className="flex items-center text-green-700">
                            <FiMail className="mr-2" />
                            <span>{booking?.orderBy?.email}</span>
                          </div>
                          <div className="flex items-center text-green-700">
                            <FiPhone className="mr-2" />
                            <span>{booking?.orderBy?.mobile}</span>
                          </div>
                        </div>
                      </div>

                      {booking?.info[0]?.discountCode && (
                        <div className="p-6 bg-pink-50/50 rounded-2xl border border-pink-100 transform hover:scale-105 transition-transform duration-300">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-pink-200">
                              <img
                                src={booking?.info[0]?.discountCode?.image}
                                alt="Discount"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1635372722656-389f87a941b7";
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <FiTag className="mr-2 text-pink-600" />
                                <span className="font-semibold text-pink-600">{booking?.info[0]?.discountCode?.code}</span>
                              </div>
                              <p className="text-pink-700 mt-1 text-xl font-bold">- {formatPrice(booking?.info[0]?.service?.price - booking?.total)} VNĐ</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2 text-[#00143c]">Booking Summary</h2>
                        <div className="space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Service Price:</span>
                            <span>{formatPrice(booking?.info[0]?.service?.price)} VNĐ</span>
                          </div>
                          {
                            booking?.info[0]?.discountCode && 
                            <div className="flex justify-between text-green-600">
                              <span>Discount:</span>
                              <span>- {formatPrice(booking?.info[0]?.service?.price - booking?.total)} VNĐ</span>
                            </div>
                          }
                          <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
                            <span>Total Amount:</span>
                            <span>{formatPrice(booking?.total)} VNĐ</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100">
                        <h2 className="text-xl font-semibold text-amber-900 mb-4">Booking Status</h2>
                        <div className="flex flex-col space-y-3">
                          <div className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${getStatusClass(status)}`}>
                            {status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default BookingHistoryDetail