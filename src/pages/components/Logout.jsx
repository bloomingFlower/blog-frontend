import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Logout = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Logout processing
    sessionStorage.clear();
    setIsLoggedIn(false);

    // Redirect to the home page
    navigate("/", { replace: true });
  }, [navigate, setIsLoggedIn]);

  return null;
};

export default Logout;