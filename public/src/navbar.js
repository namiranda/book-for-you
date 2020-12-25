function mobileMenu() {

    const menu = document.querySelector('#mobile-menu');
    const burger = document.querySelector('#burger');
    const menuSvg = document.querySelector('#menu');
    const xSvg = document.querySelector('#x');

    if (burger) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            menuSvg.classList.toggle('hidden');
            xSvg.classList.toggle('hidden');

        })
    }

}

function profileDropdown() {
    const userIcon = document.querySelector("#user-menu");
    const profilePanel = document.querySelector("#profile-dropdown");

    if (userIcon) {
        userIcon.addEventListener("click", () => {
            profilePanel.classList.toggle('hidden');
        })
    }
}

profileDropdown();
mobileMenu();