import jsPDF from "jspdf";

function DonationHistory() {
  const donations =
    JSON.parse(sessionStorage.getItem("donationHistory")) || [];

  const downloadReceipt = (d) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Donation Receipt", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Transaction ID: ${d.txnId}`, 20, 40);
    pdf.text(`Amount Paid: ₹${d.amount}`, 20, 55);
    pdf.text(`Date: ${d.date}`, 20, 70);
    pdf.text("Thank you for supporting child welfare.", 20, 95);

    pdf.save(`receipt-${d.txnId}.pdf`);
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Donation History</h3>

      {donations.length === 0 ? (
        <p className="text-center text-muted">
          No donations in this session
        </p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Transaction ID</th>
              <th>Amount (₹)</th>
              <th>Date</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, i) => (
              <tr key={i}>
                <td>{d.txnId}</td>
                <td>{d.amount}</td>
                <td>{d.date}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => downloadReceipt(d)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DonationHistory;
