import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PublicLayout from './layouts/PublicLayout';
import { DUMMY_MENU, INITIAL_USERS } from './data/mockData';
import { fetchMenu, fetchOrders, fetchUsers, fetchMessages, fetchNotifications, addMenu, addUser } from './api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: '#fff' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [globalOrders, setGlobalOrders] = useState([]);
  const [globalMenu, setGlobalMenu] = useState([]);
  const [globalUsers, setGlobalUsers] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [globalStudentNotifications, setGlobalStudentNotifications] = useState([]);
  
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem('loggedInUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const loadData = () => {
      // Fetch data from MongoDB APIs
      Promise.all([
        fetchMenu(), fetchOrders(), fetchUsers(), fetchMessages(), fetchNotifications()
      ]).then(([menu, orders, users, msgs, nots]) => {
        // Seed database if completely empty (first time run)
        if (menu.length === 0) {
          setGlobalMenu(DUMMY_MENU);
          if (!window.hasSeededMenu) {
            window.hasSeededMenu = true;
            DUMMY_MENU.forEach(item => addMenu(item));
          }
        } else {
          setGlobalMenu(menu);
        }
        
        if (users.length === 0) {
          setGlobalUsers(INITIAL_USERS);
          if (!window.hasSeededUsers) {
            window.hasSeededUsers = true;
            INITIAL_USERS.forEach(user => addUser(user));
          }
        } else {
          setGlobalUsers(users);
        }
        
        setGlobalOrders(orders);
        setGlobalMessages(msgs);
        setGlobalStudentNotifications(nots);
      }).catch(err => console.error("API Error: Make sure Django is running!", err));
    };

    loadData(); // Initial load
    const interval = setInterval(loadData, 5000); // Auto-refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Sync loggedInUser to localStorage
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);



  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} />} />
            <Route path="menu" element={<Menu globalMenu={globalMenu} />} />
            <Route path="login" element={<Login globalUsers={globalUsers} setGlobalUsers={setGlobalUsers} setLoggedInUser={setLoggedInUser} />} />
          </Route>

          {/* Isolated Dashboard Routes */}
          <Route path="/student-dashboard/*" element={<StudentDashboard globalOrders={globalOrders} setGlobalOrders={setGlobalOrders} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} globalUsers={globalUsers} setGlobalUsers={setGlobalUsers} globalStudentNotifications={globalStudentNotifications} setGlobalStudentNotifications={setGlobalStudentNotifications} globalMenu={globalMenu} setGlobalMenu={setGlobalMenu} globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} />} />
          <Route path="/admin-dashboard/*" element={
            <AdminDashboard
              globalOrders={globalOrders}
              setGlobalOrders={setGlobalOrders}
              globalUsers={globalUsers}
              globalMessages={globalMessages}
              setGlobalMessages={setGlobalMessages}
              globalStudentNotifications={globalStudentNotifications}
              setGlobalStudentNotifications={setGlobalStudentNotifications}
              globalMenu={globalMenu}
              setGlobalMenu={setGlobalMenu}
            />
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
