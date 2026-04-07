import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getUser from "../api/get-user";
import updateUser from "../api/put-user";
import deleteUser from "../api/delete-user";
import Modal from "../components/Modal";

import "./AdminUserEditPage.css";

function AdminUserEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_active: true,
        is_staff: false,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadUser() {
            try {
                const data = await getUser(id);
                setUser(data);

                setFormData({
                    username: data.username || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [id, isAdmin, navigate]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSaving(true);

        try {
            const updated = await updateUser(id, formData);
            setUser(updated);
            setSuccess("User updated successfully");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    }

    function handleDeleteClick() {
        setError("");
        setShowDeleteModal(true);
    }

    function handleCloseDeleteModal() {
        if (!isDeleting) {
            setShowDeleteModal(false);
        }
    }

    async function handleConfirmDelete() {
        setError("");
        setIsDeleting(true);

        try {
            await deleteUser(id);
            setShowDeleteModal(false);
            navigate("/admin/users");
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return <p className="admin-user-status">Loading...</p>;
    }

    if (error && !user) {
        return <p className="admin-user-status">Error: {error}</p>;
    }

    return (
        <main className="admin-user-page">
            <div className="admin-user-card">
                <div className="admin-user-header">
                    <button
                        className="admin-user-back-button"
                        onClick={() => navigate("/admin/users")}
                    >
                        ← Back to users
                    </button>
                </div>

                <h1>Edit user</h1>

                {success && <p className="admin-user-success">{success}</p>}
                {error && <p className="admin-user-error">{error}</p>}

                <form onSubmit={handleSubmit} className="admin-user-form">
                    <label>
                        Username
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        First name
                        <input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Last name
                        <input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Email
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="admin-user-checkbox-row">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                        />
                        Active
                    </label>

                    <div className="admin-user-buttons">
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save changes"}
                        </button>

                        <button
                            type="button"
                            className="delete"
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                        >
                            Delete user
                        </button>
                    </div>
                </form>

                {user.change_logs && user.change_logs.length > 0 && (
                    <div className="admin-user-logs">
                        <h2>Change history</h2>
                        <ul>
                            {user.change_logs.map((log) => (
                                <li key={log.id}>
                                    <strong>{log.field_name}</strong>: "{log.old_value}" → "{log.new_value}"
                                    <br />
                                    <em>
                                        by {log.changed_by_username} at{" "}
                                        {new Date(log.changed_at).toLocaleString()}
                                    </em>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showDeleteModal}
                type="warning"
                title="Delete user?"
                message={[
                    "Are you sure you want to delete this user?",
                    "The account can be restored by a site administrator if necessary.",
                ]}
                confirmText={isDeleting ? "Deleting..." : "Yes, delete"}
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
                onClose={handleCloseDeleteModal}
                isProcessing={isDeleting}
            />
        </main>
    );
}

export default AdminUserEditPage;