import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Login logic here
    axios
      .post("http://localhost:8080/api/auth/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log("Login response: ", res.data);
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successfull");
        window.location.href = "/products";                 // Full Reload, not Navigate
        console.log(res);
      })
      .catch((err) => {
        setError("Login failed. Please check your credentials.");
        toast.error("Invalid Email or Password");
        setLoading(false);
      });
  };

  return (
    <div className="loginContainer">
      <div className="loginForm">
        {/* ---- Login Form ---- */}
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="formGroup">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
            <label htmlFor="email">email: </label>
          </div>
          <div className="formGroup">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
            <label htmlFor="password">Password: </label>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button id="logInBtn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
