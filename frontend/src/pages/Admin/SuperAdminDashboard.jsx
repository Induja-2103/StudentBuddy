import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../../store/slices/authSlice';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem', height: '100vh', background: '#000', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    SuperAdmin <span style={{ color: '#007AFF' }}>Control Panel</span>
                </h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>{user?.email}</span>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setShowCreateAdmin(!showCreateAdmin)}
                    className="btn btn-primary"
                    style={{ background: '#007AFF', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}
                >
                    {showCreateAdmin ? 'Cancel' : '+ Create New Admin'}
                </button>
            </div>

            {showCreateAdmin && (
                <div style={{ marginBottom: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Create New Administrator</h3>
                    <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Full Name</label>
                            <input type="text" name="full_name" value={adminForm.full_name} onChange={handleAdminChange} className="form-control" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Email Address</label>
                            <input type="email" name="email" value={adminForm.email} onChange={handleAdminChange} className="form-control" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888' }}>Initial Password</label>
                            <input type="password" name="password" value={adminForm.password} onChange={handleAdminChange} className="form-control" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
                        </div>
                        <button type="submit" style={{ padding: '0.8rem 1.5rem', background: '#34C759', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Create</button>
                    </form>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>System Health</h3>
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#888' }}>CPU Usage</span>
                            <span style={{ color: '#4cd964' }}>12%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                            <div style={{ width: '12%', height: '100%', background: '#4cd964', borderRadius: '3px' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '1rem' }}>
                            <span style={{ color: '#888' }}>Memory</span>
                            <span style={{ color: '#ffcc00' }}>64%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                            <div style={{ width: '64%', height: '100%', background: '#ffcc00', borderRadius: '3px' }}></div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Active Users</h3>
                    <p className="stat-value">1,204</p>
                    <p style={{ color: '#4cd964', marginTop: '0.5rem' }}>+12% this week</p>
                </div>
                <div className="stat-card">
                    <h3>Total Admins</h3>
                    <p className="stat-value">5</p>
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
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '600' }}>System Audit Logs</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: '#888' }}>Event</th>
                            <th style={{ padding: '1rem', color: '#888' }}>User</th>
                            <th style={{ padding: '1rem', color: '#888' }}>Time</th>
                            <th style={{ padding: '1rem', color: '#888' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem' }}>New Admin Created</td>
                            <td style={{ padding: '1rem' }}>SuperAdmin</td>
                            <td style={{ padding: '1rem' }}>Just now</td>
                            <td style={{ padding: '1rem' }}><span style={{ color: '#4cd964' }}>Success</span></td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem' }}>System Backup</td>
                            <td style={{ padding: '1rem' }}>System</td>
                            <td style={{ padding: '1rem' }}>1 hour ago</td>
                            <td style={{ padding: '1rem' }}><span style={{ color: '#4cd964' }}>Success</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
