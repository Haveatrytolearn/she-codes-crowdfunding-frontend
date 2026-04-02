import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postPledge from "../api/post-pledge.js";
import "./PledgeForm.css";

function PledgeForm({ fundraiserId }) {
    const navigate = useNavigate();
    const token = window.localStorage.getItem("token");

    const [formData, setFormData] = useState({
        amount: "",
        comment: "",
        anonymous: false,
        cardholderName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { id, type, value, checked } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await postPledge({
                amount: Number(formData.amount),
                comment: formData.comment,
                anonymous: formData.anonymous,
                fundraiser: Number(fundraiserId),
            });

            navigate(`/fundraiser/${fundraiserId}`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="pledge-page">
            <section className="pledge-shell">
                <div className="pledge-card">
                    <div className="pledge-top-row">
                        <Link to={`/fundraiser/${fundraiserId}`} className="pledge-back-link">
                            ← Back to fundraiser
                        </Link>
                    </div>

                    <h1 className="pledge-title">Payment details</h1>

                    <form className="pledge-form" onSubmit={handleSubmit}>
                        <div className="pledge-grid">
                            <div className="pledge-box pledge-box-amount">
                                <div className="pledge-field-group">
                                    <label htmlFor="amount">Donation amount</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        min="1"
                                        placeholder="Enter amount in AUD"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pledge-box pledge-box-card">
                                <div className="pledge-field-group">
                                    <label htmlFor="cardholderName">Cardholder Name</label>
                                    <input
                                        type="text"
                                        id="cardholderName"
                                        placeholder="Full name"
                                        value={formData.cardholderName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pledge-field-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pledge-small-row">
                                    <div className="pledge-field-group">
                                        <label htmlFor="expiry">Exp</label>
                                        <input
                                            type="text"
                                            id="expiry"
                                            placeholder="MM/YY"
                                            value={formData.expiry}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="pledge-field-group">
                                        <label htmlFor="cvc">CVC</label>
                                        <input
                                            type="text"
                                            id="cvc"
                                            placeholder="123"
                                            value={formData.cvc}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pledge-extra-fields">
                            <div className="pledge-field-group">
                                <label htmlFor="comment">Comment</label>
                                <textarea
                                    id="comment"
                                    placeholder="Add a note with your pledge"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <label className="pledge-checkbox" htmlFor="anonymous">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={formData.anonymous}
                                    onChange={handleChange}
                                />
                                Donate anonymously
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="pledge-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit donation"}
                        </button>

                        {errorMessage && <p className="pledge-error">{errorMessage}</p>}
                    </form>
                </div>
            </section>
        </main>
    );
}

export default PledgeForm;