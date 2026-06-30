import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { addMessage } from '../api';

const Contact = ({ globalMessages, setGlobalMessages }) => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newMessage = {
      id: Date.now(),
      type: 'contact',
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      date: new Date().toISOString()
    };
    if (setGlobalMessages) {
      setGlobalMessages([...(globalMessages || []), newMessage]);
    }
    addMessage(newMessage);
    setStatus('Message sent successfully! Our team will contact you soon.');
    e.target.reset();
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="page-bg-contact">
      <div style={{ minHeight: '100vh', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.1px' }}>
        <div className="container" style={{ padding: '4rem 2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', margin: '2rem 0', border: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.3)', borderLeft: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff' }}>
            <div className="page-header">
              <h1 className="page-title">Contact Us</h1>
              <p className="page-subtitle">Have questions or feedback? We'd love to hear from you.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '4rem', marginTop: '2rem' }}>
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Get in Touch</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 94, 58, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Location</h4>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>Main Campus Building, Block B</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 94, 58, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Phone</h4>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 94, 58, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Email</h4>
                      <p style={{ color: 'var(--text-muted)', margin: 0 }}>support@cravecampus.edu</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="auth-card" style={{ maxWidth: '100%', margin: 0 }}>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input name="name" type="text" className="form-control" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input name="email" type="email" className="form-control" placeholder="Your email" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-control" rows="4" placeholder="How can we help?" required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
