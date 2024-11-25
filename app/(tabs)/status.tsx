import React, { useState, useEffect } from 'react';

// Define the types for the orders
interface Order {
  id: number;
  address: string;
  estimatedTime: string;
  status: string[];
  items: { name: string; quantity: number }[];
  total: number;
}

const Status: React.FC = () => {
  // Mock state for orders (replace with API call in a real app)
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected order for detailed view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders (mock data for now)
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 1,
        address: '123 Main Street',
        estimatedTime: '1:00 PM',
        status: [
          '10:00 AM - Order Placed',
          '11:30 AM - Kitchen Preparing',
          '12:30 PM - Out for Delivery',
          '1:00 PM - Delivered',
        ],
        items: [{ name: 'Burger', quantity: 1 }],
        total: 15.0,
      },
      {
        id: 2,
        address: '456 Elm Street',
        estimatedTime: '2:30 PM',
        status: [
          '11:00 AM - Order Placed',
          '12:45 PM - Kitchen Preparing',
          '2:00 PM - Out for Delivery',
          '2:30 PM - Delivered',
        ],
        items: [
          { name: 'Pizza', quantity: 1 },
          { name: 'Soda', quantity: 1 },
        ],
        total: 25.0,
      },
    ];
    setOrders(mockOrders);
  }, []);

  return (
    <div>
      <h1>Order Status</h1>
      {!selectedOrder ? (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '10px',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedOrder(order)}
            >
              <p>Order {order.id}</p>
              <p>Address: {order.address}</p>
              <p>Estimated Time: {order.estimatedTime}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedOrder(null)}>Back</button>
          <h2>Order Details</h2>
          <p>Address: {selectedOrder.address}</p>
          <p>Estimated Time: {selectedOrder.estimatedTime}</p>
          <h3>Status</h3>
          <ul>
            {selectedOrder.status.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
          <h3>Items</h3>
          <div>
            {selectedOrder.items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p>
                  {item.name} x{item.quantity}
                </p>
              </div>
            ))}
          </div>
          <p>Total: RM {selectedOrder.total.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Status;
