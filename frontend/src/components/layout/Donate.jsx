import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const PAYMENT_LOGOS = [
  { name: "Google Pay", url: "/GooglePay.png" },
  { name: "PhonePe", url: "/PhonePe.png" },
  { name: "Paytm", url: "/Paytm.png" }
];

function Donate() {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const upiId = "pavanthorat@oksbi";
  const merchantName = "Hope Adoption Center";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}${amount ? `&am=${amount}` : ""}&cu=INR`;

  const handleConfirmPayment = async () => {
  if (!amount) {
    alert("Please enter donation amount");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        upiId,
        donorName: "Anonymous Donor"
      })
    });

    if (!response.ok) {
      let msg = "Donation failed";
      try {
        const err = await response.json();
        msg = err.message || msg;
      } catch {}
      alert(msg);
      return;
    }

    // ✅ STORE DONATION (THIS WAS MISSING)
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

    // ✅ NOW NAVIGATION WORKS
    navigate("/payment-success");

  } catch (err) {
    alert("Server error");
  }
};


  return (
    <div style={{ background: "#f0f8ff", minHeight: "100vh" }}>
      <header className="text-info text-center py-4 fs-1">
        Donate Us
      </header>

      <div className="container d-flex justify-content-center my-5">
        <div className="card shadow p-4" style={{ maxWidth: 600, width: "100%" }}>
          <h4>Bank Details for Donation</h4>
          <p>Bank Name: <strong>ABC Bank</strong></p>
          <p>Account Name: <strong>Child Adoption Fund</strong></p>
          <p>Account Number: <strong>123456789012</strong></p>
          <p>IFSC Code: <strong>ABCD0123456</strong></p>

          <hr />

          <h5 className="text-center">Donate via UPI</h5>

          <div className="text-center mt-3">
            <QRCodeCanvas value={upiUrl} size={220} />
          </div>

          <div className="d-flex justify-content-center gap-4 mt-3">
            {PAYMENT_LOGOS.map(app => (
              <img key={app.name} src={app.url} alt={app.name} height={35} />
            ))}
          </div>

          <input
            type="number"
            className="form-control mt-4"
            placeholder="Enter Amount (₹)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
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
