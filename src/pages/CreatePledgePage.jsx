import { useParams } from "react-router-dom";
import PledgeForm from "../components/PledgeForm";

function CreatePledgePage() {
  const { id } = useParams();
  return <PledgeForm fundraiserId={id} />;
}

export default CreatePledgePage;