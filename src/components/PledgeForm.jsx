import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import postPledge from "../api/post-pledge.js";
import Modal from "../components/Modal";
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

    const [fieldErrors, setFieldErrors] = useState({
        amount: "",
        cardholderName: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    function getCardType(cardNumber) {
        const digits = cardNumber.replace(/\D/g, "");

        if (/^4/.test(digits)) return "Visa";
        if (/^5[1-5]/.test(digits)) return "Mastercard";
        if (/^3[47]/.test(digits)) return "Amex";

        return "";
    }

    function formatCardNumber(value) {
        const digits = value.replace(/\D/g, "");
        const cardType = getCardType(digits);

        if (cardType === "Amex") {
            const trimmed = digits.slice(0, 15);
            const part1 = trimmed.slice(0, 4);
            const part2 = trimmed.slice(4, 10);
            const part3 = trimmed.slice(10, 15);
            return [part1, part2, part3].filter(Boolean).join(" ");
        }

        const trimmed = digits.slice(0, 16);
        return trimmed.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }

    function formatExpiry(value) {
        const digits = value.replace(/\D/g, "").slice(0, 4);

        if (digits.length === 0) return "";
        if (digits.length === 1) return digits;

        let month = digits.slice(0, 2);
        const year = digits.slice(2, 4);

        if (parseInt(month, 10) < 1) {
            month = "01";
        } else if (parseInt(month, 10) > 12) {
            month = "12";
        }

        return year ? `${month}/${year}` : month;
    }

    function formatCvc(value, cardNumber) {
        const digits = value.replace(/\D/g, "");
        const cardType = getCardType(cardNumber);
        const maxLength = cardType === "Amex" ? 4 : 3;
        return digits.slice(0, maxLength);
    }

    function validateAmount(value) {
        if (!value) return "Please enter a donation amount.";
        if (Number(value) < 1) return "Amount must be at least 1 AUD.";
        return "";
    }

    function validateCardholderName(value) {
        if (!value.trim()) return "Please enter the cardholder name.";
        if (value.trim().length < 2) return "Name is too short.";
        return "";
    }

    function validateCardNumber(value) {
        const digits = value.replace(/\D/g, "");
        const cardType = getCardType(value);

        if (!digits) return "Please enter the card number.";

        if (cardType === "Amex") {
            if (digits.length !== 15) {
                return "American Express card numbers must contain 15 digits.";
            }
            return "";
        }

        if (cardType === "Visa" || cardType === "Mastercard") {
            if (digits.length !== 16) {
                return `${cardType} card numbers must contain 16 digits.`;
            }
            return "";
        }

        if (digits.length < 16) {
            return "Card number must contain 16 digits.";
        }

        return "";
    }

    function validateExpiry(value) {
        if (!value) return "Please enter the expiry date.";
        if (!/^\d{2}\/\d{2}$/.test(value)) return "Use MM/YY format.";

        const [monthStr, yearStr] = value.split("/");
        const month = Number(monthStr);
        const year = Number(`20${yearStr}`);

        if (month < 1 || month > 12) {
            return "Month must be between 01 and 12.";
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return "Card expiry date is in the past.";
        }

        return "";
    }

    function validateCvc(value, cardNumber) {
        const cardType = getCardType(cardNumber);

        if (!value) return "Please enter the CVC.";

        if (cardType === "Amex") {
            if (!/^\d{4}$/.test(value)) {
                return "American Express CVC must contain 4 digits.";
            }
            return "";
        }

        if (!/^\d{3}$/.test(value)) {
            return "CVC must contain 3 digits.";
        }

        return "";
    }

    function validateAllFields() {
        const errors = {
            amount: validateAmount(formData.amount),
            cardholderName: validateCardholderName(formData.cardholderName),
            cardNumber: validateCardNumber(formData.cardNumber),
            expiry: validateExpiry(formData.expiry),
            cvc: validateCvc(formData.cvc, formData.cardNumber),
        };

        setFieldErrors(errors);

        return !Object.values(errors).some(Boolean);
    }

    const handleChange = (event) => {
        const { id, type, value, checked } = event.target;

        setFormData((prevData) => {
            if (id === "cardNumber") {
                const formattedCardNumber = formatCardNumber(value);
                const adjustedCvc = formatCvc(prevData.cvc, formattedCardNumber);

                return {
                    ...prevData,
                    cardNumber: formattedCardNumber,
                    cvc: adjustedCvc,
                };
            }

            if (id === "expiry") {
                return {
                    ...prevData,
                    expiry: formatExpiry(value),
                };
            }

            if (id === "cvc") {
                return {
                    ...prevData,
                    cvc: formatCvc(value, prevData.cardNumber),
                };
            }

            return {
                ...prevData,
                [id]: type === "checkbox" ? checked : value,
            };
        });

        setFieldErrors((prevErrors) => {
            const nextErrors = { ...prevErrors };

            if (id === "amount") {
                nextErrors.amount = "";
            } else if (id === "cardholderName") {
                nextErrors.cardholderName = "";
            } else if (id === "cardNumber") {
                nextErrors.cardNumber = "";
                nextErrors.cvc = "";
            } else if (id === "expiry") {
                nextErrors.expiry = "";
            } else if (id === "cvc") {
                nextErrors.cvc = "";
            }

            return nextErrors;
        });

        setErrorMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        const isValid = validateAllFields();
        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            await postPledge({
                amount: Number(formData.amount),
                comment: formData.comment,
                anonymous: formData.anonymous,
                fundraiser: Number(fundraiserId),
            });

            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage(error.message || "Failed to submit donation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const cardType = getCardType(formData.cardNumber);

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

                    <form className="pledge-form" onSubmit={handleSubmit} noValidate>
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
                                        className={fieldErrors.amount ? "input-error" : ""}
                                    />
                                    {fieldErrors.amount && (
                                        <p className="field-error">{fieldErrors.amount}</p>
                                    )}
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
                                        autoComplete="cc-name"
                                        required
                                        className={fieldErrors.cardholderName ? "input-error" : ""}
                                    />
                                    {fieldErrors.cardholderName && (
                                        <p className="field-error">{fieldErrors.cardholderName}</p>
                                    )}
                                </div>

                                <div className="pledge-field-group">
                                    <div className="pledge-label-row">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        {cardType && (
                                            <span className={`card-badge card-badge-${cardType.toLowerCase()}`}>
                                                {cardType}
                                            </span>
                                        )}
                                    </div>

                                    <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder={
                                            cardType === "Amex"
                                                ? "1234 123456 12345"
                                                : "1234 5678 9012 3456"
                                        }
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                        required
                                        className={fieldErrors.cardNumber ? "input-error" : ""}
                                    />
                                    {fieldErrors.cardNumber && (
                                        <p className="field-error">{fieldErrors.cardNumber}</p>
                                    )}
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
                                            inputMode="numeric"
                                            autoComplete="cc-exp"
                                            required
                                            className={fieldErrors.expiry ? "input-error" : ""}
                                        />
                                        {fieldErrors.expiry && (
                                            <p className="field-error">{fieldErrors.expiry}</p>
                                        )}
                                    </div>

                                    <div className="pledge-field-group">
                                        <label htmlFor="cvc">
                                            {cardType === "Amex" ? "CID" : "CVC"}
                                        </label>
                                        <input
                                            type="text"
                                            id="cvc"
                                            placeholder={cardType === "Amex" ? "1234" : "123"}
                                            value={formData.cvc}
                                            onChange={handleChange}
                                            inputMode="numeric"
                                            autoComplete="cc-csc"
                                            required
                                            className={fieldErrors.cvc ? "input-error" : ""}
                                        />
                                        {fieldErrors.cvc && (
                                            <p className="field-error">{fieldErrors.cvc}</p>
                                        )}
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

            <Modal
                isOpen={showSuccessModal}
                type="success"
                title="Donation successful"
                message={[
                    "Thank you for your contribution.",
                    "Your donation has been processed successfully.",
                ]}
                confirmText="Back to fundraiser"
                onConfirm={() => navigate(`/fundraiser/${fundraiserId}`)}
                onClose={() => navigate(`/fundraiser/${fundraiserId}`)}
            />
        </main>
    );
}

export default PledgeForm;