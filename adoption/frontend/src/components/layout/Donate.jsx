function Donate() {
  return (
    <div style={{ background: "#f0f8ff", minHeight: "100vh" }}>
      <header className="bg-primary text-white text-center  py-4 fs-1">
        Donate Us
      </header>

      <div className="container d-flex justify-content-center my-5">
        <div className="card shadow p-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h4 className="mb-3">Bank Details for Donation</h4>

          <p>Bank Name: <strong>ABC Bank</strong></p>
          <p>Account Name: <strong>Child Adoption Fund</strong></p>
          <p>Account Number: <strong>123456789012</strong></p>
          <p>IFSC Code: <strong>ABCD0123456</strong></p>
          <p>Branch: <strong>Main City Branch</strong></p>

          <p className="mt-3 text-success fw-semibold">
            Thank you for your generous support!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Donate;
