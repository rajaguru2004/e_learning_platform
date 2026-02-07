'use client';

import React from 'react';
import Link from 'next/link';

export default function QuizBuilder() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-6 py-3 h-16 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center bg-primary rounded-lg p-1.5 text-white">
                        <span className="material-symbols-outlined text-xl">quiz</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-primary dark:text-white leading-tight">Advanced Quiz Builder</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Course: Logic & Critical Thinking 101</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                        Preview
                    </button>
                    <Link href="/course-quiz-list">
                        <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 shadow-sm">Save Quiz</button>
                    </Link>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                {/* Left Sidebar: Question List */}
                <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Questions (12)</span>
                        <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">filter_list</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                        {/* Question Item Active */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/20 border-l-4 border-primary cursor-pointer">
                            <span className="material-symbols-outlined text-primary text-sm">drag_indicator</span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-primary dark:text-white">Q1: Basic Principles</p>
                                <p className="text-xs text-gray-500 truncate">Multiple Choice</p>
                            </div>
                            <span className="material-symbols-outlined text-accent-teal text-sm">check_circle</span>
                        </div>
                    </div>
                    {/* Add Question Button */}
                    <div className="p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
                        <button className="w-full bg-primary text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow">
                            <span className="material-symbols-outlined">add</span>
                            Add Question
                        </button>
                    </div>
                </aside>
                {/* Main Workspace: Question Editor */}
                <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Section Header */}
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-primary font-bold text-sm uppercase tracking-widest">Question Editor</span>
                                <h2 className="text-3xl font-bold text-text-main dark:text-white mt-1">Q1: Basic Principles</h2>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-primary bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    <span className="material-symbols-outlined">content_copy</span>
                                </button>
                            </div>
                        </div>
                        {/* Question Text Input */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Question Text</label>
                            <div className="relative">
                                <textarea className="w-full min-h-[120px] p-4 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-primary focus:border-primary text-text-main dark:text-gray-200 placeholder-gray-400" placeholder="Enter the main question context or prompt here..." />
                                <div className="absolute bottom-3 right-3 flex gap-2">
                                    <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">image</span>
                                    <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">link</span>
                                </div>
                            </div>
                        </div>
                        {/* Multiple Choice Options */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Multiple Choice Options</label>
                                <span className="text-xs text-gray-500">Toggle checkmark to mark as correct</span>
                            </div>
                            <div className="space-y-3">
                                {/* Option 1 */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative">
                                        <input className="w-full pl-4 pr-12 py-3 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-primary focus:border-primary text-sm dark:text-gray-200" type="text" defaultValue="The law of identity" />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="material-symbols-outlined text-accent-teal fill-[1]">check_circle</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500">
                                        <span className="material-symbols-outlined text-xl">close</span>
                                    </button>
                                </div>
                                <button className="mt-2 text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                    Add Answer Option
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
