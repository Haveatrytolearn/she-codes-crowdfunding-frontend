import { Link } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  const fundraiserLink = `/fundraiser/${fundraiserData.id}`;

  return (
    <div className="fundraiser-card">
      <Link to={fundraiserLink} className="fundraiser-card-link">
        <img src={fundraiserData.image} 
        alt={fundraiserData.title}
        className="fundraiser-card-image"/>
        <h3 className="fundraiser-card-title">
          {fundraiserData.title}
        </h3>
      </Link>
    </div>
  );
}

export default FundraiserCard;