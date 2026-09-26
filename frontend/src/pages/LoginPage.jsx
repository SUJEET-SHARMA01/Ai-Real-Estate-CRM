import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-sub">Sign in to log today's client interactions.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@agency.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
