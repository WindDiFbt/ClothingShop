import { useLocation } from 'react-router-dom';
import Header from './components/share/Header';
import Footer from './components/share/Footer';

const excludedPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/home'];
export default function Layout({ children }) {
    const location = useLocation();
    const isExcluded = excludedPaths.includes(location.pathname);
    if (isExcluded) return children;
    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
