document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://randomuser.me/api/?results=25');
    const data = await response.json();
    const users = data.results;

    const genderData = processGenderData(users);
    const ageData = processAgeData(users);
    const countryData = processCountryData(users);
    const registrationYearData = processRegistrationYearData(users);

    createGenderChart(genderData);
    createAgeHistogram(ageData);
    createCountryList(countryData);
    createRegistrationYearChart(registrationYearData);
});

function processGenderData(users) {
    const genderCounts = { male: 0, female: 0 };
    users.forEach(user => genderCounts[user.gender]++);
    return genderCounts;
}

function processAgeData(users) {
    const ageGroups = { "20-29": 0, "30-39": 0, "40-49": 0, "50-59": 0, "60-69": 0, "70-79": 0, "80+": 0 };
    users.forEach(user => {
        const age = user.dob.age;
        if (age >= 20 && age < 30) ageGroups["20-29"]++;
        else if (age >= 30 && age < 40) ageGroups["30-39"]++;
        else if (age >= 40 && age < 50) ageGroups["40-49"]++;
        else if (age >= 50 && age < 60) ageGroups["50-59"]++;
        else if (age >= 60 && age < 70) ageGroups["60-69"]++;
        else if (age >= 70 && age < 80) ageGroups["70-79"]++;
        else ageGroups["80+"]++;
    });
    return ageGroups;
}

function processCountryData(users) {
    const countryCounts = {};
    users.forEach(user => {
        const country = user.location.country;
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    return countryCounts;
}

function processRegistrationYearData(users) {
    const yearCounts = {};
    users.forEach(user => {
        const year = new Date(user.registered.date).getFullYear();
        yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    return yearCounts;
}

function createGenderChart(genderData) {
    const ctx = document.getElementById('genderChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                label: 'Número de Usuarios',
                data: [genderData.male, genderData.female],
                backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--gender-chart-color-male'), 
                                  getComputedStyle(document.documentElement).getPropertyValue('--gender-chart-color-female')]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createAgeHistogram(ageData) {
    const ctx = document.getElementById('ageHistogram').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ageData),
            datasets: [{
                label: 'Número de Usuarios',
                data: Object.values(ageData),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--age-chart-color')
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createCountryList(countryData) {
    const countryList = document.getElementById('countryList');
    for (const [country, count] of Object.entries(countryData)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${country}: ${count} usuarios`;
        listItem.classList.add('list-group-item');
        countryList.appendChild(listItem);
    }
}

function createRegistrationYearChart(registrationYearData) {
    const ctx = document.getElementById('registrationYearChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(registrationYearData),
            datasets: [{
                label: 'Número de Usuarios',
                data: Object.values(registrationYearData),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--registration-chart-color'),
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function toggleChart(chartId) {
    const containerId = `${chartId}Container`;
    const container = document.getElementById(containerId);
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}
