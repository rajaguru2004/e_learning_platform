'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminCourses() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-200">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex flex-col">
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-primary rounded-lg p-1.5 text-white">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-primary dark:text-white text-lg font-bold leading-none">EduFlow</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Admin Portal</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-medium">Dashboard</span>
                        </a>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg active-nav" href="#">
                            <span className="material-symbols-outlined">book_4</span>
                            <span className="text-sm font-medium">Courses</span>
                        </a>
                        <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="/reporting-dashboard">
                            <span className="material-symbols-outlined">analytics</span>
                            <span className="text-sm font-medium">Reports</span>
                        </Link>
                        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </a>
                    </nav>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3 px-2">
                            <div
                                className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0l1x2nyydUzPm75eVgUXp8care3EKVbTpcVf__MOKVhqiS5dZvx6nBhGmscYX_UTSIuG0lg6EP79y8S0Md4oJmYZHEeqFHT0XsNdVxx1BRLS1JyxV3ArFyNuzxJn-g3h0g7TsbgKFV67A5JadkPcYDSvz0ieU72Roz8kFakcvWxxG7AobmtlVDqhc72qsrj5Dxq5lG5AOFKlw17nKX1RlIAJWbmeT1TzxSpYue2T-ASHhq9i-zYSG68fIjYDZEujA-lIdl6xCqOwR')",
                                }}
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate">Alex Johnson</p>
                                <p className="text-xs text-gray-500 truncate">Senior Admin</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined text-xl">logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FB] dark:bg-background-dark/50 overflow-y-auto">
                    {/* Header */}
                    <header className="bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 px-8 py-4 sticky top-0 z-10">
                        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                            <div className="flex items-center gap-6 flex-1">
                                <h2 className="text-2xl font-bold text-text-main dark:text-white">Courses</h2>
                                <div className="relative max-w-md w-full">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                        search
                                    </span>
                                    <input
                                        className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/30 transition-shadow"
                                        placeholder="Search courses by name or ID..."
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/create-course-modal">
                                    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-primary/20">
                                        <span className="material-symbols-outlined text-xl">add_circle</span>
                                        <span>Create Course</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Sub Header: Controls */}
                    <div className="px-8 py-6 max-w-7xl mx-auto w-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3 bg-gray-200/50 dark:bg-gray-800 p-1 rounded-xl">
                                <button className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-sm font-semibold text-primary dark:text-white">
                                    <span className="material-symbols-outlined text-lg">grid_view</span>
                                    <span>Kanban</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700">
                                    <span className="material-symbols-outlined text-lg">view_list</span>
                                    <span>List</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <span>Sort by:</span>
                                <select className="bg-transparent border-none focus:ring-0 text-primary dark:text-gray-300 font-semibold cursor-pointer py-0">
                                    <option>Last Modified</option>
                                    <option>Alphabetical</option>
                                    <option>Course Status</option>
                                </select>
                            </div>
                        </div>

                        {/* Course Grid (Kanban View) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Card 1 */}
                            <Link href="/course-editor">
                                <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer">
                                    <div
                                        className="h-32 bg-gray-200 dark:bg-gray-700 bg-cover bg-center relative"
                                        style={{
                                            backgroundImage:
                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbT7DZWKuM3i3rx_BZh-CV51IcOUe1cPK0qTb_UaLFjt0_QT-F9fy5jJ42HR6HqzgNbJDRGYBYTlzmxV7hZ1LmNRKfnt3lUq3xALJ8vs7DfryMgvJBMUH6ENQbI0sMQyD1BodTO4MMCdS4mo7kYbNItmo-SaGFBUTxvNIjbb9dVQ2SELOMj9VG0OuhORi2S35GhLlQFSEBF6v5VWtRJSCgvmXJNgeNd-qCdFOVgsFSIhq6BwjYVzEbImZRKPXnaHkeDDSqhGcFD350')",
                                        }}
                                    >
                                        <div className="absolute top-3 right-3">
                                            <button className="size-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors shadow-sm">
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex gap-2 mb-3">
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-md">Design</span>
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] font-bold uppercase rounded-md">
                                                Beginner
                                            </span>
                                        </div>
                                        <h3 className="text-text-main dark:text-white font-semibold text-lg leading-tight mb-4 line-clamp-2">
                                            Introduction to UI/UX Design Principles
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-5">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">menu_book</span>
                                                <span>12 Lessons</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span>4h 30m</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-3 rounded-full bg-accent-success shadow-[0_0_8px_rgba(46,196,182,0.4)]" />
                                                <span className="text-xs font-bold text-accent-success uppercase tracking-wider">Published</span>
                                            </div>
                                            <div className="flex -space-x-2">
                                                <div
                                                    className="size-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 bg-cover"
                                                    style={{
                                                        backgroundImage:
                                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASbpT5mDRW8tAHDNP30nKtT8f8w8vNEXx5mnufR-4_AKwYM8VH0RekxnEP155zfyu3e0YAF_tQ6RY4TtEl9YIxthw77VT4ATARr3gSNjkOeVcgzFsrvyUSMMCo_lNPlk9cEwZBFqNL5HIZEaCE-MMLumzsP6q3kd-vS80SLBwEcQk2HlkK_agL2_hzyIQWnYWhdMQsExYYewuydGSFlNssjvo-M7USNSGuBUiyyhleUy0u3XHum79kflrmYpDvn0-yp5k5LS3dWjbL')",
                                                    }}
                                                />
                                                <div
                                                    className="size-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-400 bg-cover"
                                                    style={{
                                                        backgroundImage:
                                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbK-KGuijB6Gcl4bBU0QpF0d1PpJEHdXbkDQvohyBACOISKbuCrAkhyaOyc38HBJlPoSX0keIQJ7NYoKqPr4KzJK_T8OK4CkgMoR4gLSx7L3MPyTJfGnDBSyQls73yoK2eGVNIo9rGAEYDDxHgGrndwIntT_2hwerEqgWIb1NJEFxTmHJj0v_9QaTKooGB2WyMx-zix0wNypecKtZ4hdNdJG69LB9lRsTZE0pH6hR3Sr_lR0s8sh8-148ZSBPdkwwkIusWCxjZraUu')",
                                                    }}
                                                />
                                                <div className="size-6 rounded-full border-2 border-white dark:border-gray-800 bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    +12
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* New Course Placeholder - reduced for brevity, add more cards as needed */}
                            <Link href="/create-course-modal">
                                <button className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl h-full p-8 group hover:border-primary transition-colors min-h-[300px] w-full">
                                    <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-3xl">add</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-500 group-hover:text-primary">Create New Course</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
