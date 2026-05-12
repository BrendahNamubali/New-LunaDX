import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import PatientsPage from "./pages/PatientsPage";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import PatientRecordPage from "./pages/PatientRecordPage";
import DemoCasesPage from "./pages/DemoCasesPage";
import SharedReportPage from "./pages/SharedReportPage";
import BillingPage from "./pages/BillingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div style={{ padding: 20, color: "black" }}>HOME TEST</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report/:scanId" element={<SharedReportPage />} />

          <Route
  path="/dashboard"
  element={<div style={{ padding: 20, color: "black" }}>LAYOUT TEST WORKS</div>}
/>
            <Route path="/dashboard" element={<AnalyticsDashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:patientId" element={<PatientRecordPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results/:scanId" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/demo" element={<DemoCasesPage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
