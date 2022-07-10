

const api = axios.create({
    baseURL:"https://api.themoviedb.org/3/",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
    params: {
        "api_key": API_KEY
    }
});

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem("liked_movies"));
    let movies;
    if(item){
        movies = item;
    }
    else {
        movies ={};
    }
    return movies;
}

function likeMovie(movie){
    const likedMovies = likedMoviesList();
    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;;
    }
    else {
        likedMovies[movie.id] = movie;
    };
    localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
    if(location.hash.startsWith("#home")){
        location.reload();
    }
};

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        //console.log({entry});
        if(entry.isIntersecting){
        const url = entry.target.getAttribute("data-img");
        entry.target.setAttribute("src", url);
    }
    });
});

function createTopBtn() {
        const topBtn = document.querySelector(".top-btn");
        
        if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100){
        
        topBtn.classList.remove("inactive");
        topBtn.addEventListener("click", 
           () => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
           } 
        );}
        else{
            topBtn.classList.add("inactive"); 
        }
        
}

function messageQuery(categories){
    categoriesGenerator(genericSection, categories);
    // const messageContainer = document.createElement("div");
    // messageContainer.classList.add("category-container");
    //     const messageTitle = document.createElement("h3");
    //     messageTitle.classList.add("category-title");
    //     const messageTitleText = document.createTextNode("Por favor Ingrese su búsqueda");
    //     messageTitle.appendChild(messageTitleText);
    //     messageContainer.appendChild(messageTitle);
       
}

function movieGenerator(
    container, 
    movies, 
    {
        lazyLoad = false, 
        clean = true
    } = {}
    ){
    if(clean){
    container.innerHTML = "";
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement("div");
         movieContainer.classList.add("movie-container");
        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.addEventListener("click", () => {location.hash = `#movie=${movie.id}`})
       
        movieImg.setAttribute("alt", movie.title);
        
        // Lazy Loader
        movieImg.setAttribute(lazyLoad ? "data-img" : "src", 
        "https://image.tmdb.org/t/p/w300/" + movie.poster_path);
        movieImg.addEventListener("error", () => {
            movieImg.setAttribute("src", "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/BLZJHTB27ZHUPKK3A7GXTMIEQA.jpg");
        });
        const likeBtn = document.createElement("button");
        likeBtn.classList.add("like-btn");
        likeBtn.innerText = "♥";

        likedMoviesList()[movie.id] && likeBtn.classList.add("like-btn--liked");

        likeBtn.addEventListener("click", ()=>{
            likeBtn.classList.toggle("like-btn--liked")

            likeMovie(movie);
            
        })

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }
        
        
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(likeBtn);
        container.appendChild(movieContainer);
        
    });
}

function categoriesGenerator(container, categories){
    container.innerHTML = "";
       
    categories.forEach(category => {
         const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");
        const categoryTitle = document.createElement("h3");
        categoryTitle.addEventListener("click", () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        categoryTitle.classList.add("category-title");
        categoryTitle.setAttribute("id", "id" + category.id);
        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

async function getCategoriesPreview(){
    const { data } = await api("genre/movie/list");
    const categories = data.genres;
    categoriesGenerator(categoriesPreviewList, categories)
   
}

async function getMoviesByCategory(id){
    let apiId= "discover/movie";
    const { data } = await api( apiId, {
        params: {
            with_genres: id}
        }
        );
        const movies = data.results;
        maxPage = data.total_pages;

    movieGenerator(genericSection, movies, {lazyLoad: true, clean: true});  
}
function getPaginatedMoviesByCategory(id){
    return async function(){
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api( "discover/movie", {
            params: {
                with_genres: id,
                page}
            }
            );
        const movies = data.results;
        movieGenerator(genericSection, movies, 
            {lazyLoad: true, clean: false});
      }
    }
    }

async function getTrendingMoviesPreview(){
    const { data } = await api("trending/movie/day");
   
    const movies = data.results;
    movieGenerator(trendingMoviesPreviewList, movies, {lazyLoad: true});

    
}
async function getMoviesByQuery(query){
    const { data } = await api("search/movie", {
        params: {
            query}
        }
        );
        const movies = data.results;
        console.log(movies);
        maxPage = data.total_pages;
   
   
    movieGenerator(genericList, movies, {lazyLoad: true});
}
function getPaginatedMoviesByQuery(query){
    return async function(){
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api("search/movie", {
            params: {
                query, 
                page}
            });

        const movies = data.results;
       
        
        movieGenerator(genericSection, movies, 
            {lazyLoad: true, clean: false});
      }
    }
    }

async function getMovieById(id){
    const { data: movie } = await api("movie/" + id);

    const moviePoster = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
   
    headerSection.style.background = 
    `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${moviePoster}),center`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    categoriesGenerator(movieDetailCategoriesList, movie.genres);
}

async function getRelatedMovies(id){
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    movieGenerator(relatedMoviesContainer, relatedMovies, {lazyLoad: true});
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
  
    movieGenerator(genericSection, movies, {lazyLoad: true, clean: true});

    // const loadMoreBtn = document.createElement("button");
    // loadMoreBtn.innerText = "Cargar mas";
    // loadMoreBtn.addEventListener("click", getPaginatedTrendingMovies);
    // genericSection.appendChild(loadMoreBtn);
  }

async function getPaginatedTrendingMovies(){
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;

    if(scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', 
        {
            params: {
                page
            }
        });
        const movies = data.results;

        
        movieGenerator(genericSection, movies, 
            {lazyLoad: true, clean: false});
      }
      
       // const loadMoreBtn = document.createElement("button");
    //     loadMoreBtn.innerText = "Cargar mas";
    //     loadMoreBtn.addEventListener("click", getPaginatedTrendingMovies);
    //     genericSection.appendChild(loadMoreBtn);
    }
    
function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const likedMoviesArray = Object.values(likedMovies);
    console.log(likedMoviesArray);

    movieGenerator(likedMoviesArticle, likedMoviesArray, {lazyLoad:true, clean: true});
}

