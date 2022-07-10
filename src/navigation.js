let maxPage;
let page = 1;
let infiniteScroll; 

searchFormBtn.addEventListener("click", () => {
    location.hash = `#search=${searchFormInput.value}`});
trendingBtn.addEventListener("click", () => location.hash = "#trends");
arrowBtn.addEventListener("click", () => {history.back()});
homeBtn.addEventListener("click", () => location.hash = "#home");

window.addEventListener("hashchange", navigator, false);
window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("scroll", infiniteScroll, false);
window.addEventListener("scroll", createTopBtn, false);

function navigator(){
    console.log({ location });
    // createTopBtn();
    if(infiniteScroll){
        window.removeEventListener("scroll", infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith("#trends")){
        trendsPage();
    }
    else if(location.hash.startsWith("#search=")){
        searchPage();
    }
    else if(location.hash.startsWith("#movie=")){
        movieDetailsPage();
    }
    else if(location.hash.startsWith("#category=")){
        categoriesPage();
    }
    else{
        homePage();
    }
   document.body.scrollTop = 0;
   document.documentElement.scrollTop = 0;

   if(infiniteScroll){
    window.addEventListener("scroll", infiniteScroll, false)
   }

}

function homePage(){
    console.log("5");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.add("inactive");
    homeBtn.classList.add("inactive");
    headerCategoryTitle.classList.add("inactive");
    headerTitle.classList.remove("inactive");
    searchForm.classList.remove("inactive");
    trendingPreviewSection.classList.remove("inactive");
    likedMoviesSection.classList.remove("inactive");
    categoriesPreviewSection.classList.remove("inactive");
    genericList.classList.add("inactive");
    movieDetailsSection.classList.add("inactive");

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

function categoriesPage(){
    console.log("4");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    homeBtn.classList.remove("inactive");
    homeBtn.classList.remove("home-btn--white");
    headerCategoryTitle.classList.remove("inactive");
    headerTitle.classList.add("inactive");
    searchForm.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericList.classList.remove("inactive");
    movieDetailsSection.classList.add("inactive");

    const [_, urlInfo] = location.hash.split("=");
    const [catId, catName] = urlInfo.split("-");
    headerCategoryTitle.innerHTML = catName;
    getMoviesByCategory(catId);
    // createTopBtn();
    infiniteScroll = getPaginatedMoviesByCategory(catId);
    

}

function movieDetailsPage(){
    console.log("3");
    headerSection.classList.add("header-container--long");
    //headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.add("header-arrow--white");
    homeBtn.classList.remove("inactive");
    homeBtn.classList.add("home-btn--white");
    headerCategoryTitle.classList.add("inactive");
    headerTitle.classList.add("inactive");
    searchForm.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericList.classList.add("inactive");
    movieDetailsSection.classList.remove("inactive");

    const [_, movieId] = location.hash.split("=");
    getMovieById(movieId);
    getRelatedMovies(movieId);
}

function searchPage(){
    console.log("2");
    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    homeBtn.classList.remove("inactive");
    homeBtn.classList.remove("home-btn--white");
    headerCategoryTitle.classList.add("inactive");
    headerTitle.classList.add("inactive");
    searchForm.classList.remove("inactive");
    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericList.classList.remove("inactive");
    movieDetailsSection.classList.add("inactive");

    const [_, query] = location.hash.split("=");
    if(query == ""){
        console.log("intro");
        const categories = [{name: "Ingrese su búsqueda"}]
        messageQuery(categories);
    }
    else{
    getMoviesByQuery(query);}
    infiniteScroll = getPaginatedMoviesByQuery(query);
}
function trendsPage(){
    console.log("1");
    headerSection.classList.remove("header-container--long");
    headerSection.style.background = "";
    arrowBtn.classList.remove("inactive");
    arrowBtn.classList.remove("header-arrow--white");
    homeBtn.classList.remove("inactive");
    homeBtn.classList.remove("home-btn--white");
    headerCategoryTitle.classList.remove("inactive");
    headerTitle.classList.add("inactive");
    searchForm.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    genericList.classList.remove("inactive");
    movieDetailsSection.classList.add("inactive");
    headerCategoryTitle.innerHTML = 'Tendencias';


    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;

}
