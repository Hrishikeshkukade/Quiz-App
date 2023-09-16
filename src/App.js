import "./App.css";
import { BrowserRouter as Main, Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import NavBar from "./UI/Navbar";
import Register from "./Components/Register";
import Signin from "./Components/Signin";
import Dashboard from "./Components/Dashboard";
import ForgotPassword from "./Components/ForgotPassword";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "./Components/Profile";
import About from "./Components/About";
import Reviews from "./Components/Reviews";

function App() {
  const [user, setUser] = useState(null);



  const isAuthenticated = () => {
    return !!auth.currentUser; // Check if there is a currently authenticated user
  };
  const ProtectedRoute = ({ element }) => {
    if (isAuthenticated()) {
      return element;
    } else {
      // Redirect to the sign-in page or any other route as needed
      return <Navigate to="/signin" />;
    }
  };
    useEffect(() => {
    // Check the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is not authenticated, redirect to the sign-in page
        // navigate("/signin");
        setUser(user)
      }
      else{ 
        setUser(null);
      }
    });

    return () => {
      unsubscribe(); // Clean up the listener
    };
  }, []);
  return (
    <Main>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        {user ?  <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        /> : <Route exact path="/signin" element={<Signin />} />}
           {user ?  <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        /> : <Route exact path="/signin" element={<Signin />} />}
        
        {/* <Route exact path="/dashboard" element={<Dashboard />}/> */}
        <Route exact path="/fp" element={<ForgotPassword />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/reviews" element={<Reviews />} />
      </Routes>
    </Main>
    // {/* <Route path="/" exact>
    //     <Home />
    //   </Route>
    //   <Route path="/register">
    //     <Register />
    //   </Route> */}

    // {/* <Button variant="dark">Primary</Button> */}
  );
}

export default App;
