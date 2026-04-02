import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getUsers from "../api/get-users";
import "./AdminUsersPage.css";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadUsers() {
            try {
                const data = await getUsers(false);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, [isAdmin, navigate]);

    function getUserStatus(user) {
        if (user.is_deleted) {
            return {
                label: "Deleted",
                badgeClass: "deleted",
            };
        }

        if (!user.is_active) {
            return {
                label: "Inactive",
                badgeClass: "inactive",
            };
        }

        return {
            label: "Active",
            badgeClass: "active",
        };
    }

    if (isLoading) {
        return <p className="admin-users-status-message">Loading users...</p>;
    }

    if (error) {
        return <p className="admin-users-status-message">Error: {error}</p>;
    }

    return (
        <main className="admin-users-page">
            <section className="admin-users-shell">
                <div className="admin-users-card">
                    <div className="admin-users-header">
                        <div>
                            <h1 className="admin-users-title">Users management</h1>
                            <p className="admin-users-subtitle">
                                View, edit, delete and restore user accounts.
                            </p>
                        </div>

                        <Link
                            to="/admin/users/deleted"
                            className="admin-users-deleted-link"
                        >
                            Deleted users
                        </Link>
                    </div>

                    <div className="admin-users-table-wrapper">
                        <table className="admin-users-table">
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
                                    users.map((user) => {
                                        const status = getUserStatus(user);

                                        return (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.username || "—"}</td>
                                                <td>{user.first_name || "—"}</td>
                                                <td>{user.last_name || "—"}</td>
                                                <td>{user.email || "—"}</td>
                                                <td>
                                                    <span
                                                        className={`admin-users-badge ${status.badgeClass}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`admin-users-badge ${
                                                            user.is_staff ? "admin" : "user"
                                                        }`}
                                                    >
                                                        {user.is_staff ? "Admin" : "User"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/admin/users/${user.id}`}
                                                        className="admin-users-action-link"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="admin-users-empty-cell">
                                            No users found.
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

export default AdminUsersPage;