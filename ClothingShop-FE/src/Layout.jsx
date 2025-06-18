import { useLocation, Outlet } from 'react-router-dom';
import Header from './components/share/Header';
import Footer from './components/share/Footer';

const excludedPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/home'];
export default function Layout() {
    const location = useLocation();
    const isExcluded = excludedPaths.includes(location.pathname);
    if (isExcluded) return <Outlet />;
    return (
        <>
            <Header />
            <main className="min-h-screen pt-16">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
