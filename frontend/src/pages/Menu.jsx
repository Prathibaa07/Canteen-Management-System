import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const getImgUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/images/')) return import.meta.env.BASE_URL + url.slice(1);
  return url;
};

const Menu = ({ globalMenu = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mealTimeFilter, setMealTimeFilter] = useState('Morning');
  const navigate = useNavigate();

  const filteredMenu = globalMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealTime = item.mealTime === mealTimeFilter;
    return matchesSearch && matchesMealTime;
  });

  return (
    <div className="page-bg-menu" style={{ 
      paddingBottom: '0',
      backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <div style={{ minHeight: '100vh', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.1px' }}>
        <div className="container" style={{ padding: '4rem 2rem', paddingTop: '2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', margin: '2rem 0', border: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.3)', borderLeft: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff' }}>
            <div className="page-header">
              <h1 className="page-title">Our Menu</h1>
              <p className="page-subtitle">Explore our delicious offerings and pre-order your favorites.</p>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem', borderRadius: 'var(--radius-full)' }}
              />
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
              {['Morning', 'Afternoon', 'Evening'].map(time => (
                <button 
                  key={time} 
                  className={`btn ${mealTimeFilter === time ? 'btn-primary' : ''}`} 
                  style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', background: mealTimeFilter === time ? '' : 'rgba(255,255,255,0.05)' }} 
                  onClick={() => setMealTimeFilter(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <div>
              <div className="menu-grid">
                {filteredMenu.map(item => (
                  <div 
                    key={item.id} 
                    className="food-card" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/login')}
                  >
                    <div className="food-img-container">
                      <img src={getImgUrl(item.img)} alt={item.name} className="food-img" />
                      <span className="food-tag">{item.tag}</span>
                    </div>
                    <div className="food-details">
                      <h3 className="food-title">{item.name}</h3>
                      <p className="food-desc">{item.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${item.price.toFixed(2)}</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '0.875rem', color: item.quantity > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                            {item.quantity > 0 ? `${item.quantity} available` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredMenu.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <h3>No items found</h3>
                <p>Try a different search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
