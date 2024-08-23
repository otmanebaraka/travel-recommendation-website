document.getElementById('search-button').addEventListener('click', function() {
    // clear recommendations
    clearRecommendations();

    const input = document.getElementById('search-input').value.toLowerCase();

    // Define keyword variations
    const keywordVariations = {
        beach: ['beach', 'beaches'],
        temple: ['temple', 'temples'],
        country: [],
    };

    // Function to check if the input matches any keyword variation
    const matchesKeyword = (input, variations) => {
        return variations.some(variation => input.includes(variation));
    };

    // Fetch data and filter based on input
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Filter countries
            const filteredCountries = data.countries.filter(country =>
                country.name.toLowerCase().includes(input) ||
                country.cities.some(city => city.name.toLowerCase().includes(input))
            );

            // Filter beaches
            const filteredBeaches = data.beaches.filter(beach =>
                beach.name.toLowerCase().includes(input) ||
                matchesKeyword(input, keywordVariations.beach)
            );

            // Filter temples
            const filteredTemples = data.temples.filter(temple =>
                temple.name.toLowerCase().includes(input) ||
                matchesKeyword(input, keywordVariations.temple)
            );

            // Combine filtered results
            const filteredData = {
                countries: filteredCountries,
                beaches: filteredBeaches,
                temples: filteredTemples
            };

            displayRecommendations(filteredData);
        })
        .catch(error => console.error('Error fetching the data:', error));
});

document.getElementById('clear-results').addEventListener('click', function() {
    // clear recommendations
    clearRecommendations();
});

function displayRecommendations(data) {
    const container = document.getElementById('recommendations');
    container.style.display = 'flex';

    // Helper function to get current time in a specified time zone
    const getTimeInTimeZone = (timeZone) => {
        const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date().toLocaleTimeString('en-US', options);
    };

    // Display countries and their cities
    data.countries.forEach(country => {
        const countryDiv = document.createElement('div');
        countryDiv.classList.add('recommendation-group');

        const countryTitle = document.createElement('h2');
        countryTitle.textContent = country.name;
        countryDiv.appendChild(countryTitle);

        country.cities.forEach(city => {
            let timeZone;
            if (city.name.includes("Australia")) {
                timeZone = "Australia/Sydney";
            } else if (city.name.includes("Japan")) {
                timeZone = "Asia/Tokyo";
            } else if (city.name.includes("Brazil")) {
                timeZone = "America/Sao_Paulo";
            }

            const currentTime = timeZone ? getTimeInTimeZone(timeZone) : "Time zone not available";
            
            city = {
                ...city,
                currentTime: currentTime
            }
            const cityDiv = createRecommendationCard(city);
            countryDiv.appendChild(cityDiv);
        });

        container.appendChild(countryDiv);
    });

    // Display temples
    if (data.temples.length > 0) {
        const templeDiv = document.createElement('div');
        templeDiv.classList.add('recommendation-group');
        const templeTitle = document.createElement('h2');
        templeTitle.textContent = "Temples";
        templeDiv.appendChild(templeTitle);

        data.temples.forEach(temple => {
            const templeCard = createRecommendationCard(temple);
            templeDiv.appendChild(templeCard);
        });

        container.appendChild(templeDiv);
    }

    // Display beaches
    if (data.beaches.length > 0) {
        const beachDiv = document.createElement('div');
        beachDiv.classList.add('recommendation-group');
        const beachTitle = document.createElement('h2');
        beachTitle.textContent = "Beaches";
        beachDiv.appendChild(beachTitle);
    
        data.beaches.forEach(beach => {
            const beachCard = createRecommendationCard(beach);
            beachDiv.appendChild(beachCard);
        });
    
        container.appendChild(beachDiv);
    }
}

function createRecommendationCard(item) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('recommendation');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;
    cardDiv.appendChild(img);

    const name = document.createElement('h3');
    name.textContent = item.name;
    cardDiv.appendChild(name);

    const description = document.createElement('p');
    description.textContent = item.description;
    cardDiv.appendChild(description);

    if (item.currentTime) {
        const currentTime = document.createElement('p');
        currentTime.textContent = `Current Time: ${item.currentTime}`;
        cardDiv.appendChild(currentTime);
    }
    return cardDiv;
}

function clearRecommendations() {
    console.log('clearRecommendations');
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    container.style.display = 'none';
}