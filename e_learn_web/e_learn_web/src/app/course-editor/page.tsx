'use client';

import React from 'react';

export default function CourseEditor() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            {/* Main Container */}
            <div className="max-w-[1200px] mx-auto px-6 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <a className="hover:text-primary" href="#">
                        Courses
                    </a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-text-main dark:text-white">Introduction to UI/UX Design</span>
                </nav>

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2 group cursor-pointer">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-text-main dark:text-white border-b-2 border-transparent hover:border-gray-300 transition-colors">
                                Introduction to UI/UX Design
                            </h1>
                            <span className="material-symbols-outlined text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                edit
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage modules, lessons, and quizzes for this course.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold text-text-main dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all">
                            <span className="material-symbols-outlined text-xl">visibility</span>
                            Preview
                        </button>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Published</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input className="sr-only publish-toggle" defaultChecked type="checkbox" />
                                <div className="toggle-bg w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 transition-colors relative">
                                    <div className="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-sm" />
                                </div>
                            </label>
                        </div>
                    </div>
                </header>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
                    <nav className="flex gap-8">
                        <a className="pb-4 border-b-2 border-primary text-primary font-bold text-sm flex items-center gap-2" href="#">
                            <span className="material-symbols-outlined text-xl">list_alt</span>
                            Content
                        </a>
                        <a
                            className="pb-4 border-b-2 border-transparent text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-text-main dark:hover:text-white transition-colors flex items-center gap-2"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-xl">description</span>
                            Description
                        </a>
                        <a
                            className="pb-4 border-b-2 border-transparent text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-text-main dark:hover:text-white transition-colors flex items-center gap-2"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-xl">settings</span>
                            Options
                        </a>
                        <a
                            className="pb-4 border-b-2 border-transparent text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-text-main dark:hover:text-white transition-colors flex items-center gap-2"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-xl">quiz</span>
                            Quiz
                        </a>
                    </nav>
                </div>

                {/* Content Action Bar */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-text-main dark:text-white">Course Syllabus</h3>
                    <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">add</span>
                        Add Content
                    </button>
                </div>

                {/* Lessons List */}
                <div className="flex flex-col gap-4">
                    {/* Lesson Row 1 */}
                    <div className="group flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="cursor-move text-gray-400 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">drag_indicator</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-text-main dark:text-gray-100">1. Welcome to the Course</h4>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                        Video
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500">Duration: 04:30 • Last edited 2 days ago</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-success-mint">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span className="text-xs font-bold uppercase tracking-wide">Live</span>
                            </div>
                            <button className="text-gray-400 hover:text-text-main dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Lesson Row 2 */}
                    <div className="group flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="cursor-move text-gray-400 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">drag_indicator</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-text-main dark:text-gray-100">2. Design Principles 101</h4>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                        Video
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500">Duration: 15:45 • Last edited 5 days ago</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-success-mint">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span className="text-xs font-bold uppercase tracking-wide">Live</span>
                            </div>
                            <button className="text-gray-400 hover:text-text-main dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Lesson Row 3 (Quiz) */}
                    <div className="group flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="cursor-move text-gray-400 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">drag_indicator</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-text-main dark:text-gray-100">3. Module 1 Assessment</h4>
                                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                        Quiz
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500">10 Questions • Passing score 80%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-amber-500">
                                <span className="material-symbols-outlined text-lg">pending</span>
                                <span className="text-xs font-bold uppercase tracking-wide">Draft</span>
                            </div>
                            <button className="text-gray-400 hover:text-text-main dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Lesson Row 4 (New) */}
                    <div className="group flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="text-gray-300">
                                <span className="material-symbols-outlined">drag_indicator</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-gray-400 italic">4. New Lesson Title...</h4>
                                </div>
                                <span className="text-xs text-gray-400">Add content details to begin</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="text-primary text-xs font-bold uppercase hover:underline">Edit details</button>
                            <button className="text-gray-400 hover:text-text-main dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics (Footer Card) */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">movie</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Lessons</p>
                            <p className="text-xl font-bold text-text-main dark:text-white">24 Video Lessons</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-success-mint/10 flex items-center justify-center text-success-mint">
                            <span className="material-symbols-outlined text-2xl">timer</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Course Duration</p>
                            <p className="text-xl font-bold text-text-main dark:text-white">12h 45m</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <span className="material-symbols-outlined text-2xl">help</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Quizzes</p>
                            <p className="text-xl font-bold text-text-main dark:text-white">4 Assessments</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
