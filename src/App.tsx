import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./landing_page/navbar/Navbar";
import KindredFooter from "./landing_page/footer/Footer";
import Index from "./landing_page/home/Index";
import FeaturesPage from "./landing_page/features/FeaturesPage";
import FAQPage from "./landing_page/FAQS/FAQSPage";
import AboutPage from "./landing_page/about/About";
import TermsPage from "./landing_page/policy/Terms";
import PrivacyPage from "./landing_page/policy/Privacy";
import NotFound from "./landing_page/policy/NotFound";
import AdminLogin from "./admin/AdminAuth";
import AdminDashboard from "./admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import FamilyManagement from "./admin/FamilyManagement";
import FinancialManagement from "./admin/FinancialManagement";
import AssetAuditPage from "./admin/AssetAuditPage";
import type { RootState } from "./redux/store";

const ProtectedAdminRoute = ({ children }: { children: any }) => {
  const { token } = useSelector((state: RootState) => state.admin);
  return token ? children : <Navigate to="/admin" replace />;
};

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer: number;

    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries++ < 30) {
        // the page may still be rendering after a route change
        timer = window.setTimeout(attempt, 50);
      }
    };

    attempt();
    return () => window.clearTimeout(timer);
  }, [pathname, hash, key]); // `key` changes on every click, even to the same hash

  return null;
}

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <main className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <UserManagement />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/families"
            element={
              <ProtectedAdminRoute>
                <FamilyManagement />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/finance"
            element={
              <ProtectedAdminRoute>
                <FinancialManagement />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/audit-viewer"
            element={
              <ProtectedAdminRoute>
                <AssetAuditPage />
              </ProtectedAdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPath && <KindredFooter />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
