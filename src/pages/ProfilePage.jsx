import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import putUpdateProfile from "../api/put-update-profile";
import deleteUser from "../api/delete-user";

function ProfilePage() {
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                if (!userId || !token) {
                    setErrorMessage("No user session. Please log in.");
                    setIsLoading(false);
                    return;
                }

                const url = `${import.meta.env.VITE_API_URL}/users/${userId}/`;
                console.log("Fetching from:", url);
                console.log("UserId:", userId);
                console.log("Token prefix:", token.substring(0, 20));

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(`Failed to fetch profile (${response.status}): ${errorData?.detail || response.statusText}`);
                }

                const data = await response.json();
                console.log("Profile from backend:", data);

                setProfileData({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    username: data.username || "",
                    email: data.email || "",
                    password: "",
                });
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading profile:", error);
                setErrorMessage("Failed to load profile: " + error.message);
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSaving(true);

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setErrorMessage("Session expired. Please log in again.");
            setIsSaving(false);
            return;
        }

        // Prepare data without password if it's empty
        const updateData = {
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            username: profileData.username,
            email: profileData.email,
        };

        // Only include password if it was changed
        if (profileData.password) {
            updateData.password = profileData.password;
        }

        putUpdateProfile(userId, updateData)
            .then((response) => {
                console.log("Profile updated:", response);
                setSuccessMessage("Changes saved successfully!");
                setIsSaving(false);

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            })
            .catch((err) => {
                console.error("Update error:", err);
                setErrorMessage(err.message || "Failed to save changes");
                setIsSaving(false);
            });
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
        window.location.reload();
    }

    function handleDeleteAccount() {
    setShowDeleteConfirm(true);
    }

    async function confirmDeleteAccount() {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                setErrorMessage("User session not found.");
                return;
            }

            await deleteUser(userId);

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Delete account error:", error);
            setErrorMessage(error.message || "Failed to delete account.");
            setShowDeleteConfirm(false);
        }
    }

    function cancelDeleteAccount() {
    setShowDeleteConfirm(false);
    }

    if (isLoading) {
        return (
            <main className="profile-page">
                <p>Loading profile...</p>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <section className="profile-shell">
                <div className="profile-topbar">
                    <h2>My profile</h2>
                </div>

                <section className="profile-card" aria-labelledby="profile-heading">
                    <h2 id="profile-heading" className="profile-heading">
                        Account information
                    </h2>

                    {successMessage && (
                        <p className="success-message" style={{ color: "green", marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#e8f5e9", borderRadius: "4px" }}>
                            ✓ {successMessage}
                        </p>
                    )}

                    {errorMessage && (
                        <p className="error-message" style={{ color: "red", marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#ffebee", borderRadius: "4px" }}>
                            ✗ {errorMessage}
                        </p>
                    )}

                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="profile-row">
                            <label htmlFor="first_name">First name:</label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={profileData.first_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-row">
                            <label htmlFor="last_name">Last name:</label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={profileData.last_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-row">
                            <label htmlFor="username">Username:</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={profileData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-row">
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-row">
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={profileData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="primary-action" disabled={isSaving}>
                                {isSaving ? "Saving..." : "Submit changes"}
                            </button>

                            <button
                                type="button"
                                className="secondary-action"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>

                            <button
                                type="button"
                                className="danger-action"
                                onClick={handleDeleteAccount}
                            >
                                Delete my account
                            </button>
                         </div>
                        {showDeleteConfirm && (
                            <div className="delete-confirm-box" role="alertdialog" aria-live="polite">
                                <p className="delete-confirm-text">
                                    Are you sure you want to delete your account?
                                </p>

                                <div className="delete-confirm-actions">
                                    <button
                                        type="button"
                                        className="confirm-delete-button"
                                        onClick={confirmDeleteAccount}
                                    >
                                        Yes, delete
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-delete-button"
                                        onClick={cancelDeleteAccount}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </section>
            </section>
        </main>
    );
}

export default ProfilePage;