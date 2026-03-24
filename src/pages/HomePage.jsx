import { Link } from "react-router-dom";
import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css"

function HomePage() {
  const { fundraisers } = useFundraisers();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;  

  return (
    <main className="homepage">
      {/*Top box*/}
      <section className="start-fundraiser">
        <h2 className="page-title">List of Initiatives</h2>

        {/* show only if the user login */}
        {isLoggedIn && (
          <div className="start-box">
            <span className="start-text">Start fundraiser</span>

            <Link to="/create" className="start-button" aria-label="Start new fundraiser">
             +
            </Link>
          </div>
        )}
      </section>


      {/*List Fundraisers*/}
      <section className="fundraiser-list">
        {fundraisers.map((fundraiserData, key) => {
          return <FundraiserCard key={key} fundraiserData={fundraiserData} />;
        })}
      </section>
    </main>
  );
}

export default HomePage;