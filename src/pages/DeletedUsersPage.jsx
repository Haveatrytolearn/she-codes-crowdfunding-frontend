import { useEffect, useMemo, useState } from "react";
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
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadDeletedUsers() {
            setIsLoading(true);
            setError("");

            try {
                const data = await getUsers(true, search);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadDeletedUsers();
    }, [isAdmin, navigate, search]);

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
                <mark className="deleted-users-highlight">{match}</mark>
                {after}
            </>
        );
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

                    <div className="deleted-users-search-row">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search deleted users by username, email, first name or last name"
                            className="deleted-users-search-input"
                        />

                        <button
                            type="button"
                            className="deleted-users-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="deleted-users-clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {search && (
                        <p className="deleted-users-search-info">
                            Found <strong>{filteredUsers.length}</strong>{" "}
                            {filteredUsers.length === 1 ? "user" : "users"} for{" "}
                            <strong>"{search}"</strong>
                        </p>
                    )}

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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{highlightMatch(user.username)}</td>
                                            <td>{highlightMatch(user.first_name)}</td>
                                            <td>{highlightMatch(user.last_name)}</td>
                                            <td>{highlightMatch(user.email)}</td>
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