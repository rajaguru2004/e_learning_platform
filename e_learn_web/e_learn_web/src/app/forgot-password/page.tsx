'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle password reset logic here
        console.log('Password reset requested for:', email);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            {/* Top Navigation Bar */}
            <header className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <h2 className="text-[#101219] dark:text-white text-lg font-bold leading-tight tracking-tight">
                            eLearning Admin
                        </h2>
                    </div>
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-bold">
                        <span className="truncate">Support</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                    {/* Icon & Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-primary text-3xl">
                                lock_reset
                            </span>
                        </div>
                        <h1 className="text-[#2E2E2E] dark:text-white text-3xl font-bold leading-tight mb-3">
                            Forgot Password
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                            Enter your email address and we will send you a link to reset your password.
                        </p>
                    </div>

                    {/* Recovery Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-[#101219] dark:text-gray-200 text-sm font-semibold"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-teal transition-colors">
                                    mail
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[#101219] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all placeholder:text-gray-400"
                                    id="email"
                                    placeholder="admin@elearning.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                className="w-full flex items-center justify-center gap-2 rounded-lg h-14 bg-deep-navy text-white text-base font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
                                type="submit"
                            >
                                <span>Send Reset Link</span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        </div>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-8 text-center">
                        <Link
                            className="inline-flex items-center gap-2 text-primary hover:text-deep-navy font-semibold transition-colors"
                            href="/admin-login"
                        >
                            <span className="material-symbols-outlined text-lg">keyboard_backspace</span>
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Background Decoration Elements */}
            <div className="fixed bottom-0 left-0 w-full h-1/2 -z-10 opacity-40">
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary/10 to-transparent"></div>
                <div className="absolute -bottom-24 -left-24 size-96 bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -right-24 size-96 bg-accent-teal/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-gray-400 dark:text-gray-600 text-xs">
                <p>© 2024 eLearning Admin Platform. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                    <a className="hover:text-primary" href="#">
                        Privacy Policy
                    </a>
                    <span>•</span>
                    <a className="hover:text-primary" href="#">
                        Terms of Service
                    </a>
                </div>
            </footer>
        </div>
    );
}
