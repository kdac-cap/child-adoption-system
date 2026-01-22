import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function PaymentSuccess() {
  const navigate = useNavigate();
  const donation = JSON.parse(sessionStorage.getItem("latestDonation"));

  useEffect(() => {
    if (!donation) navigate("/donate");
  }, [donation, navigate]);

  if (!donation) return null;

  return (
    <div className="container text-center mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="text-success">✅ Payment Successful</h2>
        <p className="mt-3">Thank you for your donation!</p>

        <hr />

        <p><strong>Transaction ID:</strong></p>
        <p className="text-muted">{donation.txnId}</p>

        <p><strong>Amount Paid:</strong> ₹{donation.amount}</p>
        <p><strong>Date:</strong> {donation.date}</p>

        <div className="d-flex gap-2 justify-content-center mt-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/donations")}
          >
            View History
          </button>

          <button
            className="btn btn-success"
            onClick={() => navigate("/donate")}
          >
            Donate Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
