const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnReset');

function searchCondition() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const resultDiv = document.getElementById('resultDiv');
  resultDiv.innerHTML = '';

  fetch('./travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let results = [];

      if (input.includes('beach')) {
        results = data.beaches;
      } else if (input.includes('temple')) {
        results = data.temples;
      } else {
        const country = data.countries.find(
          c => c.name.toLowerCase() === input
        );
        if (country) results = country.cities;
      }

      if (results.length > 0) {
        results.forEach(item => {
          // Determine timezone based on country
          let timezone = 'UTC';
          if (item.name.toLowerCase().includes('australia')) timezone = 'Australia/Sydney';
          else if (item.name.toLowerCase().includes('japan')) timezone = 'Asia/Tokyo';
          else if (item.name.toLowerCase().includes('brazil')) timezone = 'America/Sao_Paulo';
          else if (item.name.toLowerCase().includes('india')) timezone = 'Asia/Kolkata';
          else if (item.name.toLowerCase().includes('cambodia')) timezone = 'Asia/Phnom_Penh';
          else if (item.name.toLowerCase().includes('french polynesia')) timezone = 'Pacific/Tahiti';

          // Format current local time for the country
          const localTime = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeStyle: 'medium',
            hourCycle: 'h12'
          }).format(new Date());

          // Display result
          resultDiv.innerHTML += `
            <div class="result-card">
              <h2>${item.name}</h2>
              <img src="${item.imageUrl}" alt="${item.name}">
              <p>${item.description}</p>
              <p><strong>Local Time:</strong> ${localTime}</p>
            </div>
          `;
        });
      } else {
        resultDiv.innerHTML = `<p class="no-result">No recommendations found. Try "beach", "temple", or a country name like "Japan".</p>`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.innerHTML = '<p class="error">An error occurred while fetching data.</p>';
    });
}

// Clear button logic
function clearResults() {
  const resultDiv = document.getElementById('resultDiv');
  const input = document.getElementById('searchInput');
  resultDiv.innerHTML = '';
  input.value = '';
}

btnSearch.addEventListener('click', searchCondition);
btnClear.addEventListener('click', clearResults);
