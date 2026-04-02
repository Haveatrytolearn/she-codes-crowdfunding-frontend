import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postLogin from "../api/post-login.js";
import "./LoginForm.css";

function LoginForm() {
    const navigate = useNavigate(); 

    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event) => {
        const { id, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        if (!credentials.username || !credentials.password) {
            setErrorMessage("Please enter username and password.");
            return;
        }

        try {
            const response = await postLogin(
                credentials.username,
                credentials.password
            );

            console.log("Login response:", response);

            window.localStorage.setItem("token", response.token);
            
            // Try different field names for user ID
            const userId = response.user_id || response.id || response.user?.id;
            if (!userId) {
                throw new Error("Backend didn't return user ID. Backend response: " + JSON.stringify(response));
            }
            
            window.localStorage.setItem("user_id", String(userId));
            window.localStorage.setItem("is_staff", String(response.is_staff));

            console.log("Saved:", {
            token: response.token,
            user_id: userId,
            is_staff: response.is_staff,
            });

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Login failed: " + error.message);
        }
    };


    return (
        <main className="login-form">
            <section className="login-shell">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                            className="form-field"
                            type="text" 
                            id="username" 
                            placeholder="Enter username"
                            onChange={handleChange}
                            value={credentials.username} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            className="form-field"
                            type="password" 
                            id="password" 
                            placeholder="Password" 
                            onChange={handleChange}
                            value={credentials.password}
                        />
                    </div>


                    {errorMessage && (
                        <p className="form-error" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <button type="submit" className="login-submit-button">
                        Log in
                    </button>
                </form>

                <div className="signup-row">
                    <p className="signup-text">
                        Don't have an account yet?
                    </p>
                    <Link to="/signup" className="signup-button">
                        Sign up
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default LoginForm;