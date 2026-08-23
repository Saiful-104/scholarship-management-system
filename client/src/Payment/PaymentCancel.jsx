import { useNavigate } from "react-router";
import Container from "../components/Shared/Container";
import Heading from "../components/Shared/Heading";
import Button from "../components/Shared/Button/Button";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <Heading 
          title="Payment Cancelled" 
          subtitle="You cancelled the payment process." 
        />
        <p className="mt-4 text-gray-600">
          Your application has not been submitted. You can apply again when you're ready.
        </p>
        <div className="mt-8 space-y-4">
          <Button
            label="Return to Dashboard"
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3"
            onClick={() => navigate("/dashboard")}
          />
          <Button
            label="Browse Scholarships"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 ml-4"
            onClick={() => navigate("/scholarships")}
          />
        </div>
      </div>
    </Container>
  );
};

export default PaymentCancel;