import { options } from "./apiConfig.js";

let movies; // 전역 변수로 선언
let totalPages;

const loadingIcon = document.getElementById("loading-icon");
//로딩 관련 함수
const showLoading = () => {
  loadingIcon.style.display = "block"; // 로딩 아이콘 표시
};

const hideLoading = () => {
  loadingIcon.style.display = "none"; // 로딩 아이콘 숨기기
};

// 영화 데이터를 가져오는 함수
const fetchMovies = async (page) => {
  showLoading(); // 데이터 요청 전 로딩 아이콘 표시

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=${page}&sort_by=popularity.desc`,
      options
    );
    const data = await response.json();

    if (data.results) {
      hideLoading();
      movies = data.results;
      totalPages = data.total_pages;
      return movies;
    } else {
      hideLoading();
      console.error("영화 데이터를 가져오는 데 실패했습니다.", data);
    }
  } catch (err) {
    hideLoading();
    console.error(err);
  }
};

export { fetchMovies, movies, totalPages, showLoading, hideLoading };
