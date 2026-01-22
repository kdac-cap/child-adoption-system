import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

// Payment app logos (public URLs – no local assets needed)
const PAYMENT_LOGOS = [
  {
    name: "Google Pay",
    url: "/GooglePay.png"
  },
  {
    name: "PhonePe",
    url: "/PhonePe.png"
  },
  {
    name: "Paytm",
    url: "/Paytm.png"
  }
];

function Donate() {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const upiId = "example@upi"; // demo UPI ID
  const merchantName = "Hope Adoption Center";

  // Amount is optional — QR always visible
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}${amount ? `&am=${amount}` : ""}&cu=INR`;

  const handleConfirmPayment = () => {
    if (!amount) {
      alert("Please enter donation amount before confirming");
      return;
    }

    const donation = {
      txnId: "TXN" + Date.now(),
      amount,
      date: new Date().toLocaleString()
    };

    sessionStorage.setItem("latestDonation", JSON.stringify(donation));

    const history =
      JSON.parse(sessionStorage.getItem("donationHistory")) || [];
    history.push(donation);
    sessionStorage.setItem("donationHistory", JSON.stringify(history));

    navigate("/payment-success");
  };

  return (
    <div style={{ background: "#f0f8ff", minHeight: "100vh" }}>
      <header className="text-info text-center py-4 fs-1">
        Donate Us
      </header>

      <div className="container d-flex justify-content-center my-5">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          {/* BANK DETAILS */}
          <h4 className="mb-3">Bank Details for Donation</h4>
          <p>Bank Name: <strong>ABC Bank</strong></p>
          <p>Account Name: <strong>Child Adoption Fund</strong></p>
          <p>Account Number: <strong>123456789012</strong></p>
          <p>IFSC Code: <strong>ABCD0123456</strong></p>
          <p>Branch: <strong>Main City Branch</strong></p>

          <p className="mt-3 text-success fw-semibold">
            Thank you for your generous support!
          </p>

          <hr />

          {/* UPI SECTION */}
          <h5 className="mt-3 text-center">Donate via UPI</h5>

          {/* QR CODE ALWAYS VISIBLE */}
          <div className="text-center mt-3">
            <QRCodeCanvas value={upiUrl} size={220} />
          </div>

          <p className="text-muted text-center mt-2">
            Scan using any UPI app
          </p>

          {/* PAYMENT APP LOGOS */}
          <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
            {PAYMENT_LOGOS.map((app) => (
              <img
                key={app.name}
                src={app.url}
                alt={app.name}
                title={app.name}
                style={{ height: "35px", objectFit: "contain" }}
              />
            ))}
          </div>

          {/* AMOUNT INPUT */}
          <input
            type="number"
            className="form-control mt-4"
            placeholder="Enter Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            className="btn btn-success w-100 mt-3"
            onClick={handleConfirmPayment}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Donate;
