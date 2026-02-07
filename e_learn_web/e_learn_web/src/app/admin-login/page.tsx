'use client';

import React from 'react';

export default function AdminLogin() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-200">
            {/* Top Navigation Placeholder (Subtle) */}
            <nav className="w-full px-8 py-6 flex justify-between items-center absolute top-0">
                <div className="flex items-center gap-2">
                    <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">auto_graph</span>
                    </div>
                    <span className="text-[#2E2E2E] dark:text-gray-100 font-bold text-xl tracking-tight">
                        EduNexus{' '}
                        <span className="text-primary font-medium text-sm border-l border-gray-300 ml-2 pl-2">
                            Admin
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-green-500">fiber_manual_record</span>
                        System Status: Online
                    </span>
                </div>
            </nav>

            {/* Main Login Container */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[440px] bg-white dark:bg-[#1f1b2e] p-10 rounded-xl shadow-xl shadow-primary/5 border border-gray-100 dark:border-gray-800">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-primary/5 dark:bg-primary/20 rounded-full">
                            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#2E2E2E] dark:text-white mb-2">eLearning Admin Portal</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Login to your enterprise dashboard</p>
                    </div>

                    {/* Login Form */}
                    <form action="#" className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                                    <span className="material-symbols-outlined text-xl">mail</span>
                                </div>
                                <input
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#28233a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200"
                                    id="email"
                                    name="email"
                                    placeholder="admin@company.com"
                                    type="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="password">
                                    Password
                                </label>
                                <a className="text-xs font-medium text-primary hover:text-accent transition-colors" href="#">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                                    <span className="material-symbols-outlined text-xl">lock</span>
                                </div>
                                <input
                                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-[#28233a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Policy */}
                        <div className="flex items-center">
                            <input
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                id="remember"
                                type="checkbox"
                            />
                            <label className="ml-2 text-sm text-gray-600 dark:text-gray-400" htmlFor="remember">
                                Remember this device for 30 days
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
                            type="submit"
                        >
                            <span>Login to Dashboard</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </form>

                    {/* Footer Help */}
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Having trouble logging in?{' '}
                            <a className="text-primary font-semibold hover:underline" href="#">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Page Footer */}
            <footer className="w-full py-8 text-center text-gray-400 text-xs px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">security</span>
                        AES-256 Encrypted Session
                    </span>
                    <p>© 2024 EduNexus Enterprise LMS. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a className="hover:text-gray-600 transition-colors" href="#">
                            Privacy Policy
                        </a>
                        <a className="hover:text-gray-600 transition-colors" href="#">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
