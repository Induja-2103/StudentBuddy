import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AnimatedCursor from './components/UI/AnimatedCursor';
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import TestPage from './pages/Test/TestPage';
import TestTaking from './pages/Test/TestTaking';
import MentorSelection from './pages/Mentor/MentorSelection';
import ChatInterface from './pages/Mentor/ChatInterface';
import DetailsPage from './pages/Details/DetailsPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SuperAdminDashboard from './pages/Admin/SuperAdminDashboard';
import './App.css';

function App() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="App">
            <AnimatedCursor />
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />

                {/* Public Routes */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
                <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
                <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />

                {/* Protected Student Routes */}
                <Route
                    path="/dashboard"
                    element={user && user.role === 'Student' ? <StudentDashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/tests"
                    element={user && user.role === 'Student' ? <TestPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/tests/:attemptId/take"
                    element={user && user.role === 'Student' ? <TestTaking /> : <Navigate to="/login" />}
                />
                <Route
                    path="/mentors"
                    element={user && user.role === 'Student' ? <MentorSelection /> : <Navigate to="/login" />}
                />
                <Route
                    path="/mentors/chat/:sessionId"
                    element={user && user.role === 'Student' ? <ChatInterface /> : <Navigate to="/login" />}
                />
                <Route
                    path="/details"
                    element={user && user.role === 'Student' ? <DetailsPage /> : <Navigate to="/login" />}
                />

                {/* Protected Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        user && user.role === 'Admin' ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Protected SuperAdmin Routes - TEMP OPEN */}
                <Route path="/superadmin" element={<SuperAdminDashboard />} />
            </Routes>
        </div>
    );
}

export default App;
