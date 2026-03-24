import useCreateFundraiser from "../hooks/use-create-fundraiser";
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

    async function handleSubmit(event) {
        try {
            await submitForm(event);
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 900);
            }
        } catch (error) {
            console.error("Form submission error:", error);
        }
    }

    return (
        <div className="start-fundraiser-form-wrapper">
            {successMessage && (
                <p className="success-message">✓ {successMessage}</p>
            )}

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
        </div>
    );
}

export default StartFundraiserForm;
