import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  // For demo purposes, we'll skip auth and go directly to the main app
  // In production, you would check authentication state here
  const isAuthenticated = true;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Index /> : <Navigate to="/auth" replace />}
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
};

export default App;
