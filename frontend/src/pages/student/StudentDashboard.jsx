import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, ClipboardList, ShoppingCart, Search, Trash2, Bell, MessageSquare, User, Mail, Plus, Minus, Calendar, History, Clock, Crown, Star } from 'lucide-react';
import { subscribeStudent, placeOrder as apiPlaceOrder, cancelOrder, addMessage } from '../../api';
import DashboardLayout from '../../layouts/DashboardLayout';

export const getImgUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/images/')) return import.meta.env.BASE_URL + url.slice(1);
  return url;
};

export const isSubscribed = (user) => {
  if (!user?.hasSubscription || !user?.subscriptionDate) return false;
  const expiryDate = new Date(user.subscriptionDate);
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  return new Date().getTime() < expiryDate.getTime();
};

const StudentSummary = ({ globalMenu, pastOrders, pendingOrders, mealTimeData, loggedInUser, setLoggedInUser, globalUsers, setGlobalUsers }) => {
  const menuCount = globalMenu.length;
  const maxCount = mealTimeData.length > 0 ? Math.max(...mealTimeData.map(d => d.count)) : 1;
  const totalCompleted = pastOrders.length;
  const totalSpent = pastOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem' }}>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Food Available</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', textShadow: '0 0 20px rgba(59,130,246,0.3)' }}>{menuCount}</span>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Completed Orders</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.3)' }}>{totalCompleted}</span>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Total Amount Spent</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b', textShadow: '0 0 20px rgba(245,158,11,0.3)' }}>₹{totalSpent.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
        <div 
          className="dashboard-card" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '2.5rem', 
            background: isSubscribed(loggedInUser) ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(79, 70, 229, 0.1) 100%)' : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)', 
            border: isSubscribed(loggedInUser) ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(245, 158, 11, 0.2)',
            boxShadow: isSubscribed(loggedInUser) ? '0 0 30px rgba(139, 92, 246, 0.15)' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isSubscribed(loggedInUser) && (
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(139, 92, 246, 0.2)', filter: 'blur(40px)', borderRadius: '50%' }} />
          )}

          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              padding: '1.25rem', 
              background: isSubscribed(loggedInUser) ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.1)', 
              borderRadius: '50%', 
              color: isSubscribed(loggedInUser) ? '#a78bfa' : '#fcd34d',
              boxShadow: isSubscribed(loggedInUser) ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none'
            }}>
              {isSubscribed(loggedInUser) ? <Crown size={48} strokeWidth={1.5} /> : <Star size={48} strokeWidth={1.5} />}
            </div>
            
            <h4 style={{ 
              fontSize: '1.75rem', 
              color: '#fff', 
              margin: '0.5rem 0 0 0',
              fontWeight: 'bold',
              textShadow: isSubscribed(loggedInUser) ? '0 0 10px rgba(139, 92, 246, 0.5)' : 'none'
            }}>
              {isSubscribed(loggedInUser) ? 'Premium Member' : 'Upgrade to Premium'}
            </h4>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '320px', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
              {isSubscribed(loggedInUser)
                ? 'You have full access to exclusive pre-order scheduling and priority queueing. Enjoy your perks!'
                : 'Subscribe to our premium plan to unlock exclusive pre-order timing and skip the line!'}
            </p>
            
            {isSubscribed(loggedInUser) && loggedInUser?.subscriptionDate && (
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '0.5rem 1rem', 
                borderRadius: 'var(--radius-full)', 
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '1rem' 
              }}>
                <span style={{ fontSize: '0.875rem', color: '#a78bfa', fontWeight: '500' }}>
                  Valid until: {new Date(new Date(loggedInUser.subscriptionDate).setMonth(new Date(loggedInUser.subscriptionDate).getMonth() + 1)).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {isSubscribed(loggedInUser) ? (
              <span className="status-badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', padding: '0.75rem 1.5rem', fontSize: '1rem', border: '1px solid rgba(139, 92, 246, 0.4)', boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' }}>
                Status: Active
              </span>
            ) : (
              <button
                className="btn"
                style={{
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={async () => {
                  if (loggedInUser && loggedInUser.username) {
                    try {
                      const updatedUser = await subscribeStudent(loggedInUser.username);
                      setLoggedInUser(updatedUser);
                      alert('Payment Successful! You are now a Premium Member.');
                    } catch (e) {
                      alert('Failed to subscribe.');
                    }
                  } else {
                    alert('You must be logged in to subscribe.');
                  }
                }}
              >
                Subscribe Now (₹150/month)
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Food Count by Meal Time</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1rem' }}>
            {mealTimeData.map(cat => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '80px', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: '500' }}>{cat.name}</span>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '28px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{
                    width: maxCount > 0 ? `${(cat.count / maxCount) * 100}%` : '0%',
                    background: `linear-gradient(90deg, ${cat.color}aa, ${cat.color})`,
                    height: '100%',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: `0 0 10px ${cat.color}88`
                  }} />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {cat.count} Items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentMenu = ({ globalMenu, addToCart }) => {
  const [mealTimeFilter, setMealTimeFilter] = useState('Morning');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMenu = globalMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealTime = item.mealTime === mealTimeFilter;
    return matchesSearch && matchesMealTime;
  });

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Order Food</h2>
        <p style={{ color: 'var(--text-muted)' }}>Browse the menu and add items to your cart</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
        {['Morning', 'Afternoon', 'Evening'].map(time => (
          <button
            key={time}
            className={`btn ${mealTimeFilter === time ? 'btn-primary' : ''}`}
            style={{ padding: '0.5rem 1rem', background: mealTimeFilter === time ? '' : 'rgba(255,255,255,0.05)' }}
            onClick={() => setMealTimeFilter(time)}
          >
            {time}
          </button>
        ))}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div style={{ paddingTop: '1rem' }}>
        <div className="menu-grid">
          {filteredMenu.map(item => (
            <div key={item.id} className="food-card">
              <div className="food-img-container">
                <img src={getImgUrl(item.img)} alt={item.name} className="food-img" />
                <span className="food-tag">{item.tag}</span>
              </div>
              <div className="food-details">
                <h3 className="food-title">{item.name}</h3>
                <p className="food-desc" style={{ marginBottom: '0.25rem' }}>{item.desc}</p>
                <p className="food-desc" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>Quantity: {item.quantity}</p>
                <div className="food-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                  <span className="food-price" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{item.price.toFixed(2)}</span>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentCart = ({ cart, placeOrder, clearCart, updateCartQuantity, removeFromCart, loggedInUser }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const [preOrderDay, setPreOrderDay] = useState('');
  const [preOrderDate, setPreOrderDate] = useState('');
  const [preOrderTime, setPreOrderTime] = useState('');
  
  const handlePlaceOrder = () => {
    if (!loggedInUser) {
      alert("You must be logged in to place an order.");
      return;
    }
    placeOrder(preOrderDay, preOrderDate, preOrderTime);
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="dashboard-title">Your Cart</h2>
        {cart.length > 0 && <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={clearCart}>Clear Cart</button>}
      </div>
      {cart.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>Your cart is empty. Go to the menu to add items.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={getImgUrl(item.img)} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.tag}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                  <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => updateCartQuantity(item.id, -1)} disabled={item.cartQuantity <= 1}>-</button>
                  <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.cartQuantity}</span>
                  <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => updateCartQuantity(item.id, 1)} disabled={item.cartQuantity >= item.quantity}>+</button>
                </div>

                <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)', minWidth: '80px', textAlign: 'right' }}>
                  ₹{(item.price * item.cartQuantity).toFixed(2)}
                </div>

                <button className="btn-icon" style={{ width: '36px', height: '36px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} title="Remove Item" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total Amount:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
          </div>

          {isSubscribed(loggedInUser) && (
            <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#8b5cf6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutDashboard size={20} /> Pre-Order Timing (Subscription Exclusive)
              </h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Day (Optional)</label>
                  <select className="form-control" value={preOrderDay} onChange={(e) => setPreOrderDay(e.target.value)}>
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Date (Optional)</label>
                  <input type="date" className="form-control" value={preOrderDate} onChange={(e) => setPreOrderDate(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Time (Optional)</label>
                  <input type="time" className="form-control" value={preOrderTime} onChange={(e) => setPreOrderTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={handlePlaceOrder}>
            Place Order Now
          </button>
        </>
      )}
    </div>
  );
};

const StudentActiveOrders = ({ orders, globalMenu, setGlobalMenu, globalOrders, setGlobalOrders, loggedInUser, globalStudentNotifications, setGlobalStudentNotifications, globalMessages, setGlobalMessages }) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minuteStr} ${ampm}`;
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Active Order Status</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track the real-time status of your current orders</p>
      </div>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>You have no active orders currently preparing.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Pre-Order Timing</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.items && Array.isArray(order.items) ? order.items.map(i => `${i.cartQuantity || 1}x ${i.name}`).join(', ') : 'No items'}</td>
                <td>
                  {(order.preOrderDay || order.preOrderDate || order.preOrderTime) ? (
                    <div style={{ fontSize: '0.875rem', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '0.5rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {order.preOrderDate && <div><strong>Date:</strong> {order.preOrderDate}</div>}
                      {order.preOrderDay && <div><strong>Day:</strong> {order.preOrderDay}</div>}
                      {order.preOrderTime && <div><strong>Time:</strong> {formatTime(order.preOrderTime)}</div>}
                    </div>
                  ) : <span style={{ color: 'var(--text-muted)' }}>None</span>}
                </td>
                <td style={{ fontWeight: 'bold' }}>₹{(order.total || 0).toFixed(2)}</td>
                <td>
                  <span className="status-badge" style={{
                    backgroundColor: order.status === 'Ready' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: order.status === 'Ready' ? '#3b82f6' : '#f59e0b'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'Pending' && (
                    <button
                      className="btn btn-outline"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', borderColor: '#ef4444' }}
                      onClick={async () => {
                        try {
                          await cancelOrder(order.id);
                          alert('Order canceled successfully. Refund processed.');
                        } catch (e) {
                          alert('Failed to cancel order.');
                        }
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const StudentOrderHistory = ({ orders, loggedInUser }) => {
  const [activeComplaintOrder, setActiveComplaintOrder] = useState(null);
  const [complaintItem, setComplaintItem] = useState('');
  const [complaintMsg, setComplaintMsg] = useState('');

  const submitComplaint = (e) => {
    e.preventDefault();
    if (!complaintItem || !complaintMsg) {
      alert("Please select an item and provide details.");
      return;
    }

    if (!loggedInUser) {
      alert("You must be logged in to submit a complaint.");
      return;
    }

    const newMsg = {
      id: Date.now(),
      name: loggedInUser.name,
      username: loggedInUser.username,
      type: 'complaint',
      orderId: activeComplaintOrder.id,
      foodItem: complaintItem,
      message: complaintMsg,
      date: new Date().toISOString()
    };

    addMessage(newMsg);
    setActiveComplaintOrder(null);
    setComplaintItem('');
    setComplaintMsg('');
    alert('Your complaint has been submitted successfully.');
  };

  if (activeComplaintOrder) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2 className="dashboard-title">File a Complaint</h2>
          <p style={{ color: 'var(--text-muted)' }}>Report an issue regarding Order #{activeComplaintOrder.id}</p>
        </div>
        <form onSubmit={submitComplaint} style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label className="form-label">Which item was problematic?</label>
            <select 
              className="form-control" 
              value={complaintItem} 
              onChange={e => setComplaintItem(e.target.value)}
              required
            >
              <option value="" disabled>Select an item...</option>
              {activeComplaintOrder.items && activeComplaintOrder.items.map((item, idx) => (
                <option key={idx} value={item.name} style={{ background: '#0f172a', color: '#fff' }}>
                  {item.cartQuantity}x {item.name}
                </option>
              ))}
              <option value="Entire Order" style={{ background: '#0f172a', color: '#fff' }}>Entire Order</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Complaint Details</label>
            <textarea 
              className="form-control" 
              rows="5" 
              placeholder="Please describe the issue..."
              value={complaintMsg}
              onChange={e => setComplaintMsg(e.target.value)}
              required
            ></textarea>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }}>Submit Complaint</button>
            <button type="button" className="btn btn-outline" onClick={() => setActiveComplaintOrder(null)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Order History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your past completed orders</p>
      </div>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>You have no past completed orders.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.items && Array.isArray(order.items) ? order.items.map(i => `${i.cartQuantity || 1}x ${i.name}`).join(', ') : 'No items'}</td>
                <td style={{ fontWeight: 'bold' }}>₹{(order.total || 0).toFixed(2)}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', borderColor: '#ef4444' }}
                    onClick={() => setActiveComplaintOrder(order)}
                  >
                    Complaint
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const StudentNotifications = ({ globalStudentNotifications, loggedInUser }) => {
  const userIdentifier = loggedInUser?.username || 'student';
  const userNotifications = globalStudentNotifications.filter(n => (n.username || n.email) === userIdentifier);
  const notifications = [...userNotifications];

  const subscribed = isSubscribed(loggedInUser);
  
  if (loggedInUser?.subscriptionDate) {
    const subDate = new Date(loggedInUser.subscriptionDate);
    const expiryDate = new Date(subDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const timeDiff = expiryDate.getTime() - new Date().getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (subscribed && daysDiff > 0 && daysDiff <= 5) {
      notifications.unshift({
        id: 'sub-warning',
        date: new Date().toISOString().split('T')[0],
        message: `Your Premium Subscription expires in ${daysDiff} days. Make sure to renew soon to keep your benefits!`,
        type: 'warning'
      });
    } else if (!subscribed && loggedInUser.hasSubscription) {
      // It has expired but the object wasn't updated
      notifications.unshift({
        id: 'sub-expired',
        date: new Date().toISOString().split('T')[0],
        message: `Your 1-Month Premium Subscription has expired. Please subscribe again to unlock pre-order timing and priority queueing!`,
        type: 'warning'
      });
    }
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Notifications</h2>
        <p style={{ color: 'var(--text-muted)' }}>Stay updated with your orders and account</p>
      </div>
      {notifications.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>You have no notifications right now.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((note, idx) => (
            <div key={idx} style={{ padding: '1.5rem', background: note.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)', borderLeft: `4px solid ${note.type === 'warning' ? '#f59e0b' : '#3b82f6'}`, borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{note.message}</p>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{note.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StudentFeedback = ({ globalMessages, setGlobalMessages, loggedInUser }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!loggedInUser) {
      alert("You must be logged in to send feedback.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      type: 'feedback',
      name: loggedInUser.name,
      username: loggedInUser.username,
      message: feedback,
      date: new Date().toISOString()
    };
    
    setGlobalMessages([...(globalMessages || []), newMessage]);
    addMessage(newMessage); // Persist to MongoDB
    alert('Thank you for your feedback! It has been sent to the administrator.');
    setFeedback('');
  };

  return (
    <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="dashboard-header">
        <h2 className="dashboard-title">Send Feedback</h2>
        <p style={{ color: 'var(--text-muted)' }}>Have a suggestion about the food or want to request something new? Let us know!</p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>

        <div className="form-group">
          <label className="form-label">Your Message / Suggestion</label>
          <textarea 
            className="form-control" 
            rows="5" 
            placeholder="I would love to see more vegan options..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Feedback</button>
      </form>
    </div>
  );
};

const StudentDashboard = ({ globalOrders, setGlobalOrders, loggedInUser, setLoggedInUser, globalUsers, setGlobalUsers, globalStudentNotifications, setGlobalStudentNotifications, globalMenu, setGlobalMenu, globalMessages, setGlobalMessages }) => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Filter orders for the logged-in student or guest username
  const userIdentifier = loggedInUser?.username || localStorage.getItem('guestName') || 'student';
  const myOrders = globalOrders.filter(o => o.username === userIdentifier);
  const activeOrders = myOrders.filter(o => o.status !== 'Received');
  const pastOrders = myOrders.filter(o => o.status === 'Received');
  const readyOrdersCount = myOrders.filter(o => o.status === 'Ready').length;

  // Compute meal time data dynamically from globalMenu
  const colorMap = { 'Morning': '#3b82f6', 'Afternoon': '#f59e0b', 'Evening': '#10b981' };
  const mealTimeData = Object.entries(
    globalMenu.reduce((acc, item) => {
      acc[item.mealTime] = (acc[item.mealTime] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count, color: colorMap[name] || '#aaa' }));

  const sidebarItems = [
    { label: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
    { label: 'Menu', path: '/student-dashboard/menu', icon: Utensils },
    { label: 'My Cart', path: '/student-dashboard/cart', icon: ShoppingCart },
    { label: 'Order', path: '/student-dashboard/order', icon: ClipboardList },
    { label: 'History', path: '/student-dashboard/history', icon: ClipboardList },
    { label: 'Notifications', path: '/student-dashboard/notifications', icon: Bell },
    { label: 'Feedback', path: '/student-dashboard/feedback', icon: MessageSquare },
  ];

  // We will also pass the total unread notifications count to the bell icon, but for simplicity we'll just show pending ready orders as notifications for now.
  // We can modify the `notificationPath` in DashboardLayout to point to `/student-dashboard/notifications`.

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      if (existing.cartQuantity < item.quantity) {
        setCart(cart.map(c => c.id === item.id ? { ...c, cartQuantity: c.cartQuantity + 1 } : c));
        alert('Increased quantity of ' + item.name + ' in cart');
      } else {
        alert('Cannot add more. Max available quantity reached!');
      }
    } else {
      if (item.quantity > 0) {
        setCart([...cart, { ...item, cartQuantity: 1 }]);
        alert('This food was added to cart');
      } else {
        alert('Sorry, this item is out of stock!');
      }
    }
  };

  const updateCartQuantity = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQ = c.cartQuantity + delta;
        if (newQ >= 1 && newQ <= c.quantity) {
          return { ...c, cartQuantity: newQ };
        }
      }
      return c;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (preOrderDay, preOrderDate, preOrderTime) => {
    if (cart.length === 0) return;

    const orderData = {
      name: loggedInUser?.name,
      username: loggedInUser?.username,
      items: cart,
      preOrderDay: preOrderDay || null,
      preOrderDate: preOrderDate || null,
      preOrderTime: preOrderTime || null
    };

    try {
      await apiPlaceOrder(orderData);
      setCart([]);
      navigate('/student-dashboard/order');
    } catch (e) {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} portalName="Student Portal" notifications={globalStudentNotifications?.filter(n => (n.username || n.email) === userIdentifier).length || readyOrdersCount} notificationPath="/student-dashboard/notifications">
      <Routes>
        <Route path="/" element={<StudentSummary globalMenu={globalMenu} pastOrders={pastOrders} pendingOrders={activeOrders} mealTimeData={mealTimeData} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} globalUsers={globalUsers} setGlobalUsers={setGlobalUsers} />} />
        <Route path="/menu" element={<StudentMenu globalMenu={globalMenu} addToCart={addToCart} />} />
        <Route path="/cart" element={<StudentCart cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} clearCart={clearCart} placeOrder={placeOrder} loggedInUser={loggedInUser} />} />
        <Route path="/order" element={<StudentActiveOrders orders={activeOrders} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} loggedInUser={loggedInUser} globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications} globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} />} />
        <Route path="/history" element={<StudentOrderHistory orders={pastOrders} loggedInUser={loggedInUser} />} />
        <Route path="/notifications" element={<StudentNotifications globalStudentNotifications={globalStudentNotifications} loggedInUser={loggedInUser} />} />
        <Route path="/feedback" element={<StudentFeedback globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} loggedInUser={loggedInUser} />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
