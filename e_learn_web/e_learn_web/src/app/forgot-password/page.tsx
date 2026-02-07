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
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            {/* Top Navigation Bar */}
            <header className="w-full bg-transparent px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <h2 className="text-slate-700 dark:text-white text-base font-semibold">
                            eLearning Admin
                        </h2>
                    </div>
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                        Support
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-10">
                    {/* Icon & Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-primary text-2xl">
                                lock_reset
                            </span>
                        </div>
                        <h1 className="text-slate-800 dark:text-white text-2xl font-bold mb-2">
                            Forgot Password
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">
                            Enter your email address and we will send you a<br />link to reset your password.
                        </p>
                    </div>

                    {/* Recovery Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-slate-700 dark:text-gray-200 text-sm font-semibold"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                    mail
                                </span>
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
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
                                className="w-full flex items-center justify-center gap-2 rounded-lg py-3.5 bg-deep-navy text-white text-sm font-bold hover:bg-deep-navy/90 active:scale-[0.98] transition-all shadow-sm"
                                type="submit"
                            >
                                <span>Send Reset Link</span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        </div>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium transition-colors text-sm"
                            href="/login"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-5 text-center text-slate-400 dark:text-gray-600 text-xs">
                <p>© 2024 eLearning Admin Platform. All rights reserved.</p>
                <div className="flex justify-center gap-3 mt-2">
                    <Link className="hover:text-primary transition-colors" href="#">
                        Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link className="hover:text-primary transition-colors" href="#">
                        Terms of Service
                    </Link>
                </div>
            </footer>
        </div>
    );
}
