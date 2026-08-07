import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReviewDetail from './pages/ReviewDetail';
import SharedReview from './pages/SharedReview';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/share/:id" element={<SharedReview />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
