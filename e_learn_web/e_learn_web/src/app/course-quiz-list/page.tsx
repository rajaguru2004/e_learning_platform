'use client';

import React from 'react';

export default function CourseQuizList() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#2e2e2e] dark:text-gray-200">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-primary dark:text-white text-lg font-bold leading-tight">EduAdmin</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Management Portal</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        <a className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" href="#">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary dark:bg-primary/20 dark:text-white rounded-lg transition-colors" href="#">
                            <span className="material-symbols-outlined">book_2</span>
                            <span className="text-sm font-medium">Courses</span>
                        </a>
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {/* Top Header */}
                    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Courses</span>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span className="text-gray-900 dark:text-white font-medium">Advanced Web Development</span>
                        </div>
                    </header>
                    <div className="p-8 max-w-6xl mx-auto">
                        {/* Course Info Section */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced Web Development</h2>
                            <p className="text-gray-500 dark:text-gray-400">Master modern frontend frameworks and backend architectures.</p>
                        </div>
                        {/* Tabs Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
                            <div className="flex gap-8">
                                <a className="pb-4 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent" href="#">
                                    General
                                </a>
                                <a className="pb-4 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent" href="#">
                                    Lessons
                                </a>
                                <a className="pb-4 text-sm font-semibold text-primary dark:text-white border-b-2 border-primary" href="#">
                                    Quizzes
                                </a>
                                <a className="pb-4 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent" href="#">
                                    Students
                                </a>
                            </div>
                        </div>
                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="relative w-full sm:w-80">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all dark:text-white" placeholder="Search quizzes..." type="text" />
                            </div>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all">
                                <span className="material-symbols-outlined text-lg">add</span>
                                Add Quiz
                            </button>
                        </div>
                        {/* Quiz List */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quiz Title</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Questions</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Modified</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Module 1: Intro to React Fundamentals</span>
                                                    <span className="text-xs text-gray-400">Basics of JSX and Components</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Published</span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">15 Questions</td>
                                            <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400">Oct 24, 2023</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-primary/10 rounded-lg transition-all" title="Edit Quiz">
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete Quiz">
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                    <span className="material-symbols-outlined">quiz</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Total Quizzes</p>
                                    <h4 className="text-2xl font-bold dark:text-white">4</h4>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg dark:bg-emerald-900/30">
                                    <span className="material-symbols-outlined">task_alt</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Published</p>
                                    <h4 className="text-2xl font-bold dark:text-white">3</h4>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                                <div className="bg-amber-100 text-amber-600 p-3 rounded-lg dark:bg-amber-900/30">
                                    <span className="material-symbols-outlined">edit_note</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Pending Drafts</p>
                                    <h4 className="text-2xl font-bold dark:text-white">1</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
