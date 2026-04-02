import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFundraiser from "../hooks/use-fundraiser";
import deleteFundraiser from "../api/delete-fundraiser.js";
import updateFundraiser from "../api/put-fundraiser.js";
import "./FundraiserPage.css";

function FundraiserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fundraiser, isLoading, error } = useFundraiser(id);

    const [authMessage, setAuthMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        goal: "",
        image: "",
        is_open: true,
    });

    useEffect(() => {
        const storedUserId = window.localStorage.getItem("user_id");
        if (storedUserId) {
            setCurrentUserId(Number(storedUserId));
        }
    }, []);

    useEffect(() => {
        if (fundraiser) {
            setEditForm({
                title: fundraiser.title ?? "",
                description: fundraiser.description ?? "",
                goal: fundraiser.goal ?? "",
                image: fundraiser.image ?? "",
                is_open: fundraiser.is_open ?? true,
            });
        }
    }, [fundraiser]);

    const hasDonated = fundraiser?.has_donated ?? false;
    const isOwner = Number(fundraiser?.owner) === Number(currentUserId);
    const isAdmin = window.localStorage.getItem("is_staff") === "true";
    const canEditFundraiser = isOwner || isAdmin;
    const canDeleteFundraiser = isOwner || isAdmin;

    const handleDonateClick = () => {
        if (!fundraiser.is_open) {
            return;
        }

        const token = window.localStorage.getItem("token");

        if (!token) {
            setAuthMessage("Please log in before making a pledge.");
            return;
        }

        setAuthMessage("");
        navigate(`/fundraiser/${id}/pledge`);
    };

    const handleAlreadyDonatedClick = () => {
        const pledgesSection = document.getElementById("pledges-heading");
        if (pledgesSection) {
            pledgesSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleEditClick = () => {
        setSaveError("");
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        setDeleteError("");
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        if (!isDeleting) {
            setShowDeleteModal(false);
        }
    };

    const handleConfirmDelete = async () => {
        setDeleteError("");
        setIsDeleting(true);

        try {
            await deleteFundraiser(id);
            setShowDeleteModal(false);
            navigate("/");
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSaveChanges = async () => {
        setSaveError("");
        setIsSaving(true);

        try {
            const payload = {
                title: editForm.title,
                description: editForm.description,
                goal: Number(editForm.goal),
                image: editForm.image,
                is_open: editForm.is_open,
            };

            await updateFundraiser(id, payload);
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setSaveError("");
        setEditForm({
            title: fundraiser.title ?? "",
            description: fundraiser.description ?? "",
            goal: fundraiser.goal ?? "",
            image: fundraiser.image ?? "",
            is_open: fundraiser.is_open ?? true,
        });
        setIsEditing(false);
    };

    if (isLoading) {
        return <p className="fundraiser-status-message">loading fundraiser..</p>;
    }

    if (error) {
        return <p className="fundraiser-status-message">Error: {error.message}</p>;
    }

    return (
        <main className="fundraiser-page">
            <section className="fundraiser-shell">
                <div className="fundraiser-inner-card">
                    <div className="fundraiser-top-row">
                        <Link to="/" className="fundraiser-back-link">
                            ← List of initiatives
                        </Link>
                    </div>

                    <div className="fundraiser-main-content">
                        <div className="fundraiser-text-content">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleInputChange}
                                    className="fundraiser-edit-input fundraiser-title-input"
                                />
                            ) : (
                                <h1 className="fundraiser-title">{fundraiser.title}</h1>
                            )}

                            <div className="fundraiser-info-list">
                                <p>
                                    <span className="label">Description:</span>{" "}
                                    {isEditing ? (
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleInputChange}
                                            className="fundraiser-edit-textarea"
                                        />
                                    ) : (
                                        fundraiser.description
                                    )}
                                </p>

                                <p>
                                    <span className="label">Goal:</span>{" "}
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="goal"
                                            value={editForm.goal}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="fundraiser-edit-input"
                                        />
                                    ) : (
                                        <>${fundraiser.goal}</>
                                    )}
                                </p>

                                <p>
                                    <span className="label">Already donated:</span> $
                                    {fundraiser.amount_raised}
                                </p>

                                <p>
                                    <span className="label">Date of publication:</span>{" "}
                                    {new Date(fundraiser.date_created).toLocaleDateString(
                                        "en-GB",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "2-digit",
                                        }
                                    )}
                                </p>

                                <p>
                                    <span className="label">Status:</span>{" "}
                                    {isEditing ? (
                                        <label className="fundraiser-checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="is_open"
                                                checked={editForm.is_open}
                                                onChange={handleInputChange}
                                            />
                                            {editForm.is_open ? " Open" : " Closed"}
                                        </label>
                                    ) : (
                                        <span
                                            className={`fundraiser-status-badge ${
                                                fundraiser.is_open ? "open" : "closed"
                                            }`}
                                        >
                                            {fundraiser.is_open ? "Open" : "Closed"}
                                        </span>
                                    )}
                                </p>

                                {isEditing && (
                                    <p>
                                        <span className="label">Image URL:</span>{" "}
                                        <input
                                            type="text"
                                            name="image"
                                            value={editForm.image}
                                            onChange={handleInputChange}
                                            className="fundraiser-edit-input"
                                        />
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="fundraiser-image-box">
                            <img
                                src={isEditing ? editForm.image : fundraiser.image}
                                alt={isEditing ? editForm.title : fundraiser.title}
                                className="fundraiser-image"
                            />
                        </div>
                    </div>

                    
                    {!fundraiser.is_open && (
                        <p className="fundraiser-status-message">
                            This fundraiser is closed. Donations are no longer accepted.
                        </p>
                    )}

                    <div className="fundraiser-actions-block">
                        <div className="fundraiser-bottom-row">
                            <button
                                type="button"
                                className="fundraiser-action-button"
                                onClick={handleDonateClick}
                                disabled={!fundraiser.is_open}
                            >
                                {fundraiser.is_open ? "Donate" : "Closed"}
                            </button>

                            <span className="fundraiser-divider">/</span>

                            <button
                                type="button"
                                className={`fundraiser-donated-pill ${hasDonated ? "active" : ""}`}
                                onClick={handleAlreadyDonatedClick}
                                disabled={!hasDonated}
                            >
                                Already donated
                            </button>
                        </div>

                        {(canEditFundraiser || canDeleteFundraiser) && (
                            <div className="fundraiser-owner-actions-row">
                                {canEditFundraiser && !isEditing && (
                                    <>
                                        <button
                                            type="button"
                                            className="fundraiser-edit-button"
                                            onClick={handleEditClick}
                                        >
                                            Edit fundraiser
                                        </button>

                                        {canDeleteFundraiser && (
                                            <>
                                                <span className="fundraiser-divider">/</span>
                                                <button
                                                    type="button"
                                                    className="fundraiser-delete-button"
                                                    onClick={handleDeleteClick}
                                                >
                                                    Delete fundraiser
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}

                                {canEditFundraiser && isEditing && (
                                    <>
                                        <button
                                            type="button"
                                            className="fundraiser-save-button"
                                            onClick={handleSaveChanges}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Saving..." : "Save changes"}
                                        </button>

                                        <span className="fundraiser-divider">/</span>

                                        <button
                                            type="button"
                                            className="fundraiser-cancel-button"
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {saveError && (
                        <p className="fundraiser-status-message">Error: {saveError}</p>
                    )}

                    {authMessage && (
                        <p className="fundraiser-status-message">{authMessage}</p>
                    )}

                    {(fundraiser.amount_raised === 0 || fundraiser.pledges?.length > 0) && (
                        <section className="pledges-section" aria-labelledby="pledges-heading">
                            <h2 id="pledges-heading" className="pledges-title">
                                Pledges
                            </h2>

                            {fundraiser.amount_raised === 0 ? (
                                <p className="no-pledges">No pledges yet.</p>
                            ) : (
                                <ul className="pledges-list">
                                    {fundraiser.pledges.map((pledge) => (
                                        <li key={pledge.id ?? `${pledge.supporter}-${pledge.amount}`}>
                                            ${pledge.amount} from {pledge.supporter}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}

                    {(isOwner || isAdmin) && fundraiser.change_logs?.length > 0 && (
                        <section className="fundraiser-change-log-section">
                            <h2 className="pledges-title">Change history</h2>
                            <ul className="fundraiser-change-log-list">
                                {fundraiser.change_logs.map((log) => (
                                    <li key={log.id}>
                                        <strong>{log.changed_by_username}</strong> changed{" "}
                                        <strong>{log.field_name}</strong> from{" "}
                                        <em>{String(log.old_value ?? "empty")}</em> to{" "}
                                        <em>{String(log.new_value ?? "empty")}</em> on{" "}
                                        {new Date(log.changed_at).toLocaleString("en-GB")}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </section>

            {showDeleteModal && (
                <div className="fundraiser-modal-overlay" onClick={handleCloseModal}>
                    <div
                        className="fundraiser-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 className="fundraiser-modal-title">Delete fundraiser?</h2>
                        <p className="fundraiser-modal-text">
                            This fundraiser will be removed from public view, but it can
                            still be restored later from the backend.
                        </p>

                        {deleteError && (
                            <p className="fundraiser-modal-error">{deleteError}</p>
                        )}

                        <div className="fundraiser-modal-actions">
                            <button
                                type="button"
                                className="fundraiser-modal-cancel"
                                onClick={handleCloseModal}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="fundraiser-modal-confirm"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes, delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default FundraiserPage;