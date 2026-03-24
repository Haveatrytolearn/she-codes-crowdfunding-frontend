import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";
import "./FundraiserPage.css";

function FundraiserPage() {
    // Here we use a hook that comes for free in react router called `useParams` to get the id from the URL so that we can pass it to our useFundraiser hook.
    const { id } = useParams();
   // useFundraiser returns three pieces of info, so we need to grab them all here
    const { fundraiser, isLoading, error } = useFundraiser(id);   

    if (isLoading) {
        return (<p className="fundraiser-status-message">loading fundraiser..</p>);
    }

    if (error) {
        return (<p className="fundraiser-status-message">Error: {error.message}</p>)
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
                            <h1 className="fundraiser-title">{fundraiser.title}</h1>

                            <div className="fundraiser-info-list">
                                <p>
                                    <span className="label">Description:</span>{" "}
                                    {fundraiser.description}
                                </p>
                                <p>
                                    <span className="label">Goal:</span> ${fundraiser.goal}
                                </p>
                                <p>
                                    <span className="label">Already donated:</span> $
                                    {fundraiser.amount_raised}
                                </p>
                                <p>
                                    <span className="label">Date of publication:</span>{" "}
                                    {new Date(fundraiser.date_created).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "2-digit" })}
                                </p>
                                <p>
                                    <span className="label">Status:</span>{" "}
                                    {fundraiser.is_open ? "Open" : "Closed"}
                                </p>
                            </div>
                        </div>

                        <div className="fundraiser-image-box">
                            <img
                                src={fundraiser.image}
                                alt={fundraiser.title}
                                className="fundraiser-image"
                            />
                        </div>
                    </div>

                    <div className="fundraiser-bottom-row">
                        <button type="button" className="fundraiser-action-button">
                            Donate
                        </button>

                        <span className="fundraiser-divider">/</span>

                        <span className="fundraiser-donated-pill">
                            Already donated
                        </span>
                    </div>

                    <section className="pledges-section" aria-labelledby="pledges-heading">
                        <h2 id="pledges-heading" className="pledges-title">
                            Pledges
                        </h2>

                        {fundraiser.pledges?.length > 0 ? (
                            <ul className="pledges-list">
                                {fundraiser.pledges.map((pledge) => (
                                    <li key={pledge.id ?? `${pledge.supporter}-${pledge.amount}`}>
                                        ${pledge.amount} from {pledge.supporter}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-pledges">No pledges yet.</p>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}

export default FundraiserPage;