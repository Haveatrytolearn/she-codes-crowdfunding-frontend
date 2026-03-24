import { useNavigate, Link } from "react-router-dom";
import "./StartFundraiserPage.css";
import StartFundraiserForm from "../components/StartFundraiserForm";

function StartFundraiserPage() {
    const navigate = useNavigate();

    function handleFundraiserCreated() {
        navigate("/");
    }

    return (
        <main className="start-fundraiser-page">
            <section className="start-fundraiser-shell">
                <Link to="/" className="back-link">
                    ← List of initiatives
                </Link>

                <h2 className="panel-title">New Fundraiser</h2>

                <StartFundraiserForm onSuccess={handleFundraiserCreated} />
            </section>
        </main>
    );
}

export default StartFundraiserPage;