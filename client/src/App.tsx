import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { DashboardLayout } from './components/layout/DashboardLayout.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';
import { Toaster } from 'react-hot-toast';
import { GeminiChatWidget } from './components/chat/GeminiChatWidget.js';

// Public Pages
import { HomePage } from './pages/public/HomePage.js';
import { TechnologyPage } from './pages/public/TechnologyPage.js';
import { HowItWorksPage } from './pages/public/HowItWorksPage.js';
import { EstimatePage } from './pages/public/EstimatePage.js';
import { ContactPage } from './pages/public/ContactPage.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { PrivacyPage } from './pages/public/PrivacyPage.js';
import { TermsPage } from './pages/public/TermsPage.js';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage.js';
import { RegisterPage } from './pages/auth/RegisterPage.js';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.js';

// Dashboard Pages
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage.js';
import { BuildingsPage } from './pages/dashboard/BuildingsPage.js';
import { ProjectsPage } from './pages/dashboard/ProjectsPage.js';
import { EstimatesPage } from './pages/dashboard/EstimatesPage.js';
import { AiAdvisorPage } from './pages/dashboard/AiAdvisorPage.js';
import { ProfilePage } from './pages/dashboard/ProfilePage.js';

// Scroll to top helper on route transitions
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Shell for public routes including Navbar and Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0D1B2E',
                color: '#F4F8FF',
                border: '1px solid rgba(119, 190, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '13px'
              },
              success: {
                iconTheme: {
                  primary: '#27E5A2',
                  secondary: '#050B16'
                }
              },
              error: {
                iconTheme: {
                  primary: '#FF647C',
                  secondary: '#050B16'
                }
              }
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/technology" element={<PublicLayout><TechnologyPage /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
            <Route path="/estimate" element={<PublicLayout><EstimatePage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Enterprise Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardOverviewPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/buildings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BuildingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/projects"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProjectsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/estimates"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EstimatesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/ai-advisor"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AiAdvisorPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>

          {/* Floating Google Gemini AI Assistant Widget */}
          <GeminiChatWidget />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};
export default App;
