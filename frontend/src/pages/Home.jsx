import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Clock, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="page-bg-home">
      <div style={{ minHeight: '100vh', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.1px' }}>
      <section className="hero" style={{ background: 'transparent', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        <div className="container">
          <div className="hero-content" style={{ color: 'white' }}>
            <h1 style={{ color: 'white' }}>Delicious Campus Meals, <span>Delivered Fast.</span></h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Skip the lines and pre-order your favorite canteen meals from your phone. Fresh, hot, and ready when you are.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-primary">
                Order Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '6rem 2rem' }}>
        <div className="page-header" style={{ paddingTop: 0 }}>
          <h2 className="page-title">Why Choose Us?</h2>
          <p className="page-subtitle">We bring the best flavors to campus with an unmatched ordering experience.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(255, 94, 58, 0.1)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Utensils size={32} />
            </div>
            <h3>Premium Quality</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Our chefs use only the freshest ingredients to prepare mouth-watering meals daily.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(255, 94, 58, 0.1)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Clock size={32} />
            </div>
            <h3>Zero Wait Time</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Pre-order online and pick up your meal hot and ready exactly when you need it.</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(255, 94, 58, 0.1)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <Star size={32} />
            </div>
            <h3>Student Favorites</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>We constantly update our menu based on student feedback and cravings.</p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
