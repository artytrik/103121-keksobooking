'use strict';

(function () {
  var DEFAULT_ROOM_NUMBER = 1;
  var DEFAULT_GUEST_NUMBER = 3;

  var TypePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var RoomsCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var success = document.querySelector('.success');
  var formAd = document.querySelector('.ad-form');
  var formAdFieldset = formAd.querySelectorAll('fieldset');
  var formAdType = formAd.querySelector('#type');
  var formAdRooms = formAd.querySelector('#room_number');
  var formAdAddress = formAd.querySelector('#address');
  var formAdPrice = formAd.querySelector('#price');
  var formAdTimeIn = formAd.querySelector('#timein');
  var formAdTimeOut = formAd.querySelector('#timeout');
  var formAdCapacity = formAd.querySelector('#capacity');
  var formAdElements = formAd.querySelectorAll('.ad-form__element');
  var formAdHeader = formAd.querySelector('.ad-form-header');
  var resetButton = formAd.querySelector('.ad-form__reset');

  var onFormAdTimeInChange = function () {
    formAdTimeOut.value = formAdTimeIn.value;
  };

  var onFormAdTimeOutChange = function () {
    formAdTimeIn.value = formAdTimeOut.value;
  };

  var onFormAdTypeChange = function () {
    convertTypeToPrice(formAdType.value.toUpperCase());
  };

  var onFormAdCapacityChange = function (evt) {
    var currentGuests = evt.currentTarget.value;
    var currentRooms = formAdRooms.value;
    isGuestSelected(currentRooms, currentGuests);
  };

  var getAddress = function (coordinates) {
    formAdAddress.value = coordinates.x + ', ' + coordinates.y;
  };

  var convertTypeToPrice = function (type) {
    formAdPrice.placeholder = TypePrice[type];
    formAdPrice.min = TypePrice[type];
  };

  var isGuestSelected = function (rooms, guest) {
    if (!RoomsCapacity[rooms].includes(guest)) {
      return formAdCapacity.setCustomValidity('Необходимо выбрать иное количество гостей');
    }
    return formAdCapacity.setCustomValidity('');
  };

  var onCloseSuccessClick = function () {
    success.classList.add('hidden');
    document.removeEventListener('click', onCloseSuccessClick);
    document.removeEventListener('keydown', onCloseSuccessPressEsc);
  };

  var onCloseSuccessPressEsc = function (evt) {
    window.util.isEscEvent(evt, onCloseSuccessClick);
  };

  var onSendClick = function () {
    formAd.reset();
    window.map.deactivate();
    success.classList.remove('hidden');
    document.addEventListener('click', onCloseSuccessClick);
    document.addEventListener('keydown', onCloseSuccessPressEsc);
  };

  var onResetClick = function (evt) {
    evt.preventDefault();
    deactivateForm();
    window.map.deactivate();
    window.pictures.remove();
  };

  resetButton.addEventListener('click', onResetClick);

  formAd.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(formAd), onSendClick, window.util.renderError);
  });

  var addFormAdListeners = function () {
    formAdTimeIn.addEventListener('change', onFormAdTimeInChange);
    formAdTimeOut.addEventListener('change', onFormAdTimeOutChange);
    formAdType.addEventListener('change', onFormAdTypeChange);
    formAdCapacity.addEventListener('change', onFormAdCapacityChange);
  };

  var removeFormAdListeners = function () {
    formAdTimeIn.removeEventListener('change', onFormAdTimeInChange);
    formAdTimeOut.removeEventListener('change', onFormAdTimeOutChange);
    formAdType.removeEventListener('change', onFormAdTypeChange);
    formAdCapacity.removeEventListener('change', onFormAdCapacityChange);
  };

  var activateForm = function () {
    formAd.classList.remove('ad-form--disabled');
    addFormAdListeners();
    convertTypeToPrice(formAdType.value.toUpperCase());
    isGuestSelected(DEFAULT_ROOM_NUMBER, DEFAULT_GUEST_NUMBER);
    formAdFieldset.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    getAddress(window.map.getPinCoordinates());
    window.pictures.activate();
  };

  var deactivateForm = function () {
    formAd.reset();
    formAdElements.forEach(function (element) {
      element.disabled = true;
    });
    formAdHeader.disabled = true;
    formAd.classList.add('ad-form--disabled');
    removeFormAdListeners();
    window.pictures.deactivate();
    window.pictures.remove();
  };

  window.form = {
    activate: activateForm,
    deactivate: deactivateForm,
    getAddress: getAddress
  };
})();
