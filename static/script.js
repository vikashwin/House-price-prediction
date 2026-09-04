const locationSelect = document.getElementById("location");

const predictionForm = document.getElementById("predictionForm");

const resultDiv = document.getElementById("result");

const errorDiv = document.getElementById("error");


// Load locations when page opens
async function loadLocations() {

    try {

        const response = await fetch("/api/locations");

        const data = await response.json();

        data.locations.forEach(location => {

            const option = document.createElement("option");

            option.value = location;

            option.textContent = location;

            locationSelect.appendChild(option);

        });

    } catch (error) {

        showError("Unable to load locations.");

        console.error(error);

    }
}


// Handle prediction form
predictionForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    hideMessages();


    const location = locationSelect.value;

    const total_sqft =
        parseFloat(document.getElementById("total_sqft").value);

    const bath =
        parseFloat(document.getElementById("bath").value);

    const bhk =
        parseFloat(document.getElementById("bhk").value);


    try {

        const response = await fetch("/api/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                location: location,
                total_sqft: total_sqft,
                bath: bath,
                bhk: bhk
            })

        });


        const data = await response.json();


        if (!response.ok) {

            showError(data.error || "Prediction failed.");

            return;
        }


        resultDiv.textContent =
            `Predicted Price: ₹${data.price_lakhs} Lakhs`;

        resultDiv.classList.remove("hidden");

    }

    catch (error) {

        showError("Unable to connect to the server.");

        console.error(error);

    }

});


// Display error
function showError(message) {

    errorDiv.textContent = message;

    errorDiv.classList.remove("hidden");
}


// Hide result/error
function hideMessages() {

    resultDiv.classList.add("hidden");

    errorDiv.classList.add("hidden");
}


// Load locations
loadLocations();