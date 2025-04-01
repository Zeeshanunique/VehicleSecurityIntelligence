import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthGuard } from "@/components/AuthGuard";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/dashboard/page";
import Login from "@/pages/login/page";
import AlertsPage from "@/pages/alerts/page";
import LicensePlateScannerPage from "@/pages/license-plate-scanner/page";
import FacialRecognitionPage from "@/pages/facial-recognition/page";
import AccidentDetectionPage from "@/pages/accident-detection/page";
import ReportsHistoryPage from "@/pages/reports-history/page";
import AdminPage from "@/pages/admin/page";

export default function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vsi-theme">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/vehicles/*" 
              element={<div>Vehicles Page - Implement Specific Routes</div>}
            />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/license-plate-scanner" element={<LicensePlateScannerPage />} />
            <Route path="/facial-recognition" element={<FacialRecognitionPage />} />
            <Route path="/accident-detection" element={<AccidentDetectionPage />} />
            <Route path="/reports-history" element={<ReportsHistoryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
}
