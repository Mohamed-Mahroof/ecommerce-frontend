import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventdefault();
    setLoading(true);
    setError(null);

    axios
      .post("http://localhost:8080/api/auth/register", {
        name: name,
        email: email,
        password: password,
        role: role
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        toast.success("Signup Successfull");
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {
        setError("Password doesn't match...");
        setLoading(false);
      });
  };

  return (
    <div className="signupContainer">
      <div className="loginForm">
        {/* ---- Login Form ---- */}
        <h2>Signup</h2>

        <form onSubmit={handleRegister}>
          <div className="formGroup">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
            />
            <label htmlFor="name">name: </label>
          </div>
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
            {loading ? "Signing In..." : "SignUp"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
