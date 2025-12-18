import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityDetail from "./components/ActivityDetail";
import LoginPage from "./pages/LoginPage";
import ActivitiesPage from "./pages/ActivitiesPage";

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <LoginPage onLogin={logIn} />
      ) : (
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />}/>
          <Route path="/activities/:id" element={<ActivityDetail />}/>
          <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>Welcome! Please Login.</div>} />
        </Routes>
      )}
    </Router>
  )
}

export default App