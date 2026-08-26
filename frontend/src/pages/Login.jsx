import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const data = await login(email, password);

            const token = data.token;

            localStorage.setItem("token", token);

            // Decode JWT payload
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const role = payload.role;

            setMessage("Login successful!");

            if (role === "RECRUITER") {

                navigate("/recruiter");

            } else if (role === "CANDIDATE") {

                navigate("/candidate");

            } else if (role === "ADMIN") {

                // Admin dashboard will be added later
                navigate("/");

            } else {

                setMessage("Unknown user role");

            }

        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>ATS Platform</h1>

                <h2>Welcome Back</h2>

                <p>Login to your account</p>

                <form onSubmit={handleLogin}>

                    <div>

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div>

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {message && (
                    <p>{message}</p>
                )}

                <p>
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;