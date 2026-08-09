
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginPage({ onRegister }) {
    const { login } = useApp();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            await login({
                email,
                password,
            });

        } catch (error) {
            setError(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        🎙
                    </div>

                    <div className="auth-logo-wordmark">
                        We<span>Voc</span>
                    </div>
                </div>


                {/* Header */}
                <div className="auth-header">
                    <h1>Welcome back</h1>

                    <p>
                        Login to your WeVoc account
                    </p>
                </div>


                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    {/* Error */}
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    {/* Email */}
                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />

                    </div>


                    {/* Password */}
                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />

                    </div>


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"
                        }
                    </button>

                </form>


                {/* Register */}
                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        className="auth-link"
                        onClick={onRegister}
                    >
                        Create account
                    </button>

                </div>

            </div>

        </div>
    );
}
