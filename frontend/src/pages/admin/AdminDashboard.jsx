import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Clock, CheckCircle, Trash2, Edit, Plus, Users, LayoutDashboard, Search, Bell, History, ShoppingCart, MessageSquare, UtensilsCrossed, RefreshCw, ClipboardList } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { cancelOrder as adminDeleteOrder, markOrderReady, markOrderReceived, addNotification, deleteMenu, updateMenu, addMenu } from '../../api';
import { DUMMY_MENU } from '../../data/mockData';

const AdminMenu = ({ globalMenu, setGlobalMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [mealTimeFilter, setMealTimeFilter] = useState('Morning');

  const filteredMenu = globalMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealTime = item.mealTime === mealTimeFilter;
    return matchesSearch && matchesMealTime;
  });

  const handleDelete = (id) => {
    setGlobalMenu(globalMenu.filter(m => m.id !== id));
    deleteMenu(id);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsUpdating(true);
  };

  const saveUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedItem = {
      ...editingItem,
      name: formData.get('name'),
      mealTime: formData.get('mealTime'),
      price: parseFloat(formData.get('price')),
      quantity: parseInt(formData.get('quantity'), 10),
    };

    let newMenu = [...globalMenu];
    if (updatedItem.id) {
      const index = newMenu.findIndex(m => m.id === updatedItem.id);
      if (index !== -1) {
        newMenu[index] = updatedItem;
        updateMenu(updatedItem);
      }
    } else {
      const newId = newMenu.length > 0 ? Math.max(...newMenu.map(m => m.id)) + 1 : 1;
      const newItem = { ...updatedItem, id: newId };
      newMenu.push(newItem);
      addMenu(newItem);
    }

    setGlobalMenu(newMenu);
    setIsUpdating(false);
    setEditingItem(null);
  };

  if (isUpdating) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 6rem)' }}>
        <div className="dashboard-card" style={{ width: '100%', maxWidth: '600px' }}>
          <div className="dashboard-header">
            <h2 className="dashboard-title">{editingItem?.id ? 'Update Food' : 'Add New Food'}</h2>
          </div>
          <form onSubmit={saveUpdate}>
            <div className="form-group">
              <label className="form-label">Food Name</label>
              <input name="name" required type="text" className="form-control" defaultValue={editingItem?.name} />
            </div>
            <div className="form-group">
              <label className="form-label">Meal Time</label>
              <select name="mealTime" required className="form-control" defaultValue={editingItem?.mealTime || 'Morning'}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Food Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditingItem({ ...editingItem, img: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ padding: '0.6rem', cursor: 'pointer' }}
              />
              {editingItem?.img && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Image Preview:</p>
                  <img src={editingItem.img} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)' }} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input name="price" required type="number" step="0.01" className="form-control" defaultValue={editingItem?.price} />
            </div>
            <div className="form-group">
              <label className="form-label">Available Quantity</label>
              <input name="quantity" required type="number" min="1" className="form-control" defaultValue={editingItem?.quantity || 1} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-outline" onClick={() => setIsUpdating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="dashboard-title">Menu Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage available food items and prices</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleEdit({ name: '', price: '' })}>
          <Plus size={16} /> Add Food
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <select
          className="form-control"
          value={mealTimeFilter}
          onChange={(e) => setMealTimeFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '180px', cursor: 'pointer' }}
        >
          <option value="Morning" style={{ background: '#0f172a', color: '#fff' }}>Morning</option>
          <option value="Afternoon" style={{ background: '#0f172a', color: '#fff' }}>Afternoon</option>
          <option value="Evening" style={{ background: '#0f172a', color: '#fff' }}>Evening</option>
        </select>
      </div>

      <div className="menu-grid">
        {filteredMenu.map(item => (
          <div key={item.id} className="food-card">
            <div className="food-img-container">
              <img src={item.img} alt={item.name} className="food-img" />
              <span className="food-tag">{item.category || 'Uncategorized'}</span>
            </div>
            <div className="food-details">
              <h3 className="food-title">{item.name}</h3>
              <p className="food-desc" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Tag: <span style={{ color: 'var(--primary)' }}>{item.tag}</span></p>
              <p className="food-desc" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>Quantity: {item.quantity}</p>
              <div className="food-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                <span className="food-price" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{item.price.toFixed(2)}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-icon" style={{ width: '32px', height: '32px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }} title="Edit Food" onClick={() => handleEdit(item)}>
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon" style={{ width: '32px', height: '32px', color: 'var(--primary)', backgroundColor: 'rgba(255, 94, 58, 0.1)' }} title="Delete Food" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewOrders = ({ globalOrders, setGlobalOrders, globalStudentNotifications, setGlobalStudentNotifications, globalMenu, setGlobalMenu }) => {
  const pendingOrders = globalOrders.filter(o => o.status === 'Pending');

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minuteStr} ${ampm}`;
  };

  const handleMarkReady = async (orderId) => {
    try {
      await markOrderReady(orderId);
    } catch (e) {
      alert("Failed to mark ready.");
    }
  };

  const handleDelete = async (order) => {
    try {
      await adminDeleteOrder(order.id, true);
    } catch (e) {
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">View Pending Orders</h2>
        <p style={{ color: 'var(--text-muted)' }}>Mark orders as ready to notify students.</p>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Student</th>
            <th>Items</th>
            <th>Pre-Order Timing</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pending orders</td></tr>
          ) : (
            pendingOrders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{order.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                </td>
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
                <td style={{ fontWeight: 'bold' }}>₹{order.total.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleMarkReady(order.id)}>
                      Mark Ready
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(order)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const UpdateOrders = ({ globalOrders, setGlobalOrders, globalStudentNotifications, setGlobalStudentNotifications }) => {
  const handleMarkReceived = async (orderId) => {
    try {
      await markOrderReceived(orderId);
    } catch (e) {
      alert("Failed to mark as received.");
    }
  };

  const readyOrders = globalOrders.filter(o => o.status === 'Ready');

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Update Ready Orders</h2>
        <p style={{ color: 'var(--text-muted)' }}>Mark orders as received once students pay and collect food.</p>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Student</th>
            <th>Items</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {readyOrders.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No ready orders</td></tr>
          ) : (
            readyOrders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{order.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                </td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: '1rem', listStyleType: 'disc', fontSize: '0.875rem' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{item.cartQuantity}x</span> {item.name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={{ fontWeight: 'bold' }}>₹{order.total.toFixed(2)}</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: '#10b981', borderColor: '#10b981' }} onClick={() => handleMarkReceived(order.id)}>
                    Received
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const UserLoginList = ({ globalUsers, globalOrders }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  if (selectedUser) {
    const userOrders = globalOrders.filter(o => o.email === selectedUser.email);
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

    return (
      <div className="dashboard-card">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="dashboard-title">{selectedUser.name}'s Profile</h2>
            <p style={{ color: 'var(--text-muted)' }}>{selectedUser.email}</p>
          </div>
          <button className="btn btn-outline" onClick={() => setSelectedUser(null)}>Back to List</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', background: selectedUser.hasSubscription ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)', border: `1px solid ${selectedUser.hasSubscription ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`, borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Subscription Status</h3>
            <span className="status-badge" style={{ backgroundColor: selectedUser.hasSubscription ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: selectedUser.hasSubscription ? '#10b981' : '#f59e0b', fontSize: '1rem', padding: '0.5rem 1rem' }}>
              {selectedUser.hasSubscription ? 'Active (Premium)' : 'No Plan'}
            </span>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Orders</h3>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{userOrders.length}</span>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Spent</h3>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>${totalSpent.toFixed(2)}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Order History</h3>
        {userOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>No orders found for this user.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.items && Array.isArray(order.items) ? order.items.map(i => `${i.cartQuantity || 1}x ${i.name}`).join(', ') : 'No items'}</td>
                    <td style={{ fontWeight: 'bold' }}>₹{(order.total || 0).toFixed(2)}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Student Login Details</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Login</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {globalUsers.map((user, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 'bold' }}>{user.name}</td>
              <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
              <td>
                <span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.lastLogin).toLocaleString()}</td>
              <td>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setSelectedUser(user)}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



const AdminAddFood = ({ globalMenu, setGlobalMenu }) => {
  const [newItem, setNewItem] = useState({ name: '', price: '', mealTime: 'Morning', img: '', tag: 'Hot', quantity: 1 });

  const handleSave = (e) => {
    e.preventDefault();
    const id = globalMenu.length > 0 ? Math.max(...globalMenu.map(m => m.id)) + 1 : 1;
    const foodToAdd = { ...newItem, id };
    setGlobalMenu([...globalMenu, foodToAdd]);
    addMenu(foodToAdd);
    alert('Food added successfully! It will now appear in the menu.');
    setNewItem({ name: '', price: '', mealTime: 'Morning', img: '', tag: 'Hot', quantity: 1 });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 6rem)' }}>
      <div className="dashboard-card" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="dashboard-header">
          <h2 className="dashboard-title">Add New Food</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Food Name</label>
            <input required type="text" className="form-control" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Meal Time</label>
            <select required className="form-control" value={newItem.mealTime} onChange={e => setNewItem({ ...newItem, mealTime: e.target.value })}>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Food Image</label>
            <input
              required
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewItem({ ...newItem, img: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ padding: '0.6rem', cursor: 'pointer' }}
            />
            {newItem.img && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Image Preview:</p>
                <img src={newItem.img} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)' }} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Price</label>
            <input required type="number" step="0.01" className="form-control" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) || '' })} />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input required type="number" min="1" className="form-control" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) || 1 })} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">Add Food to Menu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DashboardHome = ({ globalOrders, globalUsers, globalMenu }) => {
  const colorMap = { 'Morning': '#3b82f6', 'Afternoon': '#f59e0b', 'Evening': '#10b981' };
  const mealTimeData = Object.entries(
    globalMenu.reduce((acc, item) => {
      acc[item.mealTime] = (acc[item.mealTime] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count, color: colorMap[name] || '#aaa' }));
  const maxCount = mealTimeData.length > 0 ? Math.max(...mealTimeData.map(d => d.count)) : 1;

  const recentOrders = [...globalOrders].slice(0, 5); // take top 5
  const pendingOrders = globalOrders.filter(o => o.status === 'Pending');
  const dailySales = globalOrders.filter(o => o.status === 'Received').reduce((sum, o) => sum + o.total, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Total Food Count</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', textShadow: '0 0 20px rgba(59,130,246,0.3)' }}>{globalMenu.length}</span>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Pending Orders</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f59e0b', textShadow: '0 0 20px rgba(245,158,11,0.3)' }}>{pendingOrders.length}</span>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Daily Sales</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.3)' }}>₹{dailySales.toFixed(2)}</span>
        </div>
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Registered Users</h3>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#8b5cf6', textShadow: '0 0 20px rgba(139,92,246,0.3)' }}>{globalUsers ? globalUsers.length : 0}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

        <div className="dashboard-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Recent Orders</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Order</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{order.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{order.email}</div>
                    </td>
                    <td>{order.items.length} items</td>
                    <td>
                      <span className="status-badge" style={{
                        backgroundColor: order.status === 'Received' ? 'rgba(16, 185, 129, 0.2)' : order.status === 'Ready' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: order.status === 'Received' ? '#10b981' : order.status === 'Ready' ? '#3b82f6' : '#f59e0b'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    width: `${(cat.count / maxCount) * 100}%`,
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

const Notifications = ({ globalMessages }) => {
  const [activeTab, setActiveTab] = useState('cancel');
  const safeMessages = globalMessages || [];
  
  // Categorize messages. Default to 'contact' if no type is set (for backward compatibility)
  const contactMsgs = safeMessages.filter(m => !m.type || m.type === 'contact').reverse();
  const cancelMsgs = safeMessages.filter(m => m.type === 'cancel').reverse();
  const feedbackMsgs = safeMessages.filter(m => m.type === 'feedback').reverse();
  const complaintMsgs = safeMessages.filter(m => m.type === 'complaint').reverse();

  const renderMessageList = (messages, emptyText) => {
    if (messages.length === 0) {
      return <p style={{ color: 'var(--text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>{emptyText}</p>;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ padding: '1.5rem', background: msg.type === 'cancel' ? 'rgba(245, 158, 11, 0.05)' : msg.type === 'feedback' ? 'rgba(16, 185, 129, 0.05)' : msg.type === 'complaint' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: msg.type === 'cancel' ? '1px solid rgba(245, 158, 11, 0.2)' : msg.type === 'feedback' ? '1px solid rgba(16, 185, 129, 0.2)' : msg.type === 'complaint' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <strong style={{ color: msg.type === 'cancel' ? '#f59e0b' : msg.type === 'feedback' ? '#10b981' : msg.type === 'complaint' ? '#ef4444' : 'var(--primary)', fontSize: '1.1rem' }}>{msg.name}</strong>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(msg.date).toLocaleString()}</span>
            </div>
            <div style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#aaa' }}>{msg.email}</div>
            
            {msg.type === 'complaint' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold' }}>Order #{msg.orderId}</div>
                <div style={{ fontSize: '0.9rem', color: '#fff' }}>Item: <strong>{msg.foodItem}</strong></div>
              </div>
            )}
            
            <p style={{ margin: 0, lineHeight: '1.6', color: '#eee' }}>{msg.message}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-card" style={{ minHeight: '60vh' }}>
      <div className="dashboard-header" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', margin: 0 }}>
        <div>
          <h2 className="dashboard-title">Notifications Inbox</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage all incoming alerts and messages</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'cancel' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.5rem 1rem', borderColor: activeTab !== 'cancel' ? 'rgba(255,255,255,0.2)' : undefined, background: activeTab === 'cancel' ? 'var(--primary)' : 'transparent' }}
            onClick={() => setActiveTab('cancel')}
          >
            Cancel Notifications
            <span style={{ marginLeft: '0.5rem', background: activeTab === 'cancel' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', color: '#fff' }}>{cancelMsgs.length}</span>
          </button>
          
          <button 
            className={`btn ${activeTab === 'complaint' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.5rem 1rem', borderColor: activeTab !== 'complaint' ? 'rgba(255,255,255,0.2)' : undefined, background: activeTab === 'complaint' ? '#ef4444' : 'transparent', color: activeTab === 'complaint' ? '#fff' : '#ef4444' }}
            onClick={() => setActiveTab('complaint')}
          >
            Complaints
            <span style={{ marginLeft: '0.5rem', background: activeTab === 'complaint' ? 'rgba(0,0,0,0.2)' : 'rgba(239, 68, 68, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', color: activeTab === 'complaint' ? '#fff' : '#ef4444' }}>{complaintMsgs.length}</span>
          </button>
          
          <button 
            className={`btn ${activeTab === 'feedback' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.5rem 1rem', borderColor: activeTab !== 'feedback' ? 'rgba(255,255,255,0.2)' : undefined, background: activeTab === 'feedback' ? 'var(--primary)' : 'transparent' }}
            onClick={() => setActiveTab('feedback')}
          >
            Student Feedback
            <span style={{ marginLeft: '0.5rem', background: activeTab === 'feedback' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', color: '#fff' }}>{feedbackMsgs.length}</span>
          </button>
          
          <button 
            className={`btn ${activeTab === 'contact' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.5rem 1rem', borderColor: activeTab !== 'contact' ? 'rgba(255,255,255,0.2)' : undefined, background: activeTab === 'contact' ? 'var(--primary)' : 'transparent' }}
            onClick={() => setActiveTab('contact')}
          >
            Contact Inquiries
            <span style={{ marginLeft: '0.5rem', background: activeTab === 'contact' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', color: '#fff' }}>{contactMsgs.length}</span>
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {activeTab === 'cancel' && renderMessageList(cancelMsgs, "No recent order cancellations.")}
        {activeTab === 'complaint' && renderMessageList(complaintMsgs, "No order complaints filed.")}
        {activeTab === 'feedback' && renderMessageList(feedbackMsgs, "No new feedback received.")}
        {activeTab === 'contact' && renderMessageList(contactMsgs, "No general inquiries.")}
      </div>
    </div>
  );
};

const AdminDashboard = ({ globalOrders, setGlobalOrders, globalUsers, globalMessages, setGlobalMessages, globalStudentNotifications, setGlobalStudentNotifications, globalMenu, setGlobalMenu }) => {
  const pendingOrdersCount = globalOrders.filter(o => o.status === 'Pending').length;

  const sidebarItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { label: 'Menu', path: '/admin-dashboard/menu', icon: UtensilsCrossed },
    { label: 'Add Food', path: '/admin-dashboard/add-food', icon: Plus },
    { label: 'View Order', path: '/admin-dashboard/view-order', icon: ClipboardList },
    { label: 'Update Order', path: '/admin-dashboard/update-order', icon: RefreshCw },
    { label: 'User Login', path: '/admin-dashboard/users', icon: Users },
    { label: 'Notification', path: '/admin-dashboard/notifications', icon: Bell },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} portalName="Admin Portal" notifications={pendingOrdersCount} notificationPath="/admin-dashboard/view-order">
      <Routes>
        <Route path="/" element={<DashboardHome globalOrders={globalOrders} globalUsers={globalUsers} globalMenu={globalMenu} />} />
        <Route path="/menu" element={<AdminMenu globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} />} />
        <Route path="/add-food" element={<AdminAddFood globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} />} />
        <Route path="/view-order" element={<ViewOrders globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} />} />
        <Route path="/update-order" element={<UpdateOrders globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} />} />
        <Route path="/users" element={<UserLoginList globalUsers={globalUsers} globalOrders={globalOrders} />} />
        <Route path="/notifications" element={<Notifications globalMessages={globalMessages} />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
