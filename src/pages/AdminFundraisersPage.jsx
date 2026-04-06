import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getFundraisers from "../api/get-fundraisers";
import deleteFundraiser from "../api/delete-fundraisers";
import Modal from "../components/Modal";
import "./AdminFundraisersPage.css";

function AdminFundraisersPage() {
    const [fundraisers, setFundraisers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [deletingFundraiserId, setDeletingFundraiserId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [fundraiserToDelete, setFundraiserToDelete] = useState(null);

    const navigate = useNavigate();
    const isAdmin = window.localStorage.getItem("is_staff") === "true";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        async function loadFundraisers() {
            setIsLoading(true);
            setError("");

            try {
                const data = await getFundraisers(false, search);
                setFundraisers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadFundraisers();
    }, [isAdmin, navigate, search]);

    function handleSearch() {
        setSearch(searchInput.trim());
    }

    function handleClear() {
        setSearchInput("");
        setSearch("");
    }

    function openDeleteModal(fundraiser) {
        setFundraiserToDelete(fundraiser);
        setError("");
        setActionMessage("");
    }

    function closeDeleteModal() {
        if (deletingFundraiserId) return;
        setFundraiserToDelete(null);
    }

    async function confirmDelete() {
        if (!fundraiserToDelete) return;

        const fundraiserId = fundraiserToDelete.id;

        setError("");
        setActionMessage("");
        setDeletingFundraiserId(fundraiserId);

        try {
            await deleteFundraiser(fundraiserId);
            setFundraisers((prev) =>
                prev.filter((fundraiser) => fundraiser.id !== fundraiserId)
            );
            setActionMessage("Fundraiser deleted successfully.");
            setFundraiserToDelete(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingFundraiserId(null);
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
                <mark className="admin-fundraisers-highlight">{match}</mark>
                {after}
            </>
        );
    }

    if (isLoading) {
        return (
            <p className="admin-fundraisers-status-message">
                Loading fundraisers...
            </p>
        );
    }

    if (error && fundraisers.length === 0) {
        return (
            <p className="admin-fundraisers-status-message">
                Error: {error}
            </p>
        );
    }

    return (
        <main className="admin-fundraisers-page">
            <section className="admin-fundraisers-shell">
                <div className="admin-fundraisers-card">
                    <div className="admin-fundraisers-header">
                        <div>
                            <h1 className="admin-fundraisers-title">
                                Fundraisers management
                            </h1>
                            <p className="admin-fundraisers-subtitle">
                                Review active fundraisers, search by title or owner,
                                and remove fundraisers when needed.
                            </p>
                        </div>

                        <Link
                            to="/admin/fundraisers/deleted"
                            className="admin-fundraisers-deleted-link"
                        >
                            Deleted fundraisers
                        </Link>
                    </div>

                    <div className="admin-fundraisers-search-row">
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
                            className="admin-fundraisers-search-input"
                        />

                        <button
                            type="button"
                            className="admin-fundraisers-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="admin-fundraisers-clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                    </div>

                    {search && (
                        <p className="admin-fundraisers-search-info">
                            Found <strong>{filteredFundraisers.length}</strong>{" "}
                            {filteredFundraisers.length === 1 ? "fundraiser" : "fundraisers"} for{" "}
                            <strong>"{search}"</strong>
                        </p>
                    )}

                    {error && (
                        <p className="admin-fundraisers-status-message error">
                            Error: {error}
                        </p>
                    )}

                    {actionMessage && (
                        <p className="admin-fundraisers-status-message success">
                            {actionMessage}
                        </p>
                    )}

                    <div className="admin-fundraisers-table-wrapper">
                        <table className="admin-fundraisers-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Owner</th>
                                    <th>Goal</th>
                                    <th>Raised</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredFundraisers.length > 0 ? (
                                    filteredFundraisers.map((fundraiser) => (
                                        <tr key={fundraiser.id}>
                                            <td>{fundraiser.id}</td>
                                            <td>{highlightMatch(fundraiser.title)}</td>
                                            <td>{highlightMatch(fundraiser.owner_username)}</td>
                                            <td>{fundraiser.goal}</td>
                                            <td>{fundraiser.amount_raised}</td>
                                            <td>
                                                <span
                                                    className={`admin-fundraisers-badge ${
                                                        fundraiser.is_open ? "open" : "closed"
                                                    }`}
                                                >
                                                    {fundraiser.is_open ? "Open" : "Closed"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="admin-fundraisers-delete-button"
                                                    onClick={() => openDeleteModal(fundraiser)}
                                                    disabled={
                                                        deletingFundraiserId === fundraiser.id
                                                    }
                                                >
                                                    {deletingFundraiserId === fundraiser.id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="admin-fundraisers-empty-cell"
                                        >
                                            No fundraisers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <Modal
                isOpen={Boolean(fundraiserToDelete)}
                type="warning"
                title="Delete fundraiser?"
                message={[
                    fundraiserToDelete
                        ? `Are you sure you want to delete "${fundraiserToDelete.title}"?`
                        : "",
                    "This fundraiser will be removed from the active list.",
                    "It can be restored by a site administrator if necessary.",
                ].filter(Boolean)}
                confirmText={deletingFundraiserId ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                onClose={closeDeleteModal}
                isProcessing={Boolean(deletingFundraiserId)}
            />
        </main>
    );
}

export default AdminFundraisersPage;