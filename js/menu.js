const closeMenuBtn = document.getElementById('menu_close');
const openMenuBtn = document.getElementById('menu_open');
const menuMobile = document.getElementById('menu_mobile');

closeMenuBtn.addEventListener('click', closeMenu);
openMenuBtn.addEventListener('click', openMenu)

function closeMenu(){
    DocumentBody.style.overflow = 'visible'
    menuMobile.style.display = 'none';
}

function openMenu(){
    DocumentBody.style.overflow = 'hidden'
    menuMobile.style.display = 'block';
}