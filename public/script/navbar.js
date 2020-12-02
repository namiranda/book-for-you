function mobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const burger = document.querySelector('#burger');
    const menuSvg = document.querySelector('#menu');
    const xSvg = document.querySelector('#x');

    burger.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        menuSvg.classList.toggle('hidden');
        xSvg.classList.toggle('hidden');

    })
}

mobileMenu();