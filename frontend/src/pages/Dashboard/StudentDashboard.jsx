import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}!</h1>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Upcoming Tests</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ fontWeight: '600' }}>Physics Midterm</p>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Tomorrow, 10:00 AM</p>
                                </div>
                                <span style={{ background: '#ffcc00', color: 'black', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>HIGH PRIORITY</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ fontWeight: '600' }}>Chemistry Final</p>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Fri, Dec 15</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>My Progress</h3>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#007AFF" strokeWidth="10" strokeDasharray="314" strokeDashoffset="75" transform="rotate(-90 60 60)" />
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>76%</span>
                                </div>
                            </div>
                            <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.9rem' }}>Overall Average</p>
                        </div>
                    </div>

                    <div className="stat-card" style={{ gridColumn: 'span 1' }}>
                        <h3>Recommended Mentors</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9966, #FF5E62)' }}></div>
                                <div>
                                    <p style={{ fontWeight: '600' }}>Sarah J.</p>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Physics Expert</p>
                                </div>
                                <button style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px' }}>Connect</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #56CCF2, #2F80ED)' }}></div>
                                <div>
                                    <p style={{ fontWeight: '600' }}>Dr. Alan</p>
                                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Math Tutor</p>
                                </div>
                                <button style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px' }}>Connect</button>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Quick Actions</h2>
                <div className="quick-actions">
                    <button className="btn-action" onClick={() => navigate('/tests')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Take Test
                    </button>
                    <button className="btn-action" onClick={() => navigate('/mentors')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Find Mentor
                    </button>
                    <button className="btn-action" onClick={() => navigate('/details')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Analytics
                    </button>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
