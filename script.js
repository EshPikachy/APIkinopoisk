const API_KEY = "1a607760-e17f-4290-9b2d-517e8794ce64";
const BASE_URL = "https://kinopoiskapiunofficial.tech/api";
const API_URL_POPULAR =
  BASE_URL + "/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
const API_URL_SEARCH = BASE_URL + "/v2.1/films/search-by-keyword?keyword=";
const API_DETAILS = BASE_URL + "/v2.2/films/";
const SIMILARS = "/similars";
const pararams = "&page=";

const output = document.querySelector(".output");
const paginationWrap = document.querySelector(".paginationWrap");
const form = document.querySelector("form");
const input = document.querySelector("input");

//states
let activeBtn = 1;
let valuestate = "";
//states

const top100btn = document.querySelector(".top100");
top100btn.addEventListener("click", () => {
  getMovies(API_URL_POPULAR);
  top100btn.classList.add("active");
  input.value = "";
  activeBtn = 1;
  valuestate = "";
});

const getMovies = async (url) => {
  try {
    const request = await fetch(url, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });
    const response = await request.json();
    console.log(response);
    renderMovies(response.films);
    if (response.pagescount === 1) {
      paginationWrap.innerHTML = "";
    } else if (response.pagesCount <= 20) {
      pagination(response.pagesCount);
    } else {
      pagination(20);
    }
  } catch (e) {
    console.log(e);
  }
};
const getText = async (id) => {
  try {
    const request = await fetch(API_DETAILS + id, {
      headers: {
        "X-API-KEY": API_KEY,
      },
    });
    const response = await request.json();
    console.log(id);
    console.log(response);
    renderText(response.description, response.posterUrl);
  } catch (e) {
    console.log(e);
  }
};

const renderText = (text, image) => {
  const p = document.createElement("p");
  const img = document.createElement("img");
  const btn = document.createElement("button");
  const wrap = document.createElement("div");
  btn.textContent = "Назад";
  img.className = "iamge";
  btn.className = "btn";
  wrap.className = "wrap";
  img.src = image;
  p.textContent = text;

  btn.addEventListener("click", () => {
    if (input.value) {
      getMovies(API_URL_SEARCH + valuestate + pararams + activeBtn);
    } else {
      getMovies(API_URL_POPULAR + activeBtn);
    }
  });

  wrap.append(img, p, btn);
  output.append(wrap);
};

getMovies(API_URL_POPULAR);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  valuestate = input.value;
  getMovies(API_URL_SEARCH + input.value);
  top100btn.classList.remove("active");
  activeBtn = 1;
});

const renderMovies = (data) => {
  output.innerHTML = "";
  data.forEach((el) => {
    const filteredNA =
      el.rating === null && "null" ? (el.rating = "N/A") : el.rating;

    const result = el.genres.map((el) => {
      return el.genre;
    });

    const box = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("p");
    const genre = document.createElement("p");
    const circle = document.createElement("div");
    const rating = document.createElement("p");
    box.className = "box";
    circle.className = "circle block";

    genre.textContent = result;
    genre.style.color = "yellow";

    img.src = el.posterUrl;
    name.textContent = el.nameRu;
    rating.textContent = filteredNA;

    box.addEventListener("click", () => {
      output.innerHTML = "";
      getText(el.filmId);
    });

    box.append(img, name, genre, circle);
    circle.append(rating);
    output.append(box);
  });
};

const pagination = (num) => {
  paginationWrap.innerHTML = "";
  const paginationNumbers = [];
  for (let i = 1; i <= num; i++) {
    paginationNumbers.push(i);
  }
  paginationNumbers.forEach((el) => {
    const button = document.createElement("button");
    button.className = el === activeBtn ? "active" : "";
    button.textContent = el;

    button.addEventListener("click", () => {
      activeBtn = el;
      valuestate
        ? getMovies(API_URL_SEARCH + valuestate + pararams + el)
        : getMovies(API_URL_POPULAR + el);
    });
    paginationWrap.append(button);
  });
};
