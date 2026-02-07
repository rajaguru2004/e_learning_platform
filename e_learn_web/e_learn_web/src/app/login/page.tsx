'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({ email: '', password: '' });

        // Basic validation
        let hasErrors = false;
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            hasErrors = true;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            hasErrors = true;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            hasErrors = true;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement actual API call
            // Example:
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     email: formData.email,
            //     password: formData.password
            //   })
            // });
            // const data = await response.json();

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Login attempt:', {
                email: formData.email,
                rememberMe: formData.rememberMe
            });

            // After successful login, redirect to admin courses
            router.push('/admin-courses');
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                email: '',
                password: 'Invalid email or password. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container gradient-bg">
            {/* Animated Background Elements */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Login Card */}
            <div className="login-card glass-effect fade-in">
                {/* Logo/Brand Section */}
                <div className="login-header">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
                            <path d="M2 17L12 22L22 17" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#667eea" />
                                    <stop offset="1" stopColor="#764ba2" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="2" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#f093fb" />
                                    <stop offset="1" stopColor="#f5576c" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to continue to your learning journey</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email Input */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8L10.89 13.26C11.5423 13.7013 12.4577 13.7013 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                type="email"
                                id="email"
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8V4M12 20V16M20 12H16M8 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="password"
                                id="password"
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox-input"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                disabled={isLoading}
                            />
                            <span className="checkbox-text">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p className="footer-text">
                        Don&apos;t have an account?{' '}
                        <Link href="/admin-signup" className="footer-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Additional Info Card */}
            <div className="info-card glass-effect fade-in">
                <p className="info-text">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    First time here? Use your email and a password to sign in.
                </p>
            </div>
        </div>
    );
}
