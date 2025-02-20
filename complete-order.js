/*hamburger menu*/
const menuIcon = document.querySelector(".menu-icon");
const openMenu = menuIcon.querySelector(".open-menu");
const closeMenu = menuIcon.querySelector(".close-menu");
const navLinks = document.querySelector(".nav-links");

closeMenu.style.display = "none";

openMenu.addEventListener("click", () => {
  navLinks.classList.add("active");
  openMenu.style.display = "none";
  closeMenu.style.display = "block";
});

closeMenu.addEventListener("click", () => {
  navLinks.classList.remove("active");
  openMenu.style.display = "block";
  closeMenu.style.display = "none";
});
