import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword, reset } from '../../store/slices/authSlice';
import './Auth.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        new_password: '',
        confirm_password: '',
    });

    const { email, code, new_password, confirm_password } = formData;
    const [searchParams] = useSearchParams();

    // Auto-fill email from query param if available
    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }
    }, [searchParams]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            alert(message);
            dispatch(reset());
        }

        if (isSuccess) {
            alert('Password Reset Successful! Please login.');
            dispatch(reset());
            navigate('/login');
        }
    }, [isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (new_password !== confirm_password) {
            alert('Passwords do not match');
            return;
        }

        dispatch(resetPassword({ email, code, new_password }));
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="auth-card glass" style={{ maxWidth: '450px' }}>
                <div className="auth-header">
                    <h1>Reset Password</h1>
                    <p>Enter the code sent to your email</p>
                </div>

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="code">Activation Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="code"
                            name="code"
                            value={code}
                            onChange={onChange}
                            placeholder="6-digit code"
                            maxLength="6"
                            required
                            style={{ letterSpacing: '2px', fontFamily: 'monospace' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="new_password">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="new_password"
                            name="new_password"
                            value={new_password}
                            onChange={onChange}
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm_password"
                            name="confirm_password"
                            value={confirm_password}
                            onChange={onChange}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>

                <div className="auth-switch">
                    <p>
                        Remembered it? <span onClick={() => navigate('/login')} style={{ color: '#007AFF', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
