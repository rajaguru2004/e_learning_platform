'use client';

import React from 'react';
import Link from 'next/link';

export default function ReportingDashboard() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-20 lg:w-64 bg-primary text-white flex flex-col transition-all duration-300">
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-white">school</span>
                        </div>
                        <h2 className="font-bold text-xl hidden lg:block tracking-tight">LearnAdmin</h2>
                    </div>
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <a className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" href="#">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="hidden lg:block font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-4 px-4 py-3 rounded-lg bg-white/20 shadow-sm transition-colors" href="#">
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="hidden lg:block font-medium">Reporting</span>
                        </a>
                        <Link className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" href="/admin-courses">
                            <span className="material-symbols-outlined">book</span>
                            <span className="hidden lg:block font-medium">Courses</span>
                        </Link>
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header */}
                    <header className="h-16 bg-white dark:bg-background-dark/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
                        <div className="flex items-center gap-4 flex-1 max-w-xl">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary" placeholder="Search for participants, courses, or reports..." type="text" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all">
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export Report
                            </button>
                        </div>
                    </header>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-background-light dark:bg-background-dark">
                        {/* Page Title */}
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Reporting Analytics</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of student engagement and course completions.</p>
                        </div>
                        {/* KPI Cards Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Card 1 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="material-symbols-outlined text-slate-400">groups</span>
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Participants</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">1,240</h3>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="material-symbols-outlined text-slate-400">pending_actions</span>
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Yet to Start</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">156</h3>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="material-symbols-outlined text-primary">autoplay</span>
                                </div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">In Progress</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">432</h3>
                            </div>
                            {/* Card 4 (Highlighted Teal) */}
                            <div className="bg-success-teal/10 dark:bg-success-teal/5 p-6 rounded-xl border border-success-teal/30 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="material-symbols-outlined text-success-teal">check_circle</span>
                                </div>
                                <p className="text-success-teal/80 text-xs font-bold uppercase tracking-wider mb-1">Completed</p>
                                <h3 className="text-2xl font-black text-success-teal">652</h3>
                                <div className="absolute -right-2 -bottom-2 opacity-10">
                                    <span className="material-symbols-outlined text-8xl text-success-teal">task_alt</span>
                                </div>
                            </div>
                            {/* Card 5 (Highlighted Gold) */}
                            <div className="bg-effort-gold/10 dark:bg-effort-gold/5 p-6 rounded-xl border border-effort-gold/30 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="material-symbols-outlined text-effort-gold">speed</span>
                                </div>
                                <p className="text-effort-gold/80 text-xs font-bold uppercase tracking-wider mb-1">Average Effort Score</p>
                                <h3 className="text-2xl font-black text-effort-gold">88%</h3>
                                <div className="absolute -right-2 -bottom-2 opacity-10">
                                    <span className="material-symbols-outlined text-8xl text-effort-gold">trending_up</span>
                                </div>
                            </div>
                        </div>
                        {/* Data Table Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <h4 className="font-bold text-slate-900 dark:text-white">Recent Activity</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Participant Name</th>
                                            <th className="px-6 py-4">Course Name</th>
                                            <th className="px-6 py-4">Completion Status</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Last Active</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">JD</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Jane Doe</p>
                                                        <p className="text-xs text-slate-500">jane.doe@enterprise.com</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Cybersecurity Fundamentals</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-success-teal" style={{ width: '100%' }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">100%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded bg-success-teal/10 text-success-teal border border-success-teal/20">Completed</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">2 hours ago</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-primary">
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
