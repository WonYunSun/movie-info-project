// movieCard.js
import { movies } from "./movieApi.js";

const movies_container = document.getElementById("movies-container");

const createElementWithText = (elementType, className, textContent = "") => {
  const element = document.createElement(elementType);
  element.className = className;
  element.textContent = textContent;
  return element;
};

const createMovieCard = () => {
  if (!movies) return; // movies가 undefined인 경우 종료

  movies_container.innerHTML = ""; // 기존 카드 삭제
  movies.forEach((movie) => {
    const { title, overview, poster_path, vote_average } = movie;

    const card = document.createElement("div");
    card.className = "movie-card";

    const image = document.createElement("img");
    image.className = "poster-image";
    image.src = `https://image.tmdb.org/t/p/w500${poster_path}`;

    const titleElement = createElementWithText("h2", "title", title);
    const overviewElement = createElementWithText("p", "overview", overview);
    const voteAverageElement = createElementWithText(
      "p",
      "vote-average",
      `평점 평균: ${Math.round(vote_average)}`
    );

    card.appendChild(image);
    card.appendChild(titleElement);
    card.appendChild(overviewElement);
    card.appendChild(voteAverageElement);

    movies_container.appendChild(card);
  });
};

export { createMovieCard };
