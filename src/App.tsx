
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { TransactionProvider } from "@/contexts/TransactionProvider";
import AdminRoute from "@/components/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RoleProvider>
          <TransactionProvider>
            <BrowserRouter>
              <Routes>
                {/* Redirect root to admin login */}
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
                
                {/* Redirect old auth route to admin login */}
                <Route path="/auth" element={<Navigate to="/admin/login" replace />} />
                
                {/* Admin login (public access) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Admin panel (protected) */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                {/* Admin sub-routes (will be implemented later) */}
                <Route path="/admin/cards" element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                <Route path="/admin/transactions" element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                <Route path="/admin/users" element={
                  <AdminRoute requiredRoles={['super_admin', 'admin']}>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                <Route path="/admin/reports" element={
                  <AdminRoute requiredRoles={['super_admin', 'admin']}>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                <Route path="/admin/settings" element={
                  <AdminRoute requiredRoles={['super_admin', 'admin']}>
                    <AdminPanel />
                  </AdminRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TransactionProvider>
        </RoleProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
