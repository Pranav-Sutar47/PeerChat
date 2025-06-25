import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SideBar } from "./components/build/Sidebar";
import Login from "./pages/Login";
import AppState from "./context/AppState";
import { useContext } from "react";
import AppContext from "./context/AppContext";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);
    if (!user) return <Navigate to="/" />;
    return children;
  };

  return (
    <AppState>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <SideBar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppState>
  );
}

export default App;
