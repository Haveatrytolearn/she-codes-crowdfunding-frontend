import { Link } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
  const { fundraisers } = useFundraisers();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const currentUserId = Number(localStorage.getItem("user_id"));

  const myFundraisers = isLoggedIn
    ? fundraisers.filter(
        (fundraiser) => Number(fundraiser.owner) === currentUserId
      )
    : [];

  const supportedFundraisers = isLoggedIn
    ? fundraisers.filter(
        (fundraiser) =>
          Number(fundraiser.owner) !== currentUserId &&
          fundraiser.has_donated === true
      )
    : [];

  const completedFundraisers = fundraisers.filter(
  (fundraiser) =>
    Number(fundraiser.amount_raised) >= Number(fundraiser.goal)
);

  const openFundraisers = fundraisers.filter((fundraiser) => {
    const isMine =
      isLoggedIn && Number(fundraiser.owner) === currentUserId;

    const isSupported =
      isLoggedIn && fundraiser.has_donated === true;

    const isCompleted =
      Number(fundraiser.amount_raised) >= Number(fundraiser.goal);

    return !isMine && !isSupported && !isCompleted;
  });

  function renderFundraiserSection(title, items, sectionClassName = "") {
    if (!items.length) return null;

    return (
      <section className={`homepage-section ${sectionClassName}`}>
        <h2 className="homepage-section-title">{title}</h2>
        <div className="fundraiser-list">
          {items.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.id}
              fundraiserData={fundraiser}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="homepage">
      <section className="start-fundraiser">
        <h1 className="page-title">List of Initiatives</h1>

        {isLoggedIn && (
          <div className="start-box">
            <span className="start-text">Start fundraiser</span>

            <Link
              to="/create"
              className="start-button"
              aria-label="Start new fundraiser"
            >
              +
            </Link>
          </div>
        )}
      </section>

      {renderFundraiserSection("My fundraisers", myFundraisers, "my-section")}
      {renderFundraiserSection(
        "Fundraisers I supported",
        supportedFundraisers,
        "supported-section"
      )}
      {renderFundraiserSection(
        "Explore open fundraisers",
        openFundraisers,
        "open-section"
      )}
      {renderFundraiserSection(
        "Successfully funded",
        completedFundraisers,
        "completed-section"
      )}
    </main>
  );
}

export default HomePage;