import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Database, ShieldAlert, ArrowLeft
} from 'lucide-react';
import clikzLogo from '../assets/clikz_logo.png';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        email: form.email,
        password: form.password
      });
      toast.success('Admin account created! You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedDemo() {
    if (!window.confirm('Are you sure you want to seed professional demo data? This will clear all existing invoices, clients, and services.')) {
      return;
    }

    setSeeding(true);
    try {
      const res = await api.post('/auth/seed-demo');
      toast.success(res.data?.message || 'Demo data seeded successfully!');
    } catch (err) {
      toast.error('Failed to seed demo data');
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ── Left panel ── */}
        <div style={styles.left}>
          <div style={styles.circle1} />
          <div style={styles.circle2} />
          <div style={styles.circle3} />

          <div style={styles.brandMark}>
            <div style={styles.logoContainer}>
              <img
                src={clikzLogo}
                alt="clikz_logo"
                style={styles.logoImg}
              />
            </div>
            <p style={styles.brandName}>CLIKZ</p>
            <p style={styles.brandSub}>Wedding Films</p>
          </div>

          <div style={styles.quote}>
            <div style={styles.quoteLine} />
            <p style={styles.quoteText}>
              "Create administrative credentials to secure your studio's billing dashboard and manage client portfolios."
            </p>
            <p style={styles.quoteAttr}>— System Administration</p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={styles.right}>
          <div style={styles.loginHead}>
            <button onClick={() => navigate('/login')} style={styles.backBtn}>
              <ArrowLeft size={14} /> Back to Sign In
            </button>
            <h1 style={styles.h1}>Create Admin Account</h1>
            <p style={styles.subtitle}>Setup secure logins for your billing dashboard</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="email">
                <Mail size={13} style={styles.labelIcon} />
                Admin Email Address
              </label>
              <div style={{
                ...styles.inputWrap,
                borderColor: focusedField === 'email' ? '#0d9488' : '#e2e8f0',
                boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(13,148,136,0.08)' : 'none',
              }}>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="name@clikzweddingfilms.com"
                  required
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="password">
                <Lock size={13} style={styles.labelIcon} />
                Password
              </label>
              <div style={{
                ...styles.inputWrap,
                borderColor: focusedField === 'password' ? '#0d9488' : '#e2e8f0',
                boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(13,148,136,0.08)' : 'none',
              }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  required
                  style={{ ...styles.input, paddingRight: 44 }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={styles.eyeBtn}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="confirmPassword">
                <Lock size={13} style={styles.labelIcon} />
                Confirm Password
              </label>
              <div style={{
                ...styles.inputWrap,
                borderColor: focusedField === 'confirmPassword' ? '#0d9488' : '#e2e8f0',
                boxShadow: focusedField === 'confirmPassword' ? '0 0 0 3px rgba(13,148,136,0.08)' : 'none',
              }}>
                <input
                  id="confirmPassword"
                  type={showPw ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Repeat your password"
                  required
                  style={styles.input}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading
                ? <><Loader2 size={16} style={styles.spin} /> Registering…</>
                : <><span>Register Admin Account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f0fdfa 100%)',
    padding: '1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: 900,
    minHeight: 580,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12), 0 8px 20px rgba(15, 23, 42, 0.06)',
    background: '#ffffff',
  },
  left: {
    width: '44%',
    background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0d9488 180%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '2.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: '50%',
    border: '45px solid rgba(13, 148, 136, 0.08)',
    pointerEvents: 'none',
  },
  circle2: {
    position: 'absolute', bottom: -100, left: -60,
    width: 220, height: 220, borderRadius: '50%',
    border: '35px solid rgba(13, 148, 136, 0.05)',
    pointerEvents: 'none',
  },
  circle3: {
    position: 'absolute', top: '40%', left: -40,
    width: 120, height: 120, borderRadius: '50%',
    background: 'rgba(13, 148, 136, 0.06)',
    pointerEvents: 'none',
  },
  brandMark: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    zIndex: 1,
    marginTop: '1rem',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    padding: 12,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'brightness(1.1)',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f8fafc',
    letterSpacing: '0.12em',
    margin: 0,
    marginTop: 4,
  },
  brandSub: {
    fontSize: 11,
    color: 'rgba(148,163,184,0.7)',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    margin: 0,
    fontWeight: 500,
  },
  quote: {
    position: 'relative',
    zIndex: 1,
    marginBottom: '1rem',
  },
  quoteLine: {
    width: 36,
    height: 3,
    background: 'linear-gradient(90deg, #0d9488, #14b8a6)',
    borderRadius: 2,
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: 'rgba(226,232,240,0.55)',
    fontStyle: 'italic',
    margin: 0,
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
  quoteAttr: {
    marginTop: 14,
    fontSize: 11,
    color: 'rgba(148,163,184,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    margin: '14px 0 0',
    fontWeight: 500,
  },
  right: {
    flex: 1,
    padding: '2.5rem 3.2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: '#ffffff',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12.5,
    color: '#64748b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontWeight: 500,
    marginBottom: 12,
    transition: 'color 0.15s ease',
  },
  loginHead: {
    marginBottom: '1.2rem',
  },
  h1: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748b',
    margin: 0,
    fontWeight: 400,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12.5,
    fontWeight: 600,
    color: '#334155',
    margin: 0,
    letterSpacing: '0.01em',
  },
  labelIcon: {
    color: '#94a3b8',
  },
  inputWrap: {
    position: 'relative',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    background: '#f8fafc',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontSize: 13.5,
    background: 'transparent',
    border: 'none',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 6,
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    boxShadow: '0 4px 16px rgba(13, 148, 136, 0.25)',
    transition: 'all 0.2s ease',
  },
  spin: {
    animation: 'spin 0.8s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    margin: '1.2rem 0 0.8rem',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
  },
  dividerLabel: {
    fontSize: 9.5,
    color: '#94a3b8',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  seedBtn: {
    width: '100%',
    padding: '11px',
    background: '#ffffff',
    color: '#0d9488',
    border: '1.5px solid #0d9488',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.05)',
  }
};
