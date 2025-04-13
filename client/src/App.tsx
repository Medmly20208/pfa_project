import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    amount: 0,
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0,
    type: "", // We use a string for the selected transaction type
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Handle change for form inputs
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Set loading state to true before making the API call
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      // Prepare the data to send
      const payload = {
        features: [
          formData.amount,
          formData.oldbalanceOrg,
          formData.newbalanceOrig,
          formData.oldbalanceDest,
          formData.newbalanceDest,
          formData.type === "CASH_IN" ? 1 : 0,
          formData.type === "CASH_OUT" ? 1 : 0,
          formData.type === "DEBIT" ? 1 : 0,
          formData.type === "PAYMENT" ? 1 : 0,
          formData.type === "TRANSFER" ? 1 : 0,
        ],
      };

      // Make the POST request
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send form data as JSON
      });

      // Check if the response is okay (status 200-299)
      if (response.ok) {
        const data = await response.json();
        console.log("Prediction result:", data);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth", // or 'auto' if you don't want smooth scrolling
        });
        setResult(data?.prediction);
      } else {
        throw new Error("Failed to fetch prediction");
      }
    } catch (err) {
      // Handle errors
      console.error("Error:", err);
    } finally {
      // Set loading state to false after the request
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="oldbalanceOrg">Old Balance (Org):</label>
          <input
            type="number"
            id="oldbalanceOrg"
            name="oldbalanceOrg"
            value={formData.oldbalanceOrg}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="newbalanceOrig">New Balance (Orig):</label>
          <input
            type="number"
            id="newbalanceOrig"
            name="newbalanceOrig"
            value={formData.newbalanceOrig}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="oldbalanceDest">Old Balance (Dest):</label>
          <input
            type="number"
            id="oldbalanceDest"
            name="oldbalanceDest"
            value={formData.oldbalanceDest}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="newbalanceDest">New Balance (Dest):</label>
          <input
            type="number"
            id="newbalanceDest"
            name="newbalanceDest"
            value={formData.newbalanceDest}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="type">Transaction Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select a type</option>
            <option value="CASH_IN">CASH_IN</option>
            <option value="CASH_OUT">CASH_OUT</option>
            <option value="DEBIT">DEBIT</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="TRANSFER">TRANSFER</option>
          </select>
        </div>

        <button type="submit"> {loading ? "Loading" : "Submit"}</button>
        {result != null && (
          <div role="alert" data-is-fraud={result === 1}>
            This transaction is {result === 1 ? "Fraud" : "Not Fraud"}
          </div>
        )}
      </form>
    </>
  );
}

export default App;
