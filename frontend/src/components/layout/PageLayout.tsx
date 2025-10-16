import React, { useEffect } from 'react'
import Navbar2 from '../Navbar2'
import Sidebar from './Sidebar'
import NoticeBanner from '../NoticeBanner'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'
import { useLocation } from 'react-router-dom'

interface PageLayoutProps {
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full'
}

const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, maxWidth = '6xl' }) => {
    const { user } = useAuth();
    const { notifications } = useNotifications({ per_page: 5, unread_only: true });
    const location = useLocation();

    // Force component refresh on route change
    useEffect(() => {
        console.log('🔄 Route changed to:', location.pathname);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#061018_0%,#071018_60%)] text-white" key={location.key}>
            <NoticeBanner />
            <Navbar2
                user={user || undefined}
                notifications={notifications.map((n: any) => ({
                    id: n.id || n._id,
                    title: n.title,
                    body: n.body || n.message || '',
                    date: n.date || n.created_at || new Date().toISOString(),
                    read: n.read || n.is_read || false,
                }))}
            />
            <div className="flex">
                <Sidebar />
                <main className={`flex-1 ${maxWidthClasses[maxWidth]} mx-auto px-6 py-8`}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default PageLayout

