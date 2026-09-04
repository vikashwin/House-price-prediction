import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    location: "",
    total_sqft: "",
    bath: "",
    bhk: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  // Load locations
  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/locations")

      .then((response) => response.json())

      .then((data) => {
        setLocations(data.locations);
      })

      .catch(() => {
        setError("Unable to load locations.");
      });

  }, []);


  // Handle input
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  // Submit form
  const handleSubmit = async (e) => {

    e.preventDefault();

    setResult(null);
    setError("");


    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            location: formData.location,
            total_sqft: Number(formData.total_sqft),
            bath: Number(formData.bath),
            bhk: Number(formData.bhk),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        setError(data.error || "Prediction failed.");
        return;
      }


      setResult(data);

    } catch (error) {

      setError("Cannot connect to Flask server.");

    }

  };


  return (
    <div className="container">

      <div className="card">

        <h1>🏠 House Price Prediction</h1>

        <p className="subtitle">
          Predict Bangalore house prices using Machine Learning
        </p>


        <form onSubmit={handleSubmit}>

          {/* Location */}

          <div className="form-group">

            <label>Location</label>

            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Location
              </option>

              {locations.map((location) => (

                <option
                  key={location}
                  value={location}
                >
                  {location}
                </option>

              ))}

            </select>

          </div>


          {/* Total sqft */}

          <div className="form-group">

            <label>Total Square Feet</label>

            <input
              type="number"
              name="total_sqft"
              value={formData.total_sqft}
              onChange={handleChange}
              placeholder="Enter area"
              required
            />

          </div>


          {/* Bathroom */}

          <div className="form-group">

            <label>Bathrooms</label>

            <input
              type="number"
              name="bath"
              value={formData.bath}
              onChange={handleChange}
              placeholder="Number of bathrooms"
              min="1"
              required
            />

          </div>


          {/* BHK */}

          <div className="form-group">

            <label>BHK</label>

            <input
              type="number"
              name="bhk"
              value={formData.bhk}
              onChange={handleChange}
              placeholder="Number of bedrooms"
              min="1"
              required
            />

          </div>


          <button type="submit">
            Predict Price
          </button>

        </form>


        {/* Result */}

        {result && (

          <div className="result">

            <h2>Predicted Price</h2>

            <p>
              ₹ {result.price_lakhs} Lakhs
            </p>

          </div>

        )}


        {/* Error */}

        {error && (

          <div className="error">
            {error}
          </div>

        )}

      </div>

    </div>
  );
}

export default App;