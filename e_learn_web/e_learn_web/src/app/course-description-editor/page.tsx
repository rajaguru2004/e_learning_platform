'use client';

import React from 'react';
import Link from 'next/link';

export default function CourseDescriptionEditor() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#120f1a] dark:text-gray-100 min-h-screen">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Top Navigation Bar */}
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1926] px-6 lg:px-10 py-3 sticky top-0 z-50">
                        <div className="flex items-center gap-4">
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        clipRule="evenodd"
                                        d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                    <path
                                        clipRule="evenodd"
                                        d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Panel</h2>
                                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em]">Advanced UI/UX Design Masterclass</h1>
                            </div>
                        </div>
                        <div className="flex flex-1 justify-end gap-4 items-center">
                            <span className="hidden md:block text-xs text-gray-400 font-medium italic">Last saved at 12:45 PM</span>
                            <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                                <span>Save Changes</span>
                            </button>
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQDa9yx_Q2jssPEdYCUrptBWIQDlZ-wNhJ_ktpw7vPQA2Qn_DCgUM2ueNjAMaVQnU2mRqWykSJnJ_9By1djMCJ6Nib1ceUHkq6hewx-AiZ1dtRCXZJGJ63VyxSJgRnJw-CCbmUonxJ_5JzHzsOTqrfC-lAE50Cm20dmykwXVhQJM4dtPMhQp9fk-lA8RCcnz7plGUhHyWGBjSNKexxsy530ljBOUorOK87l-NKCU07suzeCW_5qYTZfvo8-2K_iTSNTAdAeflbzt0")',
                                }}
                            />
                        </div>
                    </header>
                    {/* Main Content Container */}
                    <main className="flex flex-1 justify-center py-8">
                        <div className="layout-content-container flex flex-col w-full max-w-[1024px] px-6">
                            {/* Sub-navigation Tabs */}
                            <nav className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto">
                                <a className="flex items-center justify-center border-b-[3px] border-primary text-primary px-4 pb-3 pt-2 whitespace-nowrap" href="#">
                                    <span className="text-sm font-bold leading-normal">Course Description</span>
                                </a>
                                <Link className="flex items-center justify-center border-b-[3px] border-transparent text-gray-500 hover:text-primary dark:text-gray-400 px-6 pb-3 pt-2 whitespace-nowrap transition-all" href="/course-editor">
                                    <span className="text-sm font-medium leading-normal">Curriculum</span>
                                </Link>
                                <a className="flex items-center justify-center border-b-[3px] border-transparent text-gray-500 hover:text-primary dark:text-gray-400 px-6 pb-3 pt-2 whitespace-nowrap transition-all" href="#">
                                    <span className="text-sm font-medium leading-normal">Pricing</span>
                                </a>
                                <a className="flex items-center justify-center border-b-[3px] border-transparent text-gray-500 hover:text-primary dark:text-gray-400 px-6 pb-3 pt-2 whitespace-nowrap transition-all" href="#">
                                    <span className="text-sm font-medium leading-normal">Settings</span>
                                </a>
                            </nav>
                            {/* Page Title */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[#2e2e2e] dark:text-white text-2xl font-bold leading-tight">Course Description</h2>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        <span className="size-1.5 rounded-full bg-green-500 mr-1.5" />
                                        Live on Site
                                    </span>
                                </div>
                            </div>
                            {/* Editor Interface Container */}
                            <div className="flex flex-col bg-white dark:bg-[#1c1926] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                {/* Toolbar */}
                                <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-[#252132] border-b border-gray-200 dark:border-gray-800">
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Bold">
                                        <span className="material-symbols-outlined text-[20px]">format_bold</span>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Italic">
                                        <span className="material-symbols-outlined text-[20px]">format_italic</span>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Underline">
                                        <span className="material-symbols-outlined text-[20px]">format_underlined</span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Bulleted List">
                                        <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Numbered List">
                                        <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Insert Link">
                                        <span className="material-symbols-outlined text-[20px]">link</span>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Insert Image">
                                        <span className="material-symbols-outlined text-[20px]">image</span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
                                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300" title="Clear Formatting">
                                        <span className="material-symbols-outlined text-[20px]">format_clear</span>
                                    </button>
                                </div>
                                {/* Editor Content Area */}
                                <div className="flex flex-col min-h-[500px] p-6 lg:p-10 relative">
                                    <textarea
                                        className="w-full h-full min-h-[450px] border-none focus:ring-0 p-0 text-[#120f1a] dark:text-gray-200 text-lg leading-relaxed placeholder:text-gray-400 dark:bg-transparent resize-none"
                                        placeholder="Start writing your course description here... Use rich formatting to make it stand out."
                                    />
                                    {/* Bottom Editor Bar */}
                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50">
                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                            <span>1,245 characters</span>
                                            <span>218 words</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-primary font-semibold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                All changes saved
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* SEO & Preview Section */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-white dark:bg-[#1c1926] border border-gray-200 dark:border-gray-800 rounded-lg">
                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">visibility</span>
                                        Storefront Preview
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        This is how the first few lines of your description will appear in search results.
                                    </p>
                                    <div className="p-3 bg-gray-50 dark:bg-[#252132] rounded border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-xs text-[#120f1a] dark:text-gray-300 line-clamp-2">
                                            Learn the fundamental principles of UI/UX design and master the tools used by industry professionals. This masterclass covers
                                            everything from user research to advanced prototyping...
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white dark:bg-[#1c1926] border border-gray-200 dark:border-gray-800 rounded-lg">
                                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">tips_and_updates</span>
                                        Writing Tips
                                    </h4>
                                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Focus on student outcomes and benefits.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Use bullet points for better readability.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary font-bold">•</span>
                                            Include a clear &quot;Who this course is for&quot; section.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main>
                    {/* Footer Meta Info */}
                    <footer className="px-10 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-center">
                        <p className="text-xs text-gray-400 font-medium">© 2024 CourseAdmin Pro • Version 4.2.0-stable</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
