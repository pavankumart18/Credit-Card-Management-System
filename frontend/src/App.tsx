import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import Dashboard from "./pages/Dashboard";
import AddCard from "./pages/AddCard";
import CardDetails from "./pages/CardDetails";
import BillPayments from "./pages/BillPayments";
import CardBlock from "./pages/CardBlock";
import PinManagement from "./pages/PinManagement";
import CibilScore from "./pages/CibilScore";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import TransactionsPage from './pages/TransactionsPage'
import RedeemsPage from './pages/RedeemsPage'
import EmiManagerPage from './pages/EmiManagerPage'
import SpendingAnalyticsPage from './pages/SpendingAnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import OffersPage from './pages/OffersPage'
import NotificationsPage from './pages/NotificationsPage'
import StatementsPage from './pages/StatementsPage'
import ApplyEmiPage from './pages/ApplyEmi'
import MyCardsPage from './pages/MyCards'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    console.log('🔄 AppRoutes - Location changed:', location.pathname);
  }, [location.pathname]);

  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute key={location.pathname}><Dashboard /></ProtectedRoute>} />
      <Route path="/add-card" element={<ProtectedRoute key={location.pathname}><AddCard /></ProtectedRoute>} />
      <Route path="/card/:id" element={<ProtectedRoute key={location.pathname}><CardDetails /></ProtectedRoute>} />
      <Route path="/bill-payments" element={<ProtectedRoute key={location.pathname}><BillPayments /></ProtectedRoute>} />
      <Route path="/card-block" element={<ProtectedRoute key={location.pathname}><CardBlock /></ProtectedRoute>} />
      <Route path="/pin-management" element={<ProtectedRoute key={location.pathname}><PinManagement /></ProtectedRoute>} />
      <Route path="/cibil-score" element={<ProtectedRoute key={location.pathname}><CibilScore /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute key={location.pathname}><Profile /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute key={location.pathname}><Support /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute key={location.pathname}><TransactionsPage /></ProtectedRoute>} />
      <Route path="/redeems" element={<ProtectedRoute key={location.pathname}><RedeemsPage /></ProtectedRoute>} />
      <Route path="/emi" element={<ProtectedRoute key={location.pathname}><EmiManagerPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute key={location.pathname}><SpendingAnalyticsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute key={location.pathname}><SettingsPage /></ProtectedRoute>} />
      <Route path="/offers" element={<ProtectedRoute key={location.pathname}><OffersPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute key={location.pathname}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/statements" element={<ProtectedRoute key={location.pathname}><StatementsPage /></ProtectedRoute>} />
      <Route path="/apply-emi" element={<ProtectedRoute key={location.pathname}><ApplyEmiPage /></ProtectedRoute>} />
      <Route path="/cards" element={<ProtectedRoute key={location.pathname}><MyCardsPage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App