import { Link } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
  const { fundraiserData, currentUserId } = props;
  const fundraiserLink = `/fundraiser/${fundraiserData.id}`;

  const isMine = currentUserId && Number(fundraiserData.owner) === Number(currentUserId);
  const isSupported = fundraiserData.has_donated === true;
  const isFunded =
    Number(fundraiserData.amount_raised) >= Number(fundraiserData.goal);

  function getBadge() {
    if (isMine) {
      return { label: "My fundraiser", className: "badge-my" };
    }

    if (isSupported) {
      return { label: "Supported by you", className: "badge-supported" };
    }

    if (isFunded) {
      return { label: "Funded", className: "badge-funded" };
    }

    return null;
  }

  const badge = getBadge();

  return (
    <div className="fundraiser-card">
      {badge && (
        <div className={`fundraiser-badge ${badge.className}`}>
          {badge.label}
        </div>
      )}

      <Link to={fundraiserLink} className="fundraiser-card-link">
        <img
          src={fundraiserData.image}
          alt={fundraiserData.title}
          className="fundraiser-card-image"
        />
        <h3 className="fundraiser-card-title">
          {fundraiserData.title}
        </h3>
      </Link>
    </div>
  );
}

export default FundraiserCard;