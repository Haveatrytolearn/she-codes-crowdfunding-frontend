import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getUsers from "../api/get-users";
import "./AdminUsersPage.css";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadUsers() {
            setIsLoading(true);
            setError("");

            try {
                const data = await getUsers(false, search);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, [isAdmin, navigate, search]);

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

    function handleSearch() {
        setSearch(searchInput.trim());
    }

    function handleClear() {
        setSearchInput("");
        setSearch("");
    }

    function userMatchesSearch(user, searchTerm) {
        if (!searchTerm) return true;

        const normalizedSearch = searchTerm.toLowerCase();

        const searchableFields = [
            user.username,
            user.first_name,
            user.last_name,
            user.email,
        ];

        return searchableFields.some((field) =>
            String(field || "").toLowerCase().includes(normalizedSearch)
        );
    }

    const filteredUsers = useMemo(() => {
        return users.filter((user) => userMatchesSearch(user, search));
    }, [users, search]);

    function highlightMatch(text) {
        if (!text) return "—";
        if (!search) return text;

        const safeText = String(text);
        const lowerText = safeText.toLowerCase();
        const lowerSearch = search.toLowerCase();

        const matchIndex = lowerText.indexOf(lowerSearch);

        if (matchIndex === -1) {
            return safeText;
        }

        const before = safeText.slice(0, matchIndex);
        const match = safeText.slice(matchIndex, matchIndex + search.length);
        const after = safeText.slice(matchIndex + search.length);

        return (
            <>
                {before}
                <mark className="admin-users-highlight">{match}</mark>
                {after}
            </>
        );
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

                    <div className="admin-users-search-row">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search by username, email, first name or last name"
                            className="admin-users-search-input"
                        />

                        <button
                            type="button"
                            className="admin-users-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="admin-users-clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {search && (
                        <p className="admin-users-search-info">
                            Found <strong>{filteredUsers.length}</strong>{" "}
                            {filteredUsers.length === 1 ? "user" : "users"} for{" "}
                            <strong>"{search}"</strong>
                        </p>
                    )}

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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => {
                                        const status = getUserStatus(user);

                                        return (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{highlightMatch(user.username)}</td>
                                                <td>{highlightMatch(user.first_name)}</td>
                                                <td>{highlightMatch(user.last_name)}</td>
                                                <td>{highlightMatch(user.email)}</td>
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