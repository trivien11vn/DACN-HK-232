import { apiUpdateOrderStatus, apiGetOrdersByAdmin } from 'apis';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const PAGE_LIMIT = 5;
// Sample statuses with styling
const STATUS_STYLES = {
  Successful: 'text-green-500 bg-green-100',
  Pending: 'text-gray-500 bg-gray-100',
  Canceled: 'text-yellow-500 bg-yellow-100'
};

// Available statuses for filtering and editing
const STATUS_OPTIONS = ["All", "Successful", "Pending", "Canceled"];
const EDITABLE_STATUS_OPTIONS = ["Successful", "Pending", "Canceled"];

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("Successful"); // Default to show all statuses
  const ordersPerPage = 7; // Display 7 orders per page

  // Fetch orders data from the API
  const fetchOrders = async (page, status) => {
    let orders = await apiGetOrdersByAdmin({
      limit: PAGE_LIMIT,
      page: page,
      sort: 'createdAt:desc',
      status: status
    });

    if (!orders.success) {
      Swal.fire("Error Occured!", "Cannot fetch Order Data", "error");
      return;
    }

    console.log('Orders: ', orders);

    setOrders(orders.orders);
    setCurrentPage(page);
    setTotalPages(Math.ceil(orders.counts/PAGE_LIMIT));
  };

  useEffect(() => {
    fetchOrders(currentPage, selectedStatus);
  }, [currentPage, selectedStatus]);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    let resp = await apiUpdateOrderStatus(orderId, { status: newStatus });
    // Optimistically update the UI
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Format timestamp to a more readable date
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-500">Last Orders</h2>
        
        {/* Status Filter Dropdown */}
        <select
          className="border border-gray-300 rounded px-2 py-1 text-gray-500"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1); // Reset to page 1 on status change
          }}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Date</th>
            <th>Service</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Staff</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4 text-gray-500">{formatTimestamp(order?.createdAt)}</td>
              <td className="flex items-center space-x-2">
                <span className="text-gray-600">{order.serviceDetails?.name}</span>
              </td>
              <td className="text-gray-600">{order.userDetails?.firstName + order.userDetails?.lastName}</td>
              <td>
                {/* Editable Status Dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className={`px-2 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[order.status] || 'text-gray-500 bg-gray-100'}`}
                >
                  {EDITABLE_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="flex flex-col h-full items-center justify-center p-1">
                <img src={order.staffDetails.avatar} alt={order.staffDetails?.name} className="w-8 h-8 rounded-full" />
                <span className="text-gray-600 text-xs text-center">{order.staffDetails?.lastName + ' ' + order.staffDetails?.firstName}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-500">Page {currentPage} of {totalPages}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages).keys()].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-2 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-500 hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;