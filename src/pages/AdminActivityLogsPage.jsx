import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import getActivityLogs from "../api/get-activity-logs";
import "./AdminActivityLogsPage.css";

function AdminActivityLogsPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [logTypeFilter, setLogTypeFilter] = useState("all");

    const navigate = useNavigate();
    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadLogs() {
            setIsLoading(true);
            setError("");

            try {
                const data = await getActivityLogs(search);
                setLogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadLogs();
    }, [isAdmin, navigate, search]);

    function handleSearch() {
        setSearch(searchInput.trim());
    }

    function handleClear() {
        setSearchInput("");
        setSearch("");
        setLogTypeFilter("all");
    }

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const matchesSearch =
                !search ||
                String(log.entity_label || "").toLowerCase().includes(search.toLowerCase()) ||
                String(log.changed_by || "").toLowerCase().includes(search.toLowerCase()) ||
                String(log.field_name || "").toLowerCase().includes(search.toLowerCase()) ||
                String(log.old_value || "").toLowerCase().includes(search.toLowerCase()) ||
                String(log.new_value || "").toLowerCase().includes(search.toLowerCase()) ||
                String(log.log_type || "").toLowerCase().includes(search.toLowerCase());

            const matchesType =
                logTypeFilter === "all" || log.log_type === logTypeFilter;

            return matchesSearch && matchesType;
        });
    }, [logs, search, logTypeFilter]);

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
                <mark className="admin-logs-highlight">{match}</mark>
                {after}
            </>
        );
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    if (isLoading) {
        return <p className="admin-logs-status-message">Loading activity logs...</p>;
    }

    if (error) {
        return <p className="admin-logs-status-message">Error: {error}</p>;
    }

    return (
        <main className="admin-logs-page">
            <section className="admin-logs-shell">
                <div className="admin-logs-card">
                    <div className="admin-logs-header">
                        <div>
                            <h1 className="admin-logs-title">Activity logs</h1>
                            <p className="admin-logs-subtitle">
                                View all admin-visible user and fundraiser changes.
                            </p>
                        </div>
                    </div>

                    <div className="admin-logs-search-row">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search by type, entity, field, old value, new value, or changed by"
                            className="admin-logs-search-input"
                        />

                        <select
                            className="admin-logs-filter-select"
                            value={logTypeFilter}
                            onChange={(event) => setLogTypeFilter(event.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="user">User</option>
                            <option value="fundraiser">Fundraiser</option>
                        </select>

                        <button
                            type="button"
                            className="admin-logs-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="admin-logs-clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {(search || logTypeFilter !== "all") && (
                        <p className="admin-logs-search-info">
                            Found <strong>{filteredLogs.length}</strong>{" "}
                            {filteredLogs.length === 1 ? "log" : "logs"}
                            {search && (
                                <>
                                    {" "}for <strong>"{search}"</strong>
                                </>
                            )}
                            {logTypeFilter !== "all" && (
                                <>
                                    {" "}in <strong>{logTypeFilter}</strong>
                                </>
                            )}
                        </p>
                    )}

                    <div className="admin-logs-table-wrapper">
                        <table className="admin-logs-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Entity</th>
                                    <th>Changed by</th>
                                    <th>Field</th>
                                    <th>Old value</th>
                                    <th>New value</th>
                                    <th>Changed at</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td>
                                                <span
                                                    className={`admin-logs-badge ${
                                                        log.log_type === "user"
                                                            ? "user"
                                                            : "fundraiser"
                                                    }`}
                                                >
                                                    {log.log_type === "user" ? "User" : "Fundraiser"}
                                                </span>
                                            </td>
                                            <td title={log.entity_label}>
                                                {highlightMatch(log.entity_label)}
                                            </td>
                                            <td title={log.changed_by}>
                                                {highlightMatch(log.changed_by)}
                                            </td>
                                            <td title={log.field_name}>
                                                {highlightMatch(log.field_name)}
                                            </td>
                                            <td title={log.old_value || ""}>
                                                {highlightMatch(log.old_value)}
                                            </td>
                                            <td title={log.new_value || ""}>
                                                {highlightMatch(log.new_value)}
                                            </td>
                                            <td>{formatDate(log.changed_at)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="admin-logs-empty-cell">
                                            No logs found.
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

export default AdminActivityLogsPage;