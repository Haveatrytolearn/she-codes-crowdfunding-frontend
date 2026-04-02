import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getUsers from "../api/get-users";
import restoreUser from "../api/restore-user";
import "./DeletedUsersPage.css";

function DeletedUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [restoringUserId, setRestoringUserId] = useState(null);

    const navigate = useNavigate();
    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadDeletedUsers() {
            try {
                const data = await getUsers(true);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadDeletedUsers();
    }, [isAdmin, navigate]);

    async function handleRestore(userId) {
        setError("");
        setActionMessage("");
        setRestoringUserId(userId);

        try {
            await restoreUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            setActionMessage("User restored successfully.");
        } catch (err) {
            setError(err.message);
        } finally {
            setRestoringUserId(null);
        }
    }

    if (isLoading) {
        return <p className="deleted-users-status-message">Loading deleted users...</p>;
    }

    return (
        <main className="deleted-users-page">
            <section className="deleted-users-shell">
                <div className="deleted-users-card">
                    <div className="deleted-users-header">
                        <div>
                            <h1 className="deleted-users-title">Deleted users</h1>
                            <p className="deleted-users-subtitle">
                                Restore deleted user accounts and their related data.
                            </p>
                        </div>

                        <Link to="/admin/users" className="deleted-users-back-link">
                            Back to users
                        </Link>
                    </div>

                    {error && (
                        <p className="deleted-users-status-message error">
                            Error: {error}
                        </p>
                    )}

                    {actionMessage && (
                        <p className="deleted-users-status-message success">
                            {actionMessage}
                        </p>
                    )}

                    <div className="deleted-users-table-wrapper">
                        <table className="deleted-users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username || "—"}</td>
                                            <td>{user.first_name || "—"}</td>
                                            <td>{user.last_name || "—"}</td>
                                            <td>{user.email || "—"}</td>
                                            <td>
                                                <span className="deleted-users-badge inactive">
                                                    Inactive
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`deleted-users-badge ${
                                                        user.is_staff ? "admin" : "user"
                                                    }`}
                                                >
                                                    {user.is_staff ? "Admin" : "User"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="deleted-users-restore-button"
                                                    onClick={() => handleRestore(user.id)}
                                                    disabled={restoringUserId === user.id}
                                                >
                                                    {restoringUserId === user.id
                                                        ? "Restoring..."
                                                        : "Restore"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="deleted-users-empty-cell">
                                            No deleted users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default DeletedUsersPage;