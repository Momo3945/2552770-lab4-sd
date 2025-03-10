document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('#input');
    const button = document.querySelector('button');
    const countryInfoSection = document.querySelector('#country-info');
    const borderingCountriesSection = document.querySelector('#bordering-countries');

    button.addEventListener('click', () => {
        const country = inputField.value.trim();
        if (!country) {
            alert('Please enter a valid country name');
            return;
        }

        fetch(`https://restcountries.com/v3.1/name/${country}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || data.length === 0) {
                    throw new Error('Country not found');
                }
                const countryData = data[0]; 
                displayCountryInfo(countryData);
                diplayBorderingCountries(countryData);
            })
            .catch((error) => {
                console.error('Error:', error);
                countryInfoSection.innerHTML = `<p>Country not found. Try again.</p>`;
                borderingCountriesSection.innerHTML = '';
            });
    });

    function displayCountryInfo(countryData) {
        countryInfoSection.innerHTML = `
            <h2>${countryData.name.common}</h2>
            <p>Capital: ${countryData.capital ? countryData.capital[0] : 'N/A'}</p>
            <p>Population: ${countryData.population.toLocaleString()}</p>
            <p>Region: ${countryData.region}</p>
            <img src="${countryData.flags.png}" alt="Flag of ${countryData.name.common}" width="150">
        `;
    }
    function diplayBorderingCountries(countryData){
        if (!countryData.borders || countryData.borders.length === 0) {
            borderingCountriesSection.innerHTML = `<p>No bordering countries.</p>`;
            return;
        }
                fetch(`https://restcountries.com/v3.1/alpha?codes=${countryData.borders.join(',')}`)
            .then(response => response.json())
            .then(bordersData => {
                let borderContent = `<h3>Bordering Countries:</h3>`;
                bordersData.forEach(borderCountry => {
                    borderContent += `
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.png}" alt="Flag of ${borderCountry.name.common}" width="75">
                    `;
                });
                borderingCountriesSection.innerHTML = borderContent; 
            })
            .catch(error => {
                console.error('Error fetching bordering countries:', error);
                borderingCountriesSection.innerHTML = `<p>Could not fetch bordering countries.</p>`;
            });

    }
});
