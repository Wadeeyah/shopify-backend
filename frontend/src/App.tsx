import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';
import Auth from './pages/Auth';
import AdminLogin from './pages/AdminLogin';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlogContainer from './pages/BlogContainer';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import ScrollToTop from './components/ScrollToTop';
import VerifyGate from './pages/VerifyGate';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/verify" element={<VerifyGate />} />
                    <Route path="/system-access" element={<AdminLogin />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/dashboard/*" element={<ClientDashboard />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    <Route path="/blog" element={<BlogContainer />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/about-us" element={<AboutUs />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
