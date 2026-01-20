import React from 'react';
import { useNavigate } from 'react-router-dom';
import AIRobot3D from '../../components/UI/AIRobot3D';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            {/* Left side - 3D Animatic (60%) */}
            <div className="landing-robot">
                <AIRobot3D />
                <div className="robot-background-gradient"></div>
            </div>

            {/* Right side - iOS Glass Content (40%) */}
            <div className="landing-content">
                <div className="content-box">
                    <div className="brand-section">
                        <h1 className="brand-title">StudentBuddy</h1>
                    </div>

                    <div className="description">
                        <p>
                            StudentBuddy is a cutting-edge AI-powered mentorship platform
                            designed to provide personalized, focused support tailored to
                            every student's specific academic and career needs.
                        </p>
                    </div>

                    <button
                        className="get-started-btn"
                        onClick={handleGetStarted}
                    >
                        <span>Get Started</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
