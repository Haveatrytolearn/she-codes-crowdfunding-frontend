import { useState } from "react";
import useCreateFundraiser from "../hooks/use-create-fundraiser";
import Modal from "./Modal";
import "./StartFundraiserForm.css";


function StartFundraiserForm({ onSuccess }) {
    const {
        formData,
        isSubmitting,
        successMessage,
        errorMessage,
        handleChange,
        handleSubmit: submitForm,
    } = useCreateFundraiser();

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    async function handleSubmit(event) {
        try {
            await submitForm(event);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Form submission error:", error);
        }
    }

    function handleSuccessConfirm() {
        setShowSuccessModal(false);

        if (onSuccess) {
            onSuccess();
        }
    }

    return (
        <div className="start-fundraiser-form-wrapper">
            {errorMessage && (
                <p className="error-message">✗ {errorMessage}</p>
            )}

            <form className="fundraiser-form" onSubmit={handleSubmit}>
                <div className="fundraiser-layout">
                    <div className="fundraiser-fields">
                        <div className="fundraiser-row">
                            <label htmlFor="title">Title:</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="fundraiser-row fundraiser-row-description">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                            />
                        </div>

                        <div className="fundraiser-row">
                            <label htmlFor="goal">Goal:</label>
                            <input
                                id="goal"
                                name="goal"
                                type="number"
                                min="1"
                                step="1"
                                value={formData.goal}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="fundraiser-image-panel">
                        <div className="image-box">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Fundraiser preview"
                                    className="image-preview"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <span className="image-placeholder">Image</span>
                            )}
                        </div>

                        <div className="image-url-field">
                            <label htmlFor="image">Image URL:</label>
                            <input
                                id="image"
                                name="image"
                                type="url"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Paste image URL"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="fundraiser-actions">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save and publish"}
                    </button>
                </div>
            </form>
             <Modal
                isOpen={showSuccessModal}
                type="success"
                title="Fundraiser created"
                message={[
                    "Your fundraiser has been published successfully.",
                    "You will now return to the initiatives page.",
                ]}
                confirmText="Go to list"
                onConfirm={handleSuccessConfirm}
                onClose={handleSuccessConfirm}
            />
        </div>
    );
}

export default StartFundraiserForm;
