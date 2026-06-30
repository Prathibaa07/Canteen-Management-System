import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { addUser } from '../api';

const Login = ({ globalUsers, setGlobalUsers, setLoggedInUser }) => {
  const [role, setRole] = useState('student');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (username === 'admin@canteen.com' && password === 'admin@123') {
        navigate('/admin-dashboard');
      } else {
        setError('Invalid admin credentials.');
      }
    } else {
      // Student logic
      if (isSignUp) {
        if (username && password && name && email) {
          try {
            const newUser = { name, email, username, password, role: 'student' };
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://canteen-management-system-ids8.onrender.com/api'}/users/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser)
            });
            
            if (response.ok) {
              const createdUser = await response.json();
              setGlobalUsers([...globalUsers, createdUser]);
              const updatedUser = { ...createdUser, lastLogin: new Date().toISOString() };
              setLoggedInUser(updatedUser);
              navigate('/student-dashboard');
            } else {
              const errData = await response.json();
              setError(errData.error || 'Failed to create account.');
            }
          } catch (err) {
            setError('Failed to connect to server.');
          }
        } else {
          setError('Please fill all fields.');
        }
      } else {
        if (username && password) {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://canteen-management-system-ids8.onrender.com/api'}/student/login/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
              const user = await response.json();
              const updatedUser = { username: username, ...user, role: 'student', lastLogin: new Date().toISOString() };
              setLoggedInUser(updatedUser);
              navigate('/student-dashboard');
            } else {
              setError('Invalid username or password.');
            }
          } catch (err) {
            setError('Failed to connect to server.');
          }
        } else {
          setError('Please enter username and password.');
        }
      }
    }
  };

  return (
    <div className="page-bg-login">
      <div style={{ minHeight: '100vh', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.1px' }}>
      <div className="auth-container" style={{ minHeight: '100vh', background: 'transparent' }}>
        <div className="auth-card">
          <h2 className="auth-title">{role === 'admin' ? 'Admin Login' : (isSignUp ? 'Student Sign Up' : 'Student Login')}</h2>
        <p className="auth-subtitle">
          {role === 'admin' 
            ? 'Admin Portal' 
            : (isSignUp ? 'Create your student account' : 'Login to your student account')}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setRole('student'); setError(''); setIsSignUp(false); }}
          >
            Student
          </button>
          <button 
            type="button"
            className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setRole('admin'); setError(''); setIsSignUp(false); }}
          >
            Admin
          </button>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {role === 'student' && isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">{role === 'admin' ? 'Email Address' : 'Username'}</label>
            <input 
              type={role === 'admin' ? 'email' : 'text'} 
              className="form-control" 
              placeholder={role === 'admin' ? 'Enter your email' : 'Enter your username'} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {role === 'student' && !isSignUp && (
             <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
               <a href="#" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>Forgot Password?</a>
             </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isSignUp ? <><UserPlus size={18} /> Sign Up</> : <><LogIn size={18} /> Login</>}
          </button>

          {role === 'student' && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button 
                type="button" 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isSignUp ? 'Login here' : 'Sign up now'}
              </button>
            </div>
          )}
        </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
