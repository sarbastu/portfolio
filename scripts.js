let navToggleButton = document.getElementById('nav-toggle-button')
let navLinksList = document.getElementById('nav-links-list')
navToggleButton.addEventListener('click', () => {
  navToggleButton.classList.toggle('active')
  navLinksList.classList.toggle('active')
})
