import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getFundraisers from "../api/get-deletedfundraisers";
import restoreFundraiser from "../api/restore-fundraiser";
import "./DeletedFundraisersPage.css";

function DeletedFundraisersPage() {
    const [fundraisers, setFundraisers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [restoringFundraiserId, setRestoringFundraiserId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadDeletedFundraisers() {
            setIsLoading(true);
            setError("");

            try {
                const data = await getFundraisers(true, search);
                setFundraisers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadDeletedFundraisers();
    }, [isAdmin, navigate, search]);

    function handleSearch() {
        setSearch(searchInput.trim());
    }

    function handleClear() {
        setSearchInput("");
        setSearch("");
    }

    async function handleRestore(fundraiserId) {
        setError("");
        setActionMessage("");
        setRestoringFundraiserId(fundraiserId);

        try {
            await restoreFundraiser(fundraiserId);
            setFundraisers((prev) =>
                prev.filter((fundraiser) => fundraiser.id !== fundraiserId)
            );
            setActionMessage("Fundraiser restored successfully.");
        } catch (err) {
            setError(err.message);
        } finally {
            setRestoringFundraiserId(null);
        }
    }

    function fundraiserMatchesSearch(fundraiser, searchTerm) {
        if (!searchTerm) return true;

        const normalizedSearch = searchTerm.toLowerCase();

        const searchableFields = [
            fundraiser.title,
            fundraiser.description,
            fundraiser.owner_username,
        ];

        return searchableFields.some((field) =>
            String(field || "").toLowerCase().includes(normalizedSearch)
        );
    }

    const filteredFundraisers = useMemo(() => {
        return fundraisers.filter((fundraiser) =>
            fundraiserMatchesSearch(fundraiser, search)
        );
    }, [fundraisers, search]);

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
                <mark className="deleted-fundraisers-highlight">{match}</mark>
                {after}
            </>
        );
    }

    if (isLoading) {
        return (
            <p className="deleted-fundraisers-status-message">
                Loading deleted fundraisers...
            </p>
        );
    }

    return (
        <main className="deleted-fundraisers-page">
            <section className="deleted-fundraisers-shell">
                <div className="deleted-fundraisers-card">
                    <div className="deleted-fundraisers-header">
                        <div>
                            <h1 className="deleted-fundraisers-title">
                                Deleted fundraisers
                            </h1>
                            <p className="deleted-fundraisers-subtitle">
                                Restore deleted fundraisers and their related pledges.
                            </p>
                        </div>

                        <Link
                            to="/admin/fundraisers"
                            className="deleted-fundraisers-back-link"
                        >
                            Back to fundraisers
                        </Link>
                    </div>

                    <div className="deleted-fundraisers-search-row">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            placeholder="Search by title, description or owner"
                            className="deleted-fundraisers-search-input"
                        />

                        <button
                            type="button"
                            className="deleted-fundraisers-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="deleted-fundraisers-clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {search && (
                        <p className="deleted-fundraisers-search-info">
                            Found <strong>{filteredFundraisers.length}</strong>{" "}
                            {filteredFundraisers.length === 1 ? "fundraiser" : "fundraisers"} for{" "}
                            <strong>"{search}"</strong>
                        </p>
                    )}

                    {error && (
                        <p className="deleted-fundraisers-status-message error">
                            Error: {error}
                        </p>
                    )}

                    {actionMessage && (
                        <p className="deleted-fundraisers-status-message success">
                            {actionMessage}
                        </p>
                    )}

                    <div className="deleted-fundraisers-table-wrapper">
                        <table className="deleted-fundraisers-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Owner</th>
                                    <th>Owner status</th>
                                    <th>Goal</th>
                                    <th>Open</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredFundraisers.length > 0 ? (
                                    filteredFundraisers.map((fundraiser) => {
                                        const ownerIsActive = fundraiser.owner_is_active;

                                        return (
                                            <tr key={fundraiser.id}>
                                                <td>{fundraiser.id}</td>
                                                <td>{highlightMatch(fundraiser.title)}</td>
                                                <td>{highlightMatch(fundraiser.owner_username)}</td>
                                                <td>
                                                    <span
                                                        className={`deleted-fundraisers-badge ${
                                                            ownerIsActive ? "active" : "inactive"
                                                        }`}
                                                    >
                                                        {ownerIsActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td>{fundraiser.goal}</td>
                                                <td>
                                                    <span
                                                        className={`deleted-fundraisers-badge ${
                                                            fundraiser.is_open ? "active" : "inactive"
                                                        }`}
                                                    >
                                                        {fundraiser.is_open ? "Open" : "Closed"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {ownerIsActive ? (
                                                        <button
                                                            type="button"
                                                            className="deleted-fundraisers-restore-button"
                                                            onClick={() => handleRestore(fundraiser.id)}
                                                            disabled={restoringFundraiserId === fundraiser.id}
                                                        >
                                                            {restoringFundraiserId === fundraiser.id
                                                                ? "Restoring..."
                                                                : "Restore"}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="deleted-fundraisers-restore-button disabled"
                                                            disabled
                                                        >
                                                            Restore owner first
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="deleted-fundraisers-empty-cell">
                                            No deleted fundraisers found.
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

export default DeletedFundraisersPage;