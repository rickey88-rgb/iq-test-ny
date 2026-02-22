export default function RefundPolicy() {
  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Refund Policy</h1>

      <p>Last updated: {new Date().getFullYear()}</p>

      <h2>1. Digital Product</h2>
      <p>
        This website provides instant access to digital content.
        Due to the nature of digital products, all sales are generally final.
      </p>

      <h2>2. Exceptions</h2>
      <p>
        If you experience a technical issue that prevents you from accessing
        your purchased results, please contact us and we will review the case.
      </p>

      <h2>3. Unauthorized Transactions</h2>
      <p>
        If you believe a transaction was made without your authorization,
        please contact us immediately so we can investigate.
      </p>

      <h2>4. Contact</h2>
      <p>
        For refund-related questions, please contact:
        support@unlockyouriq.com
      </p>
    </main>
  );
}