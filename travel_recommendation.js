document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("btnSearch");
    const resetButton = document.getElementById("btnReset");
    const searchInput = document.getElementById("conditionInput");
    const resultContainer = document.getElementById("resultContainer");

    // Task 6: Fetch data from the travel_recommendation_api.json file
    let apiData = { countries: [], temples: [], beaches: [] };

    function fetchTravelData() {
        fetch("travel_recommendation_api.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                apiData = data;
                console.log("Travel API Data Fetched Successfully:", apiData); // Verification console.log
            })
            .catch(error => {
                console.error("Error fetching travel data:", error);
            });
    }

    fetchTravelData();

    // Task 7 & 8: Keyword Search and Grid Rendering
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const query = searchInput.value.trim().toLowerCase();
            resultContainer.innerHTML = ""; // Clear previous results

            if (!query) return;

            let matchedResults = [];

            // Match keywords: beach/beaches, temple/temples, country/countries or specific names (e.g., Japan, Australia)
            if (query.includes("beach")) {
                matchedResults = apiData.beaches || [];
            } else if (query.includes("temple")) {
                matchedResults = apiData.temples || [];
            } else if (query.includes("country") || query.includes("countries")) {
                // Flatten all cities across all countries
                apiData.countries.forEach(country => {
                    matchedResults.push(...country.cities);
                });
            } else {
                // Search check against specific country names or city names
                apiData.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(query)) {
                        matchedResults.push(...country.cities);
                    } else {
                        country.cities.forEach(city => {
                            if (city.name.toLowerCase().includes(query)) {
                                matchedResults.push(city);
                            }
                        });
                    }
                });

                apiData.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(query)) {
                        matchedResults.push(temple);
                    }
                });

                apiData.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(query)) {
                        matchedResults.push(beach);
                    }
                });
            }

            displayResults(matchedResults);
        });
    }

    // Function to render recommendation cards using display: grid (Task 8)
    function displayResults(items) {
        resultContainer.innerHTML = "";

        if (items.length === 0) {
            resultContainer.innerHTML = `<p class="no-results">No recommendations found. Try searching for "beach", "temple", or "Japan".</p>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("recommendation-card");

            // Optional Task 10: Country/City Current Local Time calculation example
            let timeString = "";
            if (item.timeZone) {
                const options = { timeZone: item.timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                const localTime = new Date().toLocaleTimeString('en-US', options);
                timeString = `<p class="card-time"><i class="fa-regular fa-clock"></i> Local Time: <strong>${localTime}</strong></p>`;
            }

            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    ${timeString}
                    <button class="btn-visit">Visit Destination</button>
                </div>
            `;
            resultContainer.appendChild(card);
        });
    }

    // Task 9: Clear Button Functionality
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            searchInput.value = "";
            resultContainer.innerHTML = "";
        });
    }
});