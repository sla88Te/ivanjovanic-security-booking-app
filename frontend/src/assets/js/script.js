
window.onload = () => {

    let formClose = document.querySelector('#form-close');

    let menu = document.querySelector('#menue-bar')
    let navBar = document.querySelector('.navbar')

    let videoBtn = document.querySelectorAll('.vid-btn')

    let swipe = document.querySelectorAll('.swiper-slide')

    let logInBtn = document.getElementById('login');
    let loginPlaceEmail = document.getElementById('loginFormEmail');

    let logedIn = false;

    if(logedIn) {
        formBtn.classList.add('active');
    }

    window.onscroll = () => {
        menu.classList.remove('fa-times')
        navBar.classList.remove('active')
        //loginForm.classList.remove('active')
    }

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times')
        navBar.classList.toggle('active')
    })
    

    videoBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.controls .active').classList.remove('active')
            btn.classList.add('active')
            let src = btn.getAttribute('data-src')
            document.querySelector('.video-slider').src = src
        })
    })

}

