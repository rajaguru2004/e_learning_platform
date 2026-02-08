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
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const { login } = await import('@/lib/api');
            const { saveToken, saveUser } = await import('@/lib/auth');

            const response = await login({
                email: formData.email,
                password: formData.password
            });

            saveToken(response.data.token);
            saveUser(response.data.user);

            if (response.data.user.role.code === 'INSTRUCTOR') {
                router.push('/admin/instructor/dashboard');
            } else {
                router.push('/admin/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setErrors({
                email: '',
                password: error.message || 'Invalid email or password. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side: Brand Section */}
            <div className="brand-section">
                <div className="brand-content animate-up">
                    <div className="brand-logo">
                        <div className="brand-logo-icon">🎓</div>
                        <span>Metis.</span>
                    </div>

                    <h1 className="brand-headline">
                        Empower your <br />
                        future with <br />
                        <span style={{ color: '#60a5fa' }}>modern learning.</span>
                    </h1>

                    <p className="brand-subheadline">
                        Join our community of over 50,000 learners and instructors.
                        Access world-class courses and build skills that matter.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Expert-led video courses</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Interactive quizzes and assignments</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Certificates of completion</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form Section */}
            <div className="form-section">
                <div className="login-wrapper animate-up" style={{ animationDelay: '0.1s' }}>
                    <div className="form-header">
                        <h2 className="form-title">Login to account</h2>
                        <p className="form-subtitle">Enter your credentials to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-container">
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="input-container">
                                <input
                                    type="password"
                                    id="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <div className="form-utils">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link href="/forgot-password" hidden className="forgot-pw">Forgot password?</Link>
                        </div>

                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Sign In to Platform</span>
                            )}
                        </button>
                    </form>

                    <div className="social-login">
                        <div className="social-divider">Or continue with</div>
                        <div className="social-btns">
                            <button className="btn-social">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" alt="Google" />
                                <span>Google</span>
                            </button>
                            <button className="btn-social">
                                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" width="20" alt="Facebook" />
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>

                    <div className="footer-signup">
                        Don't have an account?{' '}
                        <Link href="/signup" className="signup-link">Get started</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
