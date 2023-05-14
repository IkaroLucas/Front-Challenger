const movies = document.querySelector('.movies');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');

const input_search = document.querySelector('.input');

const div_highlight_video = document.querySelector('.highlight__video');
const h3_highlight_title = document.querySelector('.highlight__title');
const span_highlight_rating = document.querySelector('.highlight__rating')
const span_highlight_genres = document.querySelector('.highlight__genres');
const span_highlight_launch = document.querySelector('.highlight__launch');
const p_highlight_description = document.querySelector('.highlight__description');
const a_highlight_videolink = document.querySelector('.highlight__video-link')

const div_modal = document.querySelector('.modal');
const h3_modal = document.querySelector('.modal__title');
const img_modal = document.querySelector('.modal__img');
const p_modal = document.querySelector('.modal__description')
const div_modal_average = document.querySelector('.modal__average');
const close_modal = document.querySelector('.modal__close');
const div_modal_genres = document.querySelector('.modal__genres');

const btn_theme = document.querySelector('.btn-theme');
const body = document.querySelector('body');


let moviesData = [];
let x = 0;
let y = 5;
let bodyMovieDay = [];
let DarkMode = false;

function getMovieData(search) {
    let q = '';
    if (search) {
        q = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=` + search;
    } else {
        q = `https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false`;
    };
    fetch(q).then(resposta => {
        return resposta.json()
    }).then(body => {
        moviesData = body.results
        renderCarrosel()
    }).catch(error => {
        return console.log(error.message);
    })
};

function renderCarrosel() {
    movies.innerHTML = '';
    moviesData.slice(x, y).forEach(i => {
        const div__movie = document.createElement('div');
        div__movie.classList.add('movie');
        div__movie.style.backgroundImage = `url(${i.poster_path})`;

        const div__info = document.createElement('div');
        div__info.classList.add('movie__info');

        const span__title = document.createElement('span');
        span__title.classList.add('movie__title');
        span__title.textContent = i.title;

        const span__rating = document.createElement('span');
        span__rating.classList.add('movie__rating');
        span__rating.textContent = i.vote_average;

        const img_estrela = document.createElement('img');
        img_estrela.src = "./assets/estrela.svg";

        const idMovie = i.id.toString()
        span__rating.append(img_estrela);
        div__info.append(span__title, span__rating);
        div__movie.append(div__info);
        movies.append(div__movie);

        renderModal(div__movie, idMovie);
    });
};

function getMovieDay() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(resposta => {
        return resposta.json()
    }).then(body => {
        bodyMovieDay = body;
        renderMovieDay();
    }).catch(error => {
        return console.log(error.message);
    });

    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(resposta => {
        return resposta.json()
    }).then(body => {
        bodyMovieDay = body;
        a_highlight_videolink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    }).catch(error => {
        return console.log(error.message);
    });


};

function renderMovieDay() {
    div_highlight_video.style.backgroundImage = `url(${bodyMovieDay.backdrop_path})`;
    div_highlight_video.style.backgroundSize = 'cover';
    h3_highlight_title.textContent = bodyMovieDay.title;
    span_highlight_rating.textContent = bodyMovieDay.vote_average;

    let generosString = '';
    for (let i = 0; i < bodyMovieDay.genres.length; i++) {
        generosString += bodyMovieDay.genres[i].name;
        if (i !== bodyMovieDay.genres.length - 1) {
            generosString += ', ';
        }
    }
    span_highlight_genres.textContent = generosString;
    const releaseDate = bodyMovieDay.release_date;
    const dateObj = new Date(releaseDate);
    const dataFormatada = dateObj.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

    span_highlight_launch.textContent = dataFormatada;
    p_highlight_description.textContent = bodyMovieDay.overview;
};


function renderModal(div__movie, id) {
    div__movie.addEventListener('click', function (e) {

        div_modal.classList.remove("hidden")

        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(resposta => {
            return resposta.json()
        }).then(body => {
            h3_modal.textContent = body.title;
            img_modal.src = body.backdrop_path;
            p_modal.textContent = body.overview;
            div_modal_average.textContent = body.vote_average;

            for (let i = 0; i < body.genres.length; i++) {
                const span_genre = document.createElement('span');
                span_genre.classList.add('modal__genre');
                span_genre.textContent = body.genres[i].name;
                div_modal_genres.append(span_genre);
            }
        }).catch(error => {
            return console.log(error.message);
        })

    })
};

close_modal.addEventListener('click', function () {
    div_modal.classList.add("hidden");
    div_modal_genres.textContent = 0;
});

btn_prev.addEventListener('click', function (event) {
    x -= 5;
    y -= 5;
    if (moviesData.length < 4) {
        x = 0;
        y = 5;
    };
    if (x < 0) {
        x = moviesData.length - 5;
        y = moviesData.length;
    };
    renderCarrosel();
});

btn_next.addEventListener('click', function (event) {
    x += 5;
    y += 5;
    if (moviesData.length < 4) {
        x = 0;
        y = 5;
    };
    if (y > moviesData.length) {
        x = 0;
        y = 5;
    };
    renderCarrosel();
});


input_search.addEventListener('keydown', e => {
    if (e.key != 'Enter') return;

    x = 0;
    y = 5;

    const search = input_search.value

    getMovieData(search);

    input_search.value = '';
})

btn_theme.addEventListener('click', function () {
    if (DarkMode) {
        btn_theme.src = './assets/light-mode.svg';
        btn_next.src = './assets/seta-direita-preta.svg'
        btn_prev.src = './assets/seta-esquerda-preta.svg'
        body.style.setProperty('--background-color', '#fff');
        body.style.setProperty('--color', '#000');
        body.style.setProperty('--highlight-background', '#fff')
        body.style.setProperty('--highlight-description', '#000');
        DarkMode = false;
    } else {
        btn_theme.src = './assets/dark-mode.svg';
        btn_next.src = './assets/seta-direita-branca.svg'
        btn_prev.src = './assets/seta-esquerda-branca.svg'
        body.style.setProperty('--background-color', 'rgb(24, 24, 24)');
        body.style.setProperty('--color', '#fff');
        body.style.setProperty('--highlight-background', 'rgb(24, 24, 24)')
        body.style.setProperty('--highlight-description', '#fff');
        DarkMode = true;
    }
});

getMovieData();
getMovieDay();