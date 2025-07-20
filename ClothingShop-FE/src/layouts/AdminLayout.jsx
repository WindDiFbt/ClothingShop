import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../pages/admin/components/HeaderAdmin';
import SideBarAdmin from '../pages/admin/components/SideBarAdmin';

// Components
const Overlay = ({ isOpen, onClose }) => {
    return (
        <div 
            className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 lg:hidden ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        />
    );
};

const ScrollToTop = () => {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-5 z-50 rounded-full bg-primary p-2 text-white shadow-lg hover:bg-primary-dark"
        >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
};

const MainContainer = ({ children }) => {
    return <div className="relative min-h-screen">{children}</div>;
};

const ContentAnimation = ({ children }) => {
    return (
        <div className="animate-fade-in">
            {children}
        </div>
    );
};

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">
                <Overlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <ScrollToTop />

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <SideBarAdmin isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                    {/* END SIDEBAR */}

                    <div className={`main-content flex min-h-screen flex-col transition-all duration-300 ${
                        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
                    }`}>
                        {/* BEGIN TOP NAVBAR */}
                        <HeaderAdmin />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>
                            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
                                <Outlet />
                            </main>
                        </ContentAnimation>
                        {/* END CONTENT AREA */}
                    </div>

                </MainContainer>
            </div>
        </>
    );
};

export default AdminLayout; 