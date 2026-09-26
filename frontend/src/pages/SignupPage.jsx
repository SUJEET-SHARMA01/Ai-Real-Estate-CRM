import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../store/authSlice";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(signup(form));
    if (signup.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-sub">Set up access to the CRM.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ramesh Gupta"
            />
          </div>
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
              minLength={8}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
