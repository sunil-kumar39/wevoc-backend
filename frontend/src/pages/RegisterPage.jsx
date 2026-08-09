import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function RegisterPage({ onLogin }) {
    const { register } = useApp();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !fullname ||
            !email ||
            !username ||
            !password
        ) {
            setError("All fields are required");
            return;
        }


        if (!avatar) {
            setError("Avatar is required");
            return;
        }


        try {
            setLoading(true);

            await register({
                fullname,
                email,
                username,
                password,
                avatar,
                coverImage,
            });


            setSuccess(
                "Account created successfully. Please login."
            );


            // Clear form
            setFullname("");
            setEmail("");
            setUsername("");
            setPassword("");
            setAvatar(null);
            setCoverImage(null);


        } catch (error) {
            setError(
                error.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <h1>Create account</h1>
                    <p>Join the WeVoc community</p>
                </div>


                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}


                    <div className="form-group">
                        <label>Full name</label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullname}
                            onChange={(e) =>
                                setFullname(e.target.value)
                            }
                        />
                    </div>


                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            autoComplete="email"
                        />
                    </div>


                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="@username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            autoComplete="username"
                        />
                    </div>


                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="new-password"
                        />
                    </div>


                    <div className="form-group">
                        <label>Avatar</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setAvatar(
                                    e.target.files?.[0] || null
                                )
                            }
                        />
                    </div>


                    <div className="form-group">
                        <label>Cover image (optional)</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setCoverImage(
                                    e.target.files?.[0] || null
                                )
                            }
                        />
                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>

                </form>


                <div className="auth-footer">
                    <span>Already have an account?</span>

                    <button
                        type="button"
                        className="auth-link"
                        onClick={onLogin}
                    >
                        Login
                    </button>
                </div>

            </div>

        </div>
    );
}