import React, { useState, useEffect, useRef } from 'react';

/* --------------------------------------------------------------------------
   1. DATABASE UTILITIES (IndexedDB for Large Files)
   -------------------------------------------------------------------------- */
const DB_CONFIG = { name: 'CertifyVaultDB', version: 1, store: 'certificates' };

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
    request.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(DB_CONFIG.store)) {
        e.target.result.createObjectStore(DB_CONFIG.store, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbAPI = {
  getAll: async () => {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(DB_CONFIG.store, 'readonly');
      const store = tx.objectStore(DB_CONFIG.store);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
    });
  },
  add: async (cert) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.store, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.store);
      const request = store.add(cert);
      request.onsuccess = () => resolve(cert);
      request.onerror = () => reject(request.error);
    });
  },
  delete: async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_CONFIG.store, 'readwrite');
      const store = tx.objectStore(DB_CONFIG.store);
      const request = store.delete(id);
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }
};

/* --------------------------------------------------------------------------
   2. ASSETS & CONFIGURATION
   -------------------------------------------------------------------------- */
const IMAGES = {
  authBg: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop", 
  heroOverlay: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", 
  feat1: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2632&auto=format&fit=crop", 
  feat2: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop", 
  feat3: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop", 
  person1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  person2: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  person3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
  texture: "https://www.transparenttextures.com/patterns/stardust.png", 
};

/* --------------------------------------------------------------------------
   3. SHARED COMPONENTS
   -------------------------------------------------------------------------- */
const AmbientBackground = () => (
  <div className="ambient-wrapper">
    <div className="noise-overlay" style={{backgroundImage: `url(${IMAGES.texture})`}}></div>
    <div className="orb orb-1"></div>
    <div className="orb orb-2"></div>
    <div className="orb orb-3"></div>
  </div>
);

const Navbar = ({ setView, activeView }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (viewName) => {
    setView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // FIX: Ensures scroll resets to top
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <div className="logo" onClick={() => handleNav('home')}>CERTIFY<span className="gold-dot">.</span></div>
      </div>
      <div className="nav-center">
        {['home', 'features', 'pricing', 'mission', 'contact'].map((link) => (
          <button 
            key={link} 
            className={`nav-link ${activeView === link ? 'active' : ''}`}
            onClick={() => handleNav(link)}
          >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="btn-glass" onClick={() => handleNav('auth')}>Log In</button>
      </div>
    </nav>
  );
};

const BackButton = ({ onClick }) => (
  <button onClick={() => { onClick(); window.scrollTo({top:0, behavior:'smooth'}); }} className="back-button fade-in-delay">
    <span className="arrow">←</span> <span className="text">Return Home</span>
  </button>
);

const Footer = () => (
  <footer>
    <div className="footer-grid">
      <div className="brand-col">
        <div className="logo small">CERTIFY<span className="gold-dot">.</span></div>
        <p>The definitive operating system for professional compliance and credential management.</p>
      </div>
      <div className="links-col">
        <h4>Platform</h4>
        <span>Features</span>
        <span>Security</span>
        <span>Enterprise</span>
        <span>Case Studies</span>
      </div>
      <div className="links-col">
        <h4>Company</h4>
        <span>Mission</span>
        <span>Careers</span>
        <span>Press</span>
        <span>Contact</span>
      </div>
      <div className="links-col">
        <h4>Legal</h4>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Cookie Settings</span>
        <span>Compliance</span>
      </div>
    </div>
    <div className="copyright">
      © 2025 CertifyTrack Global Inc. Crafted for Excellence in Silicon Valley.
    </div>
  </footer>
);

/* --------------------------------------------------------------------------
   4. SUB-PAGE COMPONENTS
   -------------------------------------------------------------------------- */

const FeaturesPage = ({ setView }) => (
  <div className="page-wrapper fade-in">
    <Navbar setView={setView} activeView="features" />
    <div className="page-container">
      <div className="header-actions">
        <BackButton onClick={() => setView('home')} />
      </div>
      
      <header className="page-header">
        <span className="subtitle">SYSTEM ARCHITECTURE</span>
        <h1 className="hero-title">Engineered for <span className="gradient-text">Perfection</span></h1>
        <p className="hero-desc">We combine military-grade encryption with intuitive design to create the ultimate vault for your professional assets.</p>
      </header>

      <section className="feature-showcase">
        <div className="feature-row">
          <div className="feature-text">
            <h3>01. Neural Synchronization</h3>
            <p>Our Chronos Engine™ doesn't just store dates; it predicts compliance risk. By analyzing your entire portfolio, we provide intelligent forecasting on when you need to renew, upgrade, or re-certify.</p>
            <ul className="gold-list">
              <li>Real-time expiration tracking with millisecond precision</li>
              <li>Multi-channel alerts (SMS, Email, Slack)</li>
              <li>Calendar API Integration</li>
            </ul>
          </div>
          <div className="feature-image parallax-card">
            <img src={IMAGES.feat1} alt="Sync Tech" />
            <div className="glass-overlay"></div>
          </div>
        </div>

        <div className="feature-row reverse">
          <div className="feature-text">
            <h3>02. The Zero-Knowledge Vault</h3>
            <p>Your career data is sensitive. That is why we employ AES-256 bit encryption at rest and TLS 1.3 in transit. We utilize Zero-Knowledge architecture, meaning not even our engineers can view your documents.</p>
            <ul className="gold-list">
              <li>End-to-end encryption for all file types</li>
              <li>SOC 2 Type II and GDPR Compliant</li>
              <li>Biometric authentication support</li>
            </ul>
          </div>
          <div className="feature-image parallax-card">
            <img src={IMAGES.feat2} alt="Security Tech" />
            <div className="glass-overlay"></div>
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-text">
            <h3>03. Global Verification Grid</h3>
            <p>Employers need proof, not promises. Our VerifyLink™ technology generates secure, time-limited URLs that allow third parties to validate your credentials instantly without requiring an account.</p>
            <ul className="gold-list">
              <li>One-click secure link generation</li>
              <li>Access logs and view tracking</li>
              <li>Watermarked document rendering</li>
            </ul>
          </div>
          <div className="feature-image parallax-card">
            <img src={IMAGES.feat3} alt="Network Tech" />
            <div className="glass-overlay"></div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="glass-card cta-card">
          <h2>Experience the Future Today</h2>
          <p>Join thousands of professionals who have upgraded their compliance stack.</p>
          <button className="btn-gold large" onClick={() => setView('auth')}>Access Dashboard</button>
        </div>
      </section>
      
      <Footer />
    </div>
  </div>
);

const PricingPage = ({ setView }) => (
  <div className="page-wrapper fade-in">
    <Navbar setView={setView} activeView="pricing" />
    <div className="page-container">
      <div className="header-actions">
        <BackButton onClick={() => setView('home')} />
      </div>

      <header className="page-header">
        <span className="subtitle">INVESTMENT TIERS</span>
        <h1 className="hero-title">Select Your <span className="gradient-text">Plan</span></h1>
        <p className="hero-desc">Transparent pricing for professionals who value their career capital. No hidden fees. Cancel anytime.</p>
      </header>

      <div className="pricing-grid">
        <div className="glass-card price-card">
          <div className="card-header">
            <h3>Starter</h3>
            <div className="price">$0<span>/mo</span></div>
            <p className="desc">Essential tracking for early careers.</p>
          </div>
          <div className="divider"></div>
          <ul className="feature-list">
            <li>Up to 5 Certificates</li>
            <li>Basic Email Alerts</li>
            <li>Standard Encryption</li>
            <li>Mobile App Access</li>
            <li>Community Support</li>
          </ul>
          <button className="btn-outline full" onClick={() => setView('auth')}>Get Started</button>
        </div>

        <div className="glass-card price-card featured">
          <div className="best-badge">RECOMMENDED</div>
          <div className="card-header">
            <h3>Professional</h3>
            <div className="price">$15<span>/mo</span></div>
            <p className="desc">Complete automation for experts.</p>
          </div>
          <div className="divider"></div>
          <ul className="feature-list">
            <li><strong>Unlimited Vault Storage</strong></li>
            <li>SMS & Push Notifications</li>
            <li>Verified Sharing Links</li>
            <li>Priority 24/7 Support</li>
            <li>File Upload & OCR Scanning</li>
            <li>Audit History</li>
          </ul>
          <button className="btn-gold full" onClick={() => setView('auth')}>Start Free Trial</button>
        </div>

        <div className="glass-card price-card">
          <div className="card-header">
            <h3>Enterprise</h3>
            <div className="price">Custom</div>
            <p className="desc">Centralized control for teams.</p>
          </div>
          <div className="divider"></div>
          <ul className="feature-list">
            <li>Team Management Dashboard</li>
            <li>SSO (Okta, Azure AD)</li>
            <li>API Access</li>
            <li>Dedicated Account Manager</li>
            <li>Custom Data Retention</li>
            <li>SLA Guarantees</li>
          </ul>
          <button className="btn-outline full" onClick={() => setView('contact')}>Contact Sales</button>
        </div>
      </div>

      <section className="faq-section">
        <h2 className="center-title">Common Questions</h2>
        <div className="faq-grid">
           <div className="faq-item">
              <h4>Can I switch plans later?</h4>
              <p>Yes, you can upgrade or downgrade your account at any time from your dashboard settings.</p>
           </div>
           <div className="faq-item">
              <h4>Is there a bulk discount?</h4>
              <p>We offer discounts for teams larger than 10 members. Contact our sales team for a custom quote.</p>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

const MissionPage = ({ setView }) => (
  <div className="page-wrapper fade-in">
    <Navbar setView={setView} activeView="mission" />
    <div className="page-container">
      <div className="header-actions">
        <BackButton onClick={() => setView('home')} />
      </div>

      <header className="page-header">
        <span className="subtitle">OUR ETHOS</span>
        <h1 className="hero-title">The Pursuit of <span className="gradient-text">Excellence</span></h1>
      </header>

      <section className="mission-content">
        <div className="glass-card text-block">
            <h2 className="serif">The Compliance Gap</h2>
            <p className="lead-text">
                In 2023, the global workforce lost an estimated <strong>$4.5 billion</strong> in potential revenue due to lapsed certifications. This isn't a skills gap; it's an organization gap.
            </p>
            <p>
                CertifyTrack was born from a simple premise: High-performers shouldn't be held back by administrative paperwork. We gathered a team of ex-FAANG engineers and Fortune 500 HR directors to build a system that acts as an intelligent guardian for your credentials.
            </p>
            <p>
                Today, we are trusted by over 50,000 professionals across engineering, healthcare, and aviation industries to keep their licenses active and their careers moving forward. We believe that compliance should be invisible, automated, and flawless.
            </p>
        </div>
      </section>

      <div className="stats-row">
         <div className="stat-box"><h1>50k+</h1><span>Active Users</span></div>
         <div className="stat-box"><h1>140+</h1><span>Countries</span></div>
         <div className="stat-box"><h1>99.9%</h1><span>Platform Uptime</span></div>
         <div className="stat-box"><h1>$2B+</h1><span>Career Value Secured</span></div>
      </div>
      <Footer />
    </div>
  </div>
);

const ContactPage = ({ setView }) => (
  <div className="page-wrapper fade-in">
    <Navbar setView={setView} activeView="contact" />
    <div className="page-container">
      <div className="header-actions">
        <BackButton onClick={() => setView('home')} />
      </div>

      <header className="page-header">
        <span className="subtitle">CONCIERGE SERVICE</span>
        <h1 className="hero-title">Get in <span className="gradient-text">Touch</span></h1>
        <p className="hero-desc">Our dedicated support team is ready to assist you with any inquiries.</p>
      </header>

      <div className="contact-layout">
        <div className="contact-info">
           <div className="info-block">
               <h3>Global Headquarters</h3>
               <p>100 Innovation Drive<br/>Silicon Valley, CA 94025<br/>United States</p>
           </div>
           <div className="info-block">
               <h3>Direct Lines</h3>
               <p>General: hello@certifytrack.com</p>
               <p>Support: help@certifytrack.com</p>
               <p>Sales: +1 (555) 123-4567</p>
           </div>
           <div className="info-block">
               <h3>Hours of Operation</h3>
               <p>Mon - Fri: 8:00 AM - 8:00 PM PST</p>
               <p>Sat - Sun: 10:00 AM - 4:00 PM PST</p>
           </div>
        </div>
        
        <form className="glass-card contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="John Doe" className="input-field" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input placeholder="john@company.com" className="input-field" />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <select className="input-field">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing Question</option>
                <option>Enterprise Sales</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="How can we help you today?" rows="5" className="input-field"></textarea>
          </div>
          <button className="btn-gold full">Send Message</button>
        </form>
      </div>
      <Footer />
    </div>
  </div>
);

/* --------------------------------------------------------------------------
   5. LANDING PAGE (MAIN)
   -------------------------------------------------------------------------- */

const LandingPage = ({ setView }) => (
  <div className="page-wrapper fade-in">
    <Navbar setView={setView} activeView="home" />
    
    <section className="hero-section">
      <div className="hero-content">
        <div className="pill">VERSION 3.0 LIVE</div>
        <h1 className="main-title">Compliance,<br /><span className="gradient-text">Automated.</span></h1>
        <p className="sub-title">The world's most elegant solution for certification tracking. Never let a hard-earned credential expire in the dark again.</p>
        <div className="hero-actions">
          <button className="btn-gold large" onClick={() => setView('auth')}>Secure Your Vault</button>
          <button className="btn-glass large" onClick={() => setView('features')}>Explore Features</button>
        </div>
      </div>
      
      <div className="hero-visuals">
        <div className="glass-card float-card card-1">
          <div className="dot green"></div>
          <span>AWS Solutions Architect</span>
          <span className="status">Active</span>
        </div>
        <div className="glass-card float-card card-2">
          <div className="dot gold"></div>
          <span>PMP License</span>
          <span className="status">Expiring</span>
        </div>
        <div className="glass-card float-card card-3">
          <div className="dot red"></div>
          <span>Cisco CCNA</span>
          <span className="status">Expired</span>
        </div>
      </div>
    </section>

    <div className="trust-strip">
      <p>TRUSTED BY VISIONARIES AT</p>
      <div className="logos">
        <span>MICROSOFT</span><span>•</span>
        <span>GOOGLE</span><span>•</span>
        <span>TESLA</span><span>•</span>
        <span>SPACEX</span><span>•</span>
        <span>NVIDIA</span>
      </div>
    </div>

    <section className="section-padding">
      <div className="split-layout">
        <div className="txt">
          <span className="subtitle">THE PROBLEM</span>
          <h2>The High Cost of Chaos</h2>
          <p>In the noise of modern professional life, it is easy to miss a renewal date. Spreadsheets are static. Calendars are cluttered. You need a dynamic guardian for your career assets.</p>
          <p>Losing a certification means more than just a fee; it means retraining, re-testing, and lost income. It is a risk you cannot afford.</p>
        </div>
        <div className="visual">
           <img src={IMAGES.feat3} className="rounded-img hover-scale" alt="Chaos" />
        </div>
      </div>
    </section>

    <section className="section-padding dark-bg">
      <h2 className="center-title">The Intelligent Ecosystem</h2>
      <div className="cards-row">
        <div className="glass-card hover-glow">
          <div className="icon">01</div>
          <h3>Auto-Discovery</h3>
          <p>Smart ingestion scans your documents and automatically categorizes certificates.</p>
        </div>
        <div className="glass-card hover-glow">
          <div className="icon">02</div>
          <h3>Smart Alerts</h3>
          <p>Multi-channel notifications ensure you are aware of deadlines months in advance.</p>
        </div>
        <div className="glass-card hover-glow">
          <div className="icon">03</div>
          <h3>Instant Verify</h3>
          <p>Generate secure, one-time links for recruiters to verify your status instantly.</p>
        </div>
      </div>
    </section>

    <section className="section-padding">
      <h2 className="center-title">Endorsed by the <span className="gradient-text">Elite</span></h2>
      <div className="cards-row">
        <div className="glass-card testimonial">
          <div className="quote-mark">"</div>
          <p>"The only reason I kept my medical license active during my residency move. It is absolutely indispensable for any specialist."</p>
          <div className="user">
            <img src={IMAGES.person1} alt="User" />
            <div><h5>Dr. Sarah Jenkins</h5><span>Chief Surgeon</span></div>
          </div>
        </div>
        <div className="glass-card testimonial">
          <div className="quote-mark">"</div>
          <p>"The interface is stunning. It feels like using a high-end fintech app, but for my career assets. Gold standard UX."</p>
          <div className="user">
            <img src={IMAGES.person2} alt="User" />
            <div><h5>David Chen</h5><span>Senior Architect</span></div>
          </div>
        </div>
        <div className="glass-card testimonial">
          <div className="quote-mark">"</div>
          <p>"We deployed CertifyTrack to our engineering team. Compliance incidents dropped to zero within the first quarter."</p>
          <div className="user">
            <img src={IMAGES.person3} alt="User" />
            <div><h5>Elena Rodriguez</h5><span>VP Engineering</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding dark-bg">
        <h2 className="center-title">Frequently Asked Questions</h2>
        <div className="faq-layout">
           <div className="faq-item">
              <h4>Is my data encrypted?</h4>
              <p>Yes, we use AES-256 encryption for all documents and data stored in our vault.</p>
           </div>
           <div className="faq-item">
              <h4>Can I export my data?</h4>
              <p>Absolutely. You can download your entire portfolio as a PDF or CSV dossier at any time.</p>
           </div>
           <div className="faq-item">
              <h4>Do you support teams?</h4>
              <p>Yes, our Enterprise plan offers centralized dashboards for HR and Team Leaders.</p>
           </div>
           <div className="faq-item">
              <h4>Is there a mobile app?</h4>
              <p>CertifyTrack is a Progressive Web App (PWA) that works flawlessly on iOS and Android.</p>
           </div>
        </div>
    </section>

    <section className="big-cta">
      <h2>Ready to Secure Your Career?</h2>
      <p>Join the top 1% of professionals who use CertifyTrack.</p>
      <button className="btn-gold large" onClick={() => setView('auth')}>Create Your Vault</button>
    </section>

    <Footer />
  </div>
);

/* --------------------------------------------------------------------------
   6. FUNCTIONAL COMPONENTS (AUTH & DASHBOARD - UPDATED DB)
   -------------------------------------------------------------------------- */

const AuthPage = ({ onLogin, onBack }) => (
  <div className="auth-wrapper fade-in">
    <div className="auth-container glass-card">
      <div className="auth-header">
        <div className="logo large">CERTIFY<span className="gold-dot">.</span></div>
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access the vault.</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div className="form-group">
            <input type="email" placeholder="Email Address" className="input-field" required />
        </div>
        <div className="form-group">
            <input type="password" placeholder="Password" className="input-field" required />
        </div>
        <button className="btn-gold full">Secure Login</button>
      </form>
      <div className="auth-footer">
         <span>Forgot Password?</span>
         <button className="btn-text" onClick={onBack}>← Return Home</button>
      </div>
    </div>
  </div>
);

const Dashboard = ({ onBack }) => {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState({ name: "", issuer: "", expiryDate: "", image: null });
  const fileInputRef = useRef(null);

  // Load from IndexedDB on Mount
  useEffect(() => {
    dbAPI.getAll().then(setCertificates).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // LIMIT INCREASED TO 100MB
      if (file.size > 100 * 1024 * 1024) { 
        alert("File too large! Please choose an image under 100MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.expiryDate) return alert("Please fill in details");
    
    const newCert = { ...form, id: Date.now() };
    
    try {
      await dbAPI.add(newCert); // Save to IndexedDB
      setCertificates(prev => [...prev, newCert]); // Update State
      setForm({ name: "", issuer: "", expiryDate: "", image: null });
      if(fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      alert("Failed to save certificate. Database error.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dbAPI.delete(id); // Delete from IndexedDB
      setCertificates(certificates.filter((cert) => cert.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };
  
  const getStatus = (expiryDate) => {
    const diffDays = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: "EXPIRED", color: "#FF3B3B" };
    if (diffDays < 30) return { text: "EXPIRING", color: "#FFD700" };
    return { text: "ACTIVE", color: "#00E676" };
  };

  const expiredCount = certificates.filter(c => getStatus(c.expiryDate).text === "EXPIRED").length;

  return (
    <div className="dashboard-layout fade-in">
      <nav className="glass-nav">
        <div className="nav-left">
           <div className="logo">CERTIFY<span className="gold-dot">.</span></div>
        </div>
        <div className="user-area">
          <div className="user-profile">
             <img src={IMAGES.person2} alt="Profile" />
             <div className="info">
               <span className="name">Alex Mercer</span>
               <span className="role">PRO MEMBER</span>
             </div>
          </div>
          <button onClick={onBack} className="btn-glass small">Sign Out</button>
        </div>
      </nav>

      <div className="dash-content">
        <div className="stats-strip">
          <div className="stat-card glass-card"><h3>{certificates.length}</h3><span>Total Assets</span></div>
          <div className="stat-card glass-card"><h3 style={{color:'#00E676'}}>{certificates.length - expiredCount}</h3><span>Active Licenses</span></div>
          <div className="stat-card glass-card"><h3 style={{color:'#FF3B3B'}}>{expiredCount}</h3><span>Critical / Expired</span></div>
        </div>

        <div className="dash-grid">
          <div className="glass-card form-card">
            <div className="card-title">
               <h3>Ingest Credential</h3>
               <p>Add a new certificate to your secure vault.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                 <label>Credential Name</label>
                 <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Google Data Analytics" required />
              </div>
              <div className="form-group">
                 <label>Issuing Authority</label>
                 <input name="issuer" value={form.issuer} onChange={handleChange} className="input-field" placeholder="e.g. Google" required />
              </div>
              <div className="form-group">
                 <label>Expiration Date</label>
                 <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="input-field" required />
              </div>
              <div className="form-group">
                 <label>Certificate Image (Max 100MB)</label>
                 <div className="file-area">
                    <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="file-input" />
                    {form.image ? 
                      <div className="preview"><img src={form.image} alt="Preview" /></div> :
                      <div className="upload-placeholder"><span>+ Upload Image</span></div>
                    }
                 </div>
              </div>
              <button className="btn-gold full">Secure to Vault</button>
            </form>
          </div>

          <div className="glass-card list-card">
            <div className="list-header"><h3>My Vault</h3><span className="badge">{certificates.length} Items</span></div>
            {certificates.length === 0 ? <div className="empty-state">Vault Empty. Start adding credentials.</div> : (
              <div className="cert-list">
                {certificates.map((cert) => {
                  const status = getStatus(cert.expiryDate);
                  return (
                    <div key={cert.id} className="cert-item">
                      <div className="thumb">
                         {cert.image ? <img src={cert.image} alt="doc" /> : <span className="doc-icon">DOC</span>}
                      </div>
                      <div className="info">
                         <h4>{cert.name}</h4>
                         <p>{cert.issuer}</p>
                      </div>
                      <div className="meta">
                        <span className="tag" style={{borderColor: status.color, color: status.color}}>{status.text}</span>
                        <span className="date">{cert.expiryDate}</span>
                        <button onClick={() => handleDelete(cert.id)} className="del-btn" title="Delete">×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   7. MAIN APP CONTROLLER & CSS
   -------------------------------------------------------------------------- */

const App = () => {
  const [view, setView] = useState('home');

  return (
    <div className="app-root">
      <AmbientBackground />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap');

        :root {
          --gold: #D4AF37;
          --gold-light: #F8E7B0;
          --gold-dim: rgba(212, 175, 55, 0.15);
          --text: #ffffff;
          --text-dim: #A1A1AA;
          --glass: rgba(20, 20, 20, 0.6);
          --glass-border: rgba(255, 255, 255, 0.08);
          --blur: 25px;
          --bg-dark: #050505;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--bg-dark); color: var(--text); font-family: 'Inter', sans-serif; overflow-x: hidden; line-height: 1.6; }
        h1, h2, h3, h4, .logo { font-family: 'Playfair Display', serif; }
        
        /* --- AMBIENT BACKGROUND --- */
        .ambient-wrapper { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; background: #020202; }
        .noise-overlay { position: absolute; top:0; left:0; width:100%; height:100%; opacity: 0.04; }
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.5; animation: float 15s infinite ease-in-out; }
        .orb-1 { width: 800px; height: 800px; background: radial-gradient(circle, #2a1f02 0%, transparent 70%); top: -200px; left: -200px; }
        .orb-2 { width: 600px; height: 600px; background: radial-gradient(circle, #0f172a 0%, transparent 70%); bottom: -100px; right: -100px; animation-delay: -5s; }
        .orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, #1a1500 0%, transparent 70%); top: 40%; left: 40%; animation-duration: 25s; opacity: 0.3; }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(40px, -40px); } }

        /* --- TYPOGRAPHY & UTILS --- */
        .gradient-text { background: linear-gradient(135deg, #fff 40%, var(--gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gold-dot { color: var(--gold); }
        .subtitle { color: var(--gold); font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 15px; }
        .center-title { text-align: center; font-size: 3rem; margin-bottom: 60px; }
        .hero-title { font-size: 4rem; margin-bottom: 20px; line-height: 1.1; }
        .hero-desc { font-size: 1.2rem; color: var(--text-dim); max-width: 600px; margin: 0 auto; font-weight: 300; }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .fade-in-delay { animation: fadeIn 0.8s ease-out 0.2s forwards; opacity: 0; animation-fill-mode: forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* --- UI COMPONENTS --- */
        .glass-card { background: var(--glass); backdrop-filter: blur(var(--blur)); border: 1px solid var(--glass-border); border-radius: 12px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2); transition: 0.4s; }
        .hover-glow:hover { border-color: var(--gold); box-shadow: 0 0 40px rgba(212, 175, 55, 0.1); transform: translateY(-5px); }
        
        .btn-gold { background: linear-gradient(135deg, var(--gold), #B59020); color: black; border: none; padding: 14px 30px; font-weight: 600; cursor: pointer; border-radius: 2px; transition: 0.3s; letter-spacing: 0.5px; }
        .btn-gold:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2); }
        
        .btn-glass { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: white; padding: 12px 28px; cursor: pointer; transition: 0.3s; }
        .btn-glass:hover { background: rgba(255,255,255,0.1); border-color: white; }
        
        .btn-outline { background: transparent; border: 1px solid var(--glass-border); color: white; padding: 14px 30px; cursor: pointer; transition: 0.3s; }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
        
        .back-button { display: inline-flex; align-items: center; gap: 8px; background: none; border: 1px solid var(--glass-border); color: var(--text-dim); padding: 8px 16px; border-radius: 50px; cursor: pointer; transition: 0.3s; margin-bottom: 30px; }
        .back-button:hover { border-color: var(--gold); color: #fff; padding-right: 20px; }
        .back-button .arrow { transition: 0.3s; }
        .back-button:hover .arrow { transform: translateX(-3px); }

        .full { width: 100%; }
        .large { padding: 18px 50px; font-size: 1rem; letter-spacing: 1px; }

        /* --- NAVBAR --- */
        .navbar { position: fixed; top: 0; width: 100%; padding: 25px 5%; display: flex; justify-content: space-between; align-items: center; z-index: 1000; transition: 0.4s; }
        .navbar.scrolled { background: rgba(2,2,2,0.85); backdrop-filter: blur(20px); padding: 15px 5%; border-bottom: 1px solid var(--glass-border); }
        .logo { font-size: 1.5rem; font-weight: 700; letter-spacing: 2px; cursor: pointer; color: white; }
        .nav-links { display: flex; gap: 40px; }
        .nav-center { display: flex; gap: 60px; } /* INCREASED GAP AS REQUESTED */
        .nav-link { background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 1rem; letter-spacing: 1px; transition: 0.3s; font-family: 'Inter'; position: relative; }
        .nav-link:hover, .nav-link.active { color: white; }
        .nav-link.active::after { content:''; position: absolute; bottom: -5px; left: 0; width: 100%; height: 1px; background: var(--gold); }

        /* --- HERO --- */
        .hero-section { min-height: 100vh; display: flex; align-items: center; padding: 0 10%; position: relative; margin-top: -80px; }
        .hero-content { max-width: 700px; position: relative; z-index: 2; }
        .main-title { font-size: 5.5rem; line-height: 1.05; margin-bottom: 25px; }
        .sub-title { font-size: 1.25rem; color: var(--text-dim); margin-bottom: 50px; font-weight: 300; line-height: 1.6; }
        .pill { border: 1px solid var(--gold); color: var(--gold); display: inline-block; padding: 6px 16px; font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 30px; border-radius: 50px; background: rgba(212,175,55,0.05); }
        .hero-actions { display: flex; gap: 20px; }
        
        .hero-visuals { position: absolute; right: 5%; top: 25%; z-index: 1; }
        .float-card { padding: 18px 25px; display: flex; align-items: center; gap: 15px; position: absolute; animation: floatCard 6s infinite ease-in-out; white-space: nowrap; }
        .card-1 { top: 0; right: 50px; } .card-2 { top: 160px; right: 0; animation-delay: 2s; } .card-3 { top: 320px; right: 80px; animation-delay: 4s; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .green { background: #00E676; box-shadow: 0 0 10px #00E676; } .gold { background: var(--gold); box-shadow: 0 0 10px var(--gold); } .red { background: #FF3B3B; box-shadow: 0 0 10px #FF3B3B; }
        @keyframes floatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

        /* --- SECTIONS --- */
        .page-container { padding: 140px 10% 80px; max-width: 1400px; margin: 0 auto; }
        .page-header { text-align: center; margin-bottom: 100px; }
        .section-padding { padding: 120px 10%; }
        .dark-bg { background: rgba(0,0,0,0.3); border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); }
        
        .trust-strip { text-align: center; padding: 50px; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); background: rgba(0,0,0,0.2); }
        .trust-strip p { font-size: 0.7rem; letter-spacing: 3px; color: var(--text-dim); margin-bottom: 20px; }
        .logos { display: flex; justify-content: center; gap: 60px; color: #666; font-family: 'Playfair Display'; font-style: italic; font-size: 1.2rem; }
        
        .split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .rounded-img { width: 100%; border-radius: 12px; opacity: 0.9; transition: 0.5s; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .hover-scale:hover { transform: scale(1.02); opacity: 1; }
        .cards-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .glass-card { padding: 40px; }
        .icon { font-size: 2.5rem; color: var(--gold); font-family: 'Playfair Display'; margin-bottom: 25px; opacity: 0.8; }

        /* --- FEATURE PAGE --- */
        .feature-showcase { display: flex; flex-direction: column; gap: 120px; }
        .feature-row { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .feature-row.reverse { direction: rtl; } .feature-row.reverse .feature-text { direction: ltr; }
        .feature-text h3 { font-size: 2.2rem; margin-bottom: 20px; color: white; }
        .feature-text p { color: var(--text-dim); margin-bottom: 30px; font-size: 1.1rem; line-height: 1.8; }
        .feature-image { position: relative; height: 450px; border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .feature-image img { width: 100%; height: 100%; object-fit: cover; transition: 10s ease; }
        .feature-image:hover img { transform: scale(1.1); }
        .glass-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%); }
        .gold-list { list-style: none; } .gold-list li { margin-bottom: 12px; display: flex; align-items: center; gap: 15px; color: #ddd; font-size: 1rem; }
        .gold-list li::before { content: '✦'; color: var(--gold); font-size: 1rem; }
        .cta-section { margin-top: 100px; text-align: center; }
        .cta-card { padding: 80px; display: flex; flex-direction: column; align-items: center; gap: 20px; background: linear-gradient(135deg, var(--glass) 0%, rgba(212,175,55,0.05) 100%); }

        /* --- PRICING --- */
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; align-items: start; }
        .price-card { text-align: center; position: relative; transition: 0.4s; padding: 50px 30px; }
        .price-card.featured { border: 1px solid var(--gold); background: linear-gradient(180deg, rgba(212, 175, 55, 0.08), var(--glass)); transform: scale(1.05); z-index: 2; }
        .price { font-size: 3.5rem; font-family: 'Playfair Display'; margin: 25px 0; color: #fff; }
        .price span { font-size: 1rem; font-family: 'Inter'; color: var(--text-dim); }
        .best-badge { position: absolute; top: -1px; left: 0; width: 100%; background: var(--gold); color: black; font-size: 0.7rem; font-weight: bold; padding: 6px; letter-spacing: 1px; }
        .divider { height: 1px; background: var(--glass-border); margin: 30px 0; }
        .feature-list { list-style: none; text-align: left; padding: 0 10px; }
        .feature-list li { margin-bottom: 15px; color: #ccc; font-size: 0.95rem; }

        /* --- CONTACT --- */
        .contact-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px; }
        .info-block { margin-bottom: 40px; }
        .info-block h3 { color: var(--gold); margin-bottom: 15px; font-size: 1.2rem; }
        .info-block p { color: var(--text-dim); margin-bottom: 8px; }
        .contact-form { padding: 50px; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; color: #888; margin-bottom: 8px; font-size: 0.85rem; }
        .input-field { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); padding: 16px; color: white; font-family: 'Inter'; transition: 0.3s; font-size: 1rem; }
        .input-field:focus { border-color: var(--gold); background: rgba(0,0,0,0.5); }

        /* --- TESTIMONIALS --- */
        .testimonial .user { display: flex; align-items: center; gap: 15px; margin-top: 25px; }
        .testimonial img { width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 1px solid var(--gold); }
        .testimonial h5 { font-size: 1rem; color: white; margin-bottom: 3px; }
        .testimonial span { font-size: 0.8rem; color: var(--gold); }
        .quote-mark { font-size: 4rem; color: var(--glass-border); line-height: 0; margin-bottom: 20px; font-family: serif; }
        .big-cta { padding: 150px 20px; text-align: center; background: radial-gradient(circle at center, rgba(212, 175, 55, 0.08), transparent 60%); }
        .big-cta h2 { font-size: 4rem; margin-bottom: 40px; }
        
        /* --- MISSION --- */
        .mission-content { max-width: 900px; margin: 0 auto 80px; }
        .text-block { padding: 60px; text-align: center; }
        .text-block h2 { font-size: 2.5rem; margin-bottom: 30px; color: var(--gold); }
        .lead-text { font-size: 1.4rem; line-height: 1.6; margin-bottom: 30px; color: #fff; }
        .text-block p { color: var(--text-dim); font-size: 1.1rem; margin-bottom: 20px; line-height: 1.8; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 60px; border-top: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); text-align: center; }
        .stat-box h1 { font-size: 3.5rem; color: var(--gold); margin-bottom: 10px; }
        .stat-box span { font-size: 0.8rem; letter-spacing: 2px; color: var(--text-dim); text-transform: uppercase; }

        /* --- FAQ --- */
        .faq-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; max-width: 1000px; margin: 0 auto; }
        .faq-item h4 { color: var(--gold); margin-bottom: 10px; font-size: 1.2rem; }

        /* --- FOOTER --- */
        footer { border-top: 1px solid var(--glass-border); padding: 100px 10% 40px; background: #010101; margin-top: 50px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 50px; margin-bottom: 80px; }
        .brand-col p { color: var(--text-dim); margin-top: 20px; max-width: 250px; font-size: 0.9rem; line-height: 1.6; }
        .links-col h4 { color: #fff; margin-bottom: 25px; font-size: 1.1rem; }
        .links-col span { display: block; color: var(--text-dim); margin-bottom: 12px; cursor: pointer; transition: 0.3s; font-size: 0.95rem; }
        .links-col span:hover { color: var(--gold); transform: translateX(5px); display: inline-block; }
        .copyright { text-align: center; font-size: 0.85rem; color: #444; border-top: 1px solid #111; padding-top: 40px; }

        /* --- AUTH --- */
        .auth-wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }
        .auth-container { width: 450px; padding: 60px; text-align: center; position: relative; z-index: 2; border-top: 3px solid var(--gold); }
        .auth-header { margin-bottom: 40px; }
        .auth-footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #666; }
        .btn-text { background: none; border: none; color: #666; cursor: pointer; transition: 0.3s; }
        .btn-text:hover { color: var(--gold); }

        /* --- DASHBOARD --- */
        .dashboard-layout { min-height: 100vh; padding-top: 90px; }
        .glass-nav { position: fixed; top: 0; width: 100%; padding: 15px 5%; background: rgba(5,5,5,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; z-index: 100; }
        .user-area { display: flex; align-items: center; gap: 25px; }
        .user-profile { display: flex; align-items: center; gap: 12px; }
        .user-profile img { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--gold); }
        .user-profile .info { text-align: right; line-height: 1.2; }
        .user-profile .name { display: block; font-size: 0.95rem; font-weight: 600; }
        .user-profile .role { font-size: 0.7rem; color: var(--gold); letter-spacing: 1px; }

        .dash-content { padding: 40px 5%; max-width: 1500px; margin: 0 auto; }
        .stats-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 50px; }
        .stat-card { text-align: center; padding: 40px; display: flex; flex-direction: column; justify-content: center; }
        .stat-card h3 { font-size: 3rem; margin-bottom: 5px; line-height: 1; }
        .stat-card span { color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
        
        .dash-grid { display: grid; grid-template-columns: 400px 1fr; gap: 40px; }
        .card-title { margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid var(--glass-border); }
        .card-title p { color: var(--text-dim); font-size: 0.9rem; margin-top: 5px; }
        
        .file-area { margin: 15px 0 25px; }
        .file-input { display: block; width: 100%; font-size: 0.9rem; color: #888; }
        .upload-placeholder { height: 160px; border: 1px dashed var(--glass-border); display: flex; align-items: center; justify-content: center; color: #555; font-size: 0.9rem; background: rgba(0,0,0,0.2); transition: 0.3s; }
        .upload-placeholder:hover { border-color: var(--gold); color: var(--gold); cursor: pointer; }
        .preview { height: 160px; background: #000; border: 1px solid var(--glass-border); overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid var(--glass-border); }
        .badge { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; }
        
        .cert-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
        .cert-item { background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border); padding: 20px; display: flex; gap: 20px; align-items: center; transition: 0.3s; border-radius: 8px; }
        .cert-item:hover { border-color: var(--gold); transform: translateY(-2px); }
        .thumb { width: 60px; height: 60px; background: #151515; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #555; overflow: hidden; border-radius: 6px; border: 1px solid var(--glass-border); }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .doc-icon { font-weight: bold; letter-spacing: 1px; }
        
        .meta { margin-left: auto; text-align: right; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
        .tag { font-size: 0.65rem; border: 1px solid; padding: 3px 8px; border-radius: 4px; font-weight: 600; letter-spacing: 0.5px; }
        .date { font-size: 0.75rem; color: #666; font-family: 'Inter'; }
        .del-btn { background: none; border: none; color: #444; font-size: 1.4rem; cursor: pointer; line-height: 0.5; padding: 5px; margin-top: 5px; transition: 0.2s; }
        .del-btn:hover { color: #FF3B3B; transform: scale(1.2); }
        .empty-state { text-align: center; color: #555; padding: 60px; border: 1px dashed var(--glass-border); border-radius: 12px; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .main-title { font-size: 3.5rem; }
          .hero-visuals { display: none; }
          .split-layout, .pricing-grid, .cards-row, .stats-row, .dash-grid, .contact-layout, .hero-section { grid-template-columns: 1fr; flex-direction: column; }
          .nav-center { display: none; }
          .feature-row { grid-template-columns: 1fr; gap: 40px; }
          .feature-row.reverse { direction: ltr; }
          .feature-image { height: 300px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {view === 'home' && <LandingPage setView={setView} />}
      {view === 'features' && <FeaturesPage setView={setView} />}
      {view === 'pricing' && <PricingPage setView={setView} />}
      {view === 'mission' && <MissionPage setView={setView} />}
      {view === 'contact' && <ContactPage setView={setView} />}
      {view === 'auth' && <AuthPage onLogin={() => setView('dashboard')} onBack={() => setView('home')} />}
      {view === 'dashboard' && <Dashboard onBack={() => setView('home')} />}
    </di
  );
};

export default App;
