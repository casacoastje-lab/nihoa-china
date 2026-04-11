import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import BlogEdit from './pages/BlogEdit';
import MapPage from './pages/Map';
import Learn from './pages/Learn';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SupabaseDemo from './pages/SupabaseDemo';
import { Toaster } from './components/ui/sonner';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  
  if (role === 'admin' && profile?.role !== 'admin') return <Navigate to="/" />;
  if (role === 'blogger' && profile?.role !== 'blogger' && profile?.role !== 'admin') return <Navigate to="/" />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/supabase-demo" element={<SupabaseDemo />} />
        
        <Route path="/blog/new" element={
          <ProtectedRoute role="blogger">
            <BlogEdit />
          </ProtectedRoute>
        } />
        
        <Route path="/blog/edit/:id" element={
          <ProtectedRoute role="blogger">
            <BlogEdit />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
