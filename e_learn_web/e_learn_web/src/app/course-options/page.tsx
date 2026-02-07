'use client';

import React from 'react';
import Link from 'next/link';

export default function CourseOptions() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 flex flex-col">
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <div>
                            <h1 className="text-header-blue dark:text-white text-base font-bold leading-none">EduPortal</h1>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mt-1">Admin Console</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-1">
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors" href="#">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <Link className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" href="/course-editor">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                book
                            </span>
                            <span className="text-sm font-medium">Courses</span>
                        </Link>
                    </nav>
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto">
                    {/* Header Section */}
                    <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-10 px-8 py-4">
                        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
                                    <span>Courses</span>
                                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    <span>UX Fundamentals</span>
                                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                                    <span className="text-primary">Options</span>
                                </div>
                                <h2 className="text-2xl font-black text-header-blue dark:text-white tracking-tight">Advanced Course Options</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                    Discard Changes
                                </button>
                                <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </header>
                    {/* Settings Content */}
                    <div className="flex-1 p-8">
                        <div className="max-w-5xl mx-auto space-y-6">
                            {/* Section 1: Visibility */}
                            <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold text-header-blue dark:text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined">visibility</span>
                                        Visibility Settings
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Control who can discover and view this course in the portal catalog.</p>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="relative flex flex-col p-5 cursor-pointer rounded-xl border-2 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all bg-gray-50/30 dark:bg-zinc-800/20">
                                        <input defaultChecked className="absolute top-5 right-5 w-5 h-5 text-primary focus:ring-primary border-gray-300 custom-radio" name="visibility" type="radio" value="everyone" />
                                        <span className="material-symbols-outlined text-3xl text-primary mb-3">public</span>
                                        <span className="text-base font-bold text-text-main dark:text-white">Everyone</span>
                                        <span className="text-sm text-gray-500 mt-2">The course is public and visible to all site visitors, including guest users.</span>
                                    </label>
                                    <label className="relative flex flex-col p-5 cursor-pointer rounded-xl border-2 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all bg-gray-50/30 dark:bg-zinc-800/20">
                                        <input className="absolute top-5 right-5 w-5 h-5 text-primary focus:ring-primary border-gray-300 custom-radio" name="visibility" type="radio" value="signed-in" />
                                        <span className="material-symbols-outlined text-3xl text-gray-400 mb-3">lock</span>
                                        <span className="text-base font-bold text-text-main dark:text-white">Signed In</span>
                                        <span className="text-sm text-gray-500 mt-2">Only registered and authenticated users can see this course in the catalog.</span>
                                    </label>
                                </div>
                            </section>
                            {/* Section 2: Access Rules */}
                            <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold text-header-blue dark:text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined">key</span>
                                        Access Rules
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Determine the enrollment process for students.</p>
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center h-5 mt-1">
                                            <input defaultChecked className="w-5 h-5 text-primary focus:ring-primary border-gray-300 custom-radio" id="access-open" name="access" type="radio" value="open" />
                                        </div>
                                        <label className="flex-1 cursor-pointer" htmlFor="access-open">
                                            <span className="block text-base font-bold text-text-main dark:text-white">Open Enrollment</span>
                                            <span className="block text-sm text-gray-500 mt-1">Students can self-enroll in the course without administrative approval.</span>
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center h-5 mt-1">
                                            <input className="w-5 h-5 text-primary focus:ring-primary border-gray-300 custom-radio" id="access-invite" name="access" type="radio" value="invite" />
                                        </div>
                                        <label className="flex-1 cursor-pointer" htmlFor="access-invite">
                                            <span className="block text-base font-bold text-text-main dark:text-white">On Invitation Only</span>
                                            <span className="block text-sm text-gray-500 mt-1">Students must be manually added by an admin or receive a direct invite link.</span>
                                        </label>
                                    </div>
                                </div>
                            </section>
                            {/* Danger Zone */}
                            <section className="bg-red-50/30 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 overflow-hidden mb-12">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-red-700 dark:text-red-500 flex items-center gap-2">
                                        <span className="material-symbols-outlined">warning</span>
                                        Danger Zone
                                    </h3>
                                    <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-red-700 dark:text-red-400">Archive this course</p>
                                            <p className="text-sm text-red-600/80 dark:text-red-500/60 mt-1">Archived courses are hidden from all students but keep their historical data.</p>
                                        </div>
                                        <button className="px-5 py-2 border-2 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-500 text-sm font-bold rounded-lg transition-all">
                                            Archive Course
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
