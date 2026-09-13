import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { useAuth } from './AuthContext';

import LoginPage from './LoginPage';
import OAuth2Callback from './OAuth2Callback';

import Layout from './Layout';
import HomePage from './HomePage';
import NewAnalysisPage from './NewAnalysisPage';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';

function ProtectedRoute({
  children,
}) {

  const {
    isLoggedIn,
  } = useAuth();

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function App() {

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* OAUTH CALLBACK */}
      <Route
        path="/oauth2/callback"
        element={<OAuth2Callback />}
      />

      {/* PROTECTED APPLICATION */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<HomePage />}
        />

        <Route
          path="new-analysis"
          element={
            <NewAnalysisPage />
          }
        />

        <Route
          path="history"
          element={
            <HistoryPage />
          }
        />

        <Route
          path="profile"
          element={
            <ProfilePage />
          }
        />

      </Route>

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;