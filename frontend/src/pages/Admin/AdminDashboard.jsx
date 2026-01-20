import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';
import '../Dashboard/Dashboard.css'; // Reuse the glass styles

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <div className="dashboard-container" style={{ display: 'flex' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'rgba(25, 25, 25, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100vh',
                position: 'sticky',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem'
            }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Admin<span style={{ color: '#007AFF' }}>.</span></h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start', color: 'white', background: 'rgba(255,255,255,0.1)' }}>Overview</button>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start', color: '#888' }}>Users</button>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start', color: '#888' }}>Mentors</button>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start', color: '#888' }}>Tests</button>
                </nav>

                <button onClick={onLogout} className="btn-ghost" style={{ justifyContent: 'flex-start', color: '#ff3b30', marginTop: 'auto' }}>
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 3rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Overview</h1>
                        <p style={{ color: '#888' }}>Welcome back, Admin</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%' }}></div>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Students</h3>
                        <p className="stat-value">1,240</p>
                        <div style={{ marginTop: '0.5rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                            <div style={{ width: '70%', height: '100%', background: '#007AFF', borderRadius: '2px' }}></div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>+15% this month</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Approvals</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                <span>New Mentor Apps</span>
                                <span style={{ background: '#ffcc00', color: 'black', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>3</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                <span>Flagged Posts</span>
                                <span style={{ background: '#ff3b30', color: 'white', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>1</span>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <h3>Tests Taken</h3>
                        <p className="stat-value">8,902</p>
                        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Daily Avg: 340</p>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(30, 30, 35, 0.6)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '2rem',
                    marginTop: '2rem'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Recent Activity</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: '#888' }}>User</th>
                                <th style={{ padding: '1rem', color: '#888' }}>Action</th>
                                <th style={{ padding: '1rem', color: '#888' }}>Time</th>
                                <th style={{ padding: '1rem', color: '#888' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>Sarah Miller</td>
                                <td style={{ padding: '1rem' }}>Completed Physics Test</td>
                                <td style={{ padding: '1rem' }}>2 min ago</td>
                                <td style={{ padding: '1rem' }}><span style={{ color: '#4cd964' }}>Success</span></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>John Doe</td>
                                <td style={{ padding: '1rem' }}>Registered</td>
                                <td style={{ padding: '1rem' }}>15 min ago</td>
                                <td style={{ padding: '1rem' }}><span style={{ color: '#007AFF' }}>New</span></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1rem' }}>Mike Ross</td>
                                <td style={{ padding: '1rem' }}>Failed Login</td>
                                <td style={{ padding: '1rem' }}>1 hour ago</td>
                                <td style={{ padding: '1rem' }}><span style={{ color: '#ff3b30' }}>Failed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};
