const movies = document.querySelector('.movies');


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(resposta => {
    if (!resposta.ok) {
        return console.log("ERRO");
    }

    const promise = resposta.json()
    promise.then(function (body) {
        body.results.slice(0, 5).forEach(i => {
            console.log(i);
            const div__movie = document.createElement('div');
            div__movie.classList.add('movie');
            div__movie.style.backgroundImage = `url(${i.poster_path})`;

            const div__info = document.createElement('div');
            div__info.classList.add('movie__info');

            const span__title = document.createElement('span');
            span__title.classList.add('movie__title');
            span__title.textContent = i.title

            const span__rating = document.createElement('span');
            span__rating.classList.add('movie__rating');
            span__rating.textContent = i.vote_average;

            const img_estrela = document.createElement('img');
            img_estrela.src = "./assets/estrela.svg"

            span__rating.append(img_estrela);
            div__info.append(span__title, span__rating);
            div__movie.append(div__info);
            movies.append(div__movie);
        });
    });
});