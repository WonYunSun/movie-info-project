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
      hideLoading(); // 데이터 로드 완료 후 로딩 아이콘 숨기기
      movies = data.results; // 받아온 데이터를 movies에 저장
      totalPages = data.total_pages;
      // total_result.innerText = "검색 건수 : " + data.total_results + "건";
      return movies; // movies 반환
    } else {
      hideLoading(); // 데이터 로드 완료 후 로딩 아이콘 숨기기
      console.error("영화 데이터를 가져오는 데 실패했습니다.", data);
    }
  } catch (err) {
    hideLoading(); // 데이터 로드 완료 후 로딩 아이콘 숨기기
    console.error(err);
  }
};

export { fetchMovies, movies, totalPages, showLoading, hideLoading };
