const About = () => {
  return (
    <div className="page-bg-about">
      <div style={{ minHeight: '100vh', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.1px' }}>
        <div className="container" style={{ padding: '4rem 2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', margin: '2rem 0', border: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.3)', borderLeft: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff' }}>
            <div className="page-header">
              <h1 className="page-title">About CraveCampus</h1>
              <p className="page-subtitle">Redefining the campus dining experience.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '4rem', marginTop: '3rem', alignItems: 'center' }}>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                  alt="Canteen Interior" 
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} 
                />
              </div>
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Our Mission</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '1rem' }}>
                  We believe that students deserve delicious, high-quality meals without the hassle of long queues. CraveCampus was built to seamlessly connect students with the campus canteen.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                  From ordering your favorite coffee between classes to grabbing a quick lunch, we make the entire process fast, easy, and satisfying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
