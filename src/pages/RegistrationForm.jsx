import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegistrationForm.css";
import postRegister from "../api/post-register";
import Modal from "../components/Modal";

function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate all fields are filled
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setIsLoading(true);

        postRegister(
            formData.first_name,
            formData.last_name,
            formData.email,
            formData.password
        )
             .then(() => {
                setShowSuccessModal(true);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function handleSuccessConfirm() {
        setShowSuccessModal(false);
        navigate("/login");
    }

    return (
        <main className="registration-page">
            <section className="registration-shell">
                <h2 className="registration-title">Registration form</h2>

                {error && <p className="form-error">{error}</p>}

                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="first_name">First name:</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last name:</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="login-row">
                    <p className="login-link-text">
                        Already have an account?
                    </p> 
                    <Link to="/login" className="login-button">
                            Log in
                    </Link>  
                </div>
            </section>

            <Modal
                isOpen={showSuccessModal}
                type="success"
                title="Registration successful"
                message={[
                    "Your account has been created successfully.",
                    "Please log in.",
                ]}
                confirmText="Go to login"
                onConfirm={handleSuccessConfirm}
                onClose={() => setShowSuccessModal(false)}
            />
        </main>
    );
}

export default RegistrationForm;