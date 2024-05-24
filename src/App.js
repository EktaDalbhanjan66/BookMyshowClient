import "./App.css";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleMovie from "./pages/SingleMovie";
import BookShow from "./pages/BookShow";

export const config = {
  endpoint: "https://bookmyshowserver-4lsh.onrender.com/api",
};

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <div className="App">
      {loading && (
        <div className="loader-container">
          {" "}
          <div className="loader"> </div>{" "}
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <SingleMovie />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-show/:id"
          element={
            <ProtectedRoute>
              <BookShow/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
