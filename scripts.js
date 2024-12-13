'use strict';
(() => {
  let navbarToggleButton = document.getElementById('navbar-toggle-button');
  let navbar = document.getElementById('navbar');
  navbarToggleButton.addEventListener('click', () => {
    navbarToggleButton.classList.toggle('active');
    navbar.classList.toggle('active');
  });
})();
