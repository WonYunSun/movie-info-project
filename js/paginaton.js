// pagination.js
import { fetchMovies } from "./movieApi.js";
import { createMovieCard } from "./movieCard.js";

let currentPage = 1; // 현재 페이지

// const movies_container = document.getElementById("movies-container");
const prev_button = document.getElementById("prev-button");
const next_button = document.getElementById("next-button");

// 영화 데이터를 가져오고 카드 생성
const loadMovies = async () => {
  await fetchMovies(currentPage);
  createMovieCard(); // 카드 생성
};

// 다음 페이지 버튼 클릭 시
next_button.addEventListener("click", () => {
  currentPage++;
  loadMovies();
  // 페이지 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: "smooth" }); // 부드러운 스크롤
});

// 이전 페이지 버튼 클릭 시
prev_button.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadMovies();
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" }); // 부드러운 스크롤
  }
});

// 초기 영화 데이터 로드
loadMovies();
