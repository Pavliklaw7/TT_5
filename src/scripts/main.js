/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable max-len */
'use strict';

$(document).ready(function() {
  /* Global Variables */
  let countries = [];
  let currentLocation;

  /* Get Phone code */
  const phone = document.querySelector('#phone');

  const initializeCountry = (country) => {
    currentLocation = country;
    phone.value = '+' + currentLocation.calling_code;
  };

  fetch('https://api.ipdata.co/?api-key=test')
    .then(result => result.json())
    .then(data => initializeCountry(data));

  /* Get Countries */
  const countrySelect = document.querySelector('#country');
  const request = require('request');
  const key = '85249190-4601-11eb-9067-21b51bc8dee3';
  const url = `https://geolocation-db.com/json/${key}`;

  setTimeout(() => {
    request({
      url: url,
      json: true,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        countrySelect.value = body.country_code;
      }
    });
  }, 1000);

  const initializeCountries = (fetchedCountries) => {
    countries = fetchedCountries;

    let options = '';

    for (let i = 0; i < countries.length; i++) {
      options += `<option value=${countries[i].alpha2Code}>${countries[i].name}</option>`;
    }
    countrySelect.innerHTML = options;
  };

  fetch('https://restcountries.eu/rest/v2/all')
    .then(response => response.json())
    .then(fetchedCountries => initializeCountries(fetchedCountries))
    .catch(error => console.log('Error:' + error));

  const form = document.querySelector('#form');
  const initiateQuizWrapper = document.querySelector('.quiz__initiate-quiz-wrapper');
  const questionWrapper = document.querySelector('.question');
  const quizFormWrapper = document.querySelector('.quiz__form-wrapper');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const countryName = currentLocation.country_name;
    const phoneNumber = document.querySelector('#phone').value;

    // const initiateQuizWrapper = document.querySelector('.quiz__initiate-quiz-wrapper');

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        email: email,
        phone__number: phoneNumber,
        country: countryName,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });

    $(quizFormWrapper).addClass('hidden');
    $(initiateQuizWrapper).removeClass('hidden');
  });

  /* Start the Quiz */

  const quizStartBtn = document.querySelector('.start-the-quiz__button');

  quizStartBtn.addEventListener('click', () => {
    $(initiateQuizWrapper).addClass('hidden');
    $(questionWrapper).removeClass('hidden');
  });

  /* Quiz */

  const { questions } = require('./questions');
  const questionCounter = document.querySelector('.question__counter');
  const questionTitle = document.querySelector('.question__title');
  const questionContainer = document.querySelector('.question__inner');

  let currentQuestionIndex = 1;

  const promoContainer = document.querySelector('.promo');

  function setNextQuestion() {
    $(`.step-info__item:nth-child(${currentQuestionIndex})`).addClass('step-info__item--active');

    if (currentQuestionIndex > questions.length) {
      questionWrapper.classList.add('hidden');
      promoContainer.classList.remove('hidden');
      postDataToServer();
    } else {
      showQuestion(questions[currentQuestionIndex - 1]);
    }
  }

  setNextQuestion();

  function showQuestion(question) {
    questionCounter.innerText = `Question ${currentQuestionIndex} of ${questions.length}`;
    questionTitle.innerText = question.question;

    question.answers.forEach(answer => {
      const option = document.createElement('div');

      const optionText = `<p class="answer__text">${answer.text}</p>`;
      const optionSvg = answer.svg;

      option.classList.add('answer', 'question__answer');

      option.insertAdjacentHTML('beforeend', optionSvg);
      option.insertAdjacentHTML('beforeend', optionText);
      questionContainer.appendChild(option);
      option.addEventListener('click', selectAnswer);
    });
  }

  const answers = [];

  function selectAnswer(event) {
    const selectedAnswer = event.target;

    for (let i = 0; i < questions.length; i++) {
      answers[`question-${i}`] = selectedAnswer;
    };

    questionContainer.innerHTML = '';

    currentQuestionIndex++;

    setNextQuestion();
  };
});
