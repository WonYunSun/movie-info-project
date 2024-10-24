import { fetchMovieDetail } from "./movieDetailsApi.js";
import { bookmarkingMovies, getBookmarkingMovies } from "./bookmark.js";

const movies_container = document.getElementById("movies-container");

//텍스트 정보가 들어가는 element 생성 함수
const createElementWithText = (elementType, className, textContent = "") => {
  const element = document.createElement(elementType);
  element.className = className;
  element.textContent = textContent;
  return element;
};

//카드 생성 함수
const createMovieCard = (movies) => {
  if (!movies) return; // movies가 undefined인 경우 종료

  movies_container.innerHTML = ""; // 기존 카드 삭제
  movies.forEach((movie) => {
    const { title, release_date, poster_path, id } = movie;

    const card = document.createElement("div");
    card.className = "movie-card";

    const image = document.createElement("img");
    image.className = "poster-image";

    image.src =
      poster_path === null
        ? "./asset/no_img.png"
        : `https://image.tmdb.org/t/p/w500${poster_path}`;

    const titleElement = createElementWithText("h2", "title", title);
    const releaseDateElement = createElementWithText(
      "p",
      "releseDate",
      release_date.split("-")[0]
    );

    card.appendChild(image);
    card.appendChild(titleElement);
    card.appendChild(releaseDateElement);

    card.value = id;

    movies_container.appendChild(card);
  });
};

// 이벤트 전이 관련 코드
movies_container.onclick = function (e) {
  let target = e.target;

  let card = target.closest(".movie-card");

  if (!card) return; // movie-card 클래스가 없으면 리턴

  fetchMovieDetail(card.value)
    .then((movieDetails) => {
      openModal(movieDetails); // 모달 열기
    })
    .catch((err) => {
      console.error("영화 상세 정보를 가져오는 데 오류 발생:", err);
    });
};

const openModal = (movieDetails) => {
  const existingModal = document.querySelector(".modal");
  if (existingModal) {
    document.body.removeChild(existingModal);
  }

  // 모달 창 생성
  const movieModal = document.createElement("div");
  movieModal.className = "modal";
  movieModal.style.display = "block";
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = () => {
    movieModal.style.display = "none";
    document.body.removeChild(movieModal);
  };

  const bookmarkButton = document.createElement("div");
  bookmarkButton.className = "bookmark-button";
  if (getBookmarkingMovies().includes(movieDetails.id)) {
    bookmarkButton.innerHTML = `<img src="./asset/unbookmark_icon.png"></img> 
    <div class="unbookmark">북마크</div>`;
  } else {
    bookmarkButton.innerHTML = `<img src="./asset/bookmark_icon.png"></img>
    <div>북마크</div>`;
  }
  bookmarkButton.onclick = () => {
    // 북마크 추가/제거 함수 호출
    bookmarkingMovies(movieDetails.id);

    if (getBookmarkingMovies().includes(movieDetails.id)) {
      bookmarkButton.innerHTML = `<img src="./asset/unbookmark_icon.png"></img> 
      <div class="unbookmark">북마크</div>`;
    } else {
      bookmarkButton.innerHTML = `<img src="./asset/bookmark_icon.png"></img>
      <div>북마크</div>`;
    }
  };

  const contents_rightWrap = document.createElement("div");
  contents_rightWrap.className = "contents-rightWrap";
  const title = document.createElement("h2");
  title.id = "movieTitle";
  title.textContent = movieDetails.title; // 영화 제목

  const poster = document.createElement("img");
  poster.id = "moviePoster";
  poster.src =
    movieDetails.poster_path === null
      ? "./asset/no_img.png"
      : `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;

  const overview = document.createElement("p");
  overview.id = "movieOverview";
  overview.textContent = movieDetails.overview;

  const releaseDate = document.createElement("p");
  releaseDate.innerHTML = `개봉일 <span id="releaseDate">${movieDetails.release_date}</span>`; // 개봉일

  const voteAverage = document.createElement("p");
  voteAverage.innerHTML = `평점 <span id="voteAverage">${movieDetails.vote_average}</span>`; // 평점

  const genresDiv = document.createElement("div");
  genresDiv.className = "genres-div";
  movieDetails.genres.forEach((genre) => {
    const genreDiv = document.createElement("p");
    genreDiv.textContent = genre.name;
    genresDiv.appendChild(genreDiv);
  });
  const taglineDiv = document.createElement("div");
  taglineDiv.textContent = movieDetails.tagline;
  taglineDiv.className = "tagline-div";
  const titleWapper = document.createElement("div");
  titleWapper.className = "title-wrapper";
  const subDataWapper = document.createElement("div");
  subDataWapper.className = "subdata-wrapper";

  // 모달 콘텐츠에 요소 추가
  modalContent.appendChild(closeButton);
  modalContent.appendChild(poster);
  titleWapper.appendChild(title);
  titleWapper.appendChild(taglineDiv);
  titleWapper.appendChild(genresDiv);
  contents_rightWrap.appendChild(titleWapper);

  contents_rightWrap.appendChild(overview);
  subDataWapper.appendChild(releaseDate);
  subDataWapper.appendChild(voteAverage);

  contents_rightWrap.appendChild(subDataWapper);

  modalContent.appendChild(contents_rightWrap); // 모달에 콘텐츠 추가
  movieModal.appendChild(modalContent);
  contents_rightWrap.appendChild(bookmarkButton);
  document.body.appendChild(movieModal); // body에 모달 추가

  // 모달 외부 클릭 시 닫기
  window.onclick = (event) => {
    if (event.target === movieModal) {
      movieModal.style.display = "none";
      document.body.removeChild(movieModal); // DOM에서 모달 제거
    }
  };
};

export { createMovieCard };
