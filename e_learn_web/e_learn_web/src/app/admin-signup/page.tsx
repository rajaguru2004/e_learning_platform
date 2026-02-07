'use client';

import React from 'react';

export default function AdminSignup() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-300">
            {/* Top Navigation */}
            <header className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-primary dark:text-white">
                    <span className="material-symbols-outlined text-3xl">auto_stories</span>
                    <h2 className="text-lg font-bold tracking-tight">eLearning Admin</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                        Support
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-all">
                        Login
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[480px]">
                    {/* Registration Card */}
                    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-gray-100 dark:border-gray-800">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                                <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Registration</h1>
                            <p className="text-text-dark dark:text-gray-400 font-medium">Create your admin account</p>
                        </div>

                        {/* Registration Form */}
                        <form className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="fullname">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        person
                                    </span>
                                    <input
                                        className="form-input w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 transition-all"
                                        id="fullname"
                                        placeholder="Enter your full name"
                                        type="text"
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        mail
                                    </span>
                                    <input
                                        className="form-input w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 transition-all"
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock
                                    </span>
                                    <input
                                        className="form-input w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 transition-all"
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" type="button">
                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    Must be at least 8 characters with a mix of letters and symbols.
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="confirm-password">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock_reset
                                    </span>
                                    <input
                                        className="form-input w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 transition-all"
                                        id="confirm-password"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 py-1">
                                <input className="mt-1 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" id="terms" type="checkbox" />
                                <label className="text-xs text-gray-600 dark:text-gray-400 leading-tight" htmlFor="terms">
                                    I agree to the{' '}
                                    <a className="text-primary hover:underline" href="#">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a className="text-primary hover:underline" href="#">
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]"
                                type="submit"
                            >
                                Create Account
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?
                                <a className="text-primary font-bold hover:underline ml-1" href="#">
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Additional Help/Security Info */}
                    <div className="mt-8 flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base">verified_user</span>
                            SSL Secured
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base">gpp_good</span>
                            GDPR Compliant
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base">encrypted</span>
                            Data Encrypted
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="py-6 px-10 border-t border-gray-200 dark:border-gray-800 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 eLearning Platform Management System. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
