import { showLoading, hideLoading } from "./movieApi.js";

const titleSearchInput = document.getElementById("title-search-input");

// debounce 함수
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer); // 타이머 초기화
    timer = setTimeout(() => func.apply(this, args), delay); // delay 후에 함수 실행
  };
}

// 검색 제안 목록을 숨기는 함수
function hideSearchSuggestions() {
  const searchSuggestions = document.querySelector(".search-suggestions");
  if (searchSuggestions) {
    searchSuggestions.style.visibility = "hidden"; // 목록 숨기기
  }
}

// 검색 제안 목록을 보여주는 함수
function showSearchSuggestions() {
  let searchSuggestions = document.querySelector(".search-suggestions");

  if (!searchSuggestions) {
    searchSuggestions = document.createElement("div");
    searchSuggestions.className = "search-suggestions";
    titleSearchInput.after(searchSuggestions);
    searchSuggestions.innerHTML =
      "<div class='no-suggestions'>영화 제목을 검색해보세요!</div>";
  }

  searchSuggestions.style.visibility = "visible"; // 목록 보이기
}

// 인풋 포커스 시 제안 목록 표시
titleSearchInput.addEventListener("focus", showSearchSuggestions);

document.addEventListener("click", (e) => {
  const searchSuggestions = document.querySelector(".search-suggestions");

  // 클릭한 요소가 검색 제안 목록이 아닌 경우
  if (
    searchSuggestions &&
    !searchSuggestions.contains(e.target) &&
    e.target.id !== "title-search-input"
  ) {
    hideSearchSuggestions(); // 제안 목록 숨기기
  }
});

function handleInputChange(e) {
  const searchSuggestions = document.querySelector(".search-suggestions");

  if (e.target.value) {
    fetchMovieByTitle(e.target.value, 1).then((searchedMovies) => {
      searchSuggestions.innerHTML = ""; // 이전 제안 제거

      searchedMovies.forEach((movie) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        suggestionItem.textContent = movie.title;

        suggestionItem.addEventListener("click", () => {
          titleSearchInput.value = movie.title; // 클릭 시 제목 설정
          searchSuggestions.innerHTML = ""; // 제안 목록 비우기
        });

        searchSuggestions.appendChild(suggestionItem); // 제안 목록에 추가
      });
    });
  } else {
    // 검색어가 비어있을 경우 제안 목록 비우기
    searchSuggestions.innerHTML =
      "<div class='no-suggestions'>영화 제목을 검색해보세요!</div>";
  }
}

// debounce 적용된 함수
const debouncedInputChange = debounce(handleInputChange, 300);
titleSearchInput.addEventListener("input", debouncedInputChange);

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTM2NjFkZTcxZjAwYzhmNzUyZjI3ZmIzZTQwZmI5ZSIsIm5iZiI6MTcyOTE0MjA3OS44ODc3MjMsInN1YiI6IjY3MGU1YTU5NDJlMTM5MWM1NjY3MGYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HPoAu_-f2J0Os6eL6Y17jVkFJJD848EiHPC1VyXjteo",
  },
};

// 제목 검색 결과
const fetchMovieByTitle = async (query, page) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=ko-KR&page=${page}`,
      options
    );

    const data = await response.json();

    if (data.results) {
      return data.results; // 검색된 영화 목록 반환
    } else {
      console.error("영화 데이터를 가져오는 데 실패했습니다.", data);
    }
  } catch (err) {
    console.error(err);
  }
};
