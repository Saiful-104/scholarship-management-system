import { useNavigate, useLocation } from "react-router";
import Container from "../components/Shared/Container";
import Heading from "../components/Shared/Heading";
import Button from "../components/Shared/Button/Button";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const errorMessage = params.get("error") || "Payment was cancelled or failed.";

  return (
    <Container>
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <Heading title="Payment Failed" subtitle={errorMessage} />
        <p className="mt-4 text-gray-600">
          Your application has been saved with "unpaid" status. You can retry payment from your dashboard.
        </p>
        <div className="mt-8 space-y-4">
          <Button
            label="Return to Dashboard"
            className="bg-red-600 hover:bg-red-700 px-6 py-3"
            onClick={() => navigate("/dashboard")}
          />
          <Button
            label="Try Again"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 ml-4"
            onClick={() => navigate(-1)} // Go back to checkout page
          />
        </div>
      </div>
    </Container>
  );
};

export default PaymentFailed;