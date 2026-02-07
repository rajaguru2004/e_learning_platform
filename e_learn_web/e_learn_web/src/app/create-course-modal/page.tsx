'use client';

import React from 'react';
import Link from 'next/link';

export default function CreateCourseModal() {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen text-[#0f121a] dark:text-white">
            {/* Modal Backdrop */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f121a]/60 backdrop-blur-sm px-4">
                {/* Modal Container */}
                <div className="w-full max-w-[480px] bg-white dark:bg-[#1a1e2b] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                    {/* Modal Header */}
                    <div className="p-8 pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold text-[#2E2E2E] dark:text-white">Create New Course</h2>
                            <Link href="/admin-courses">
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start by giving your educational content a clear, engaging title.</p>
                    </div>
                    {/* Modal Body / Form */}
                    <div className="px-8 py-4">
                        <label className="block">
                            <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Title</span>
                            <input
                                autoFocus
                                className="form-input block w-full rounded-lg border-[#d2d7e4] dark:border-[#2d3244] bg-[#f9f9fb] dark:bg-[#13161f] text-[#0f121a] dark:text-white h-14 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-[#a0aec0] dark:placeholder:text-[#56668f] text-base"
                                placeholder="e.g., Introduction to UI Design"
                                type="text"
                            />
                        </label>
                    </div>
                    {/* Modal Footer */}
                    <div className="p-8 pt-4 flex items-center justify-end gap-4">
                        <Link href="/admin-courses">
                            <button className="px-6 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#0f121a] dark:hover:text-white transition-colors">Cancel</button>
                        </Link>
                        <Link href="/course-editor">
                            <button className="flex items-center justify-center min-w-[140px] px-6 py-3 bg-primary hover:bg-[#162d66] active:scale-95 text-white rounded-lg text-sm font-bold tracking-wide transition-all shadow-lg shadow-primary/20">
                                Create Course
                            </button>
                        </Link>
                    </div>
                    {/* Tip */}
                    <div className="px-8 pb-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                            Quick Action Mode
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
