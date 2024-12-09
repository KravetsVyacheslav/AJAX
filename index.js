import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { error, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchBox = document.getElementById('search-box');
const countryInfo = document.getElementById('country-info');

searchBox.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  if (searchQuery === '') {
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      }
    })
    .catch(err => {
      countryInfo.innerHTML = '';
      error({
        text: 'No country found. Please enter a valid country name.',
      });
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => `<p>${country.name}</p>`)
    .join('');
  countryInfo.innerHTML = markup;
}

function renderCountryInfo(country) {
  const { name, capital, population, languages, flag } = country;
  const languagesList = languages.map(lang => lang.name).join(', ');

  const markup = `
    <h2>${name}</h2>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b> ${languagesList}</p>
    <img src="${flag}" alt="Flag of ${name}" width="200" />
  `;
  countryInfo.innerHTML = markup;
}
