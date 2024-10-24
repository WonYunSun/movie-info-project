import { options } from "./apiConfig.js";

const titleSearchInput = document.getElementById("title-search-input");
const SearchButton = document.getElementById("search-button");

// debounce 함수
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
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
  }

  searchSuggestions.style.visibility = "visible"; // 목록 보이기
  showHistoryList();
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

      if (searchedMovies.length === 0) {
        // 검색 결과가 없을 경우
        searchSuggestions.innerHTML = `<div class="no-suggestions">검색 결과가 없습니다.</div>`;
      } else {
        // 검색 결과가 있을 경우
        searchedMovies.forEach((movie) => {
          const suggestionItem = document.createElement("div");
          suggestionItem.className = "suggestion-item";
          suggestionItem.textContent = movie.title;

          suggestionItem.addEventListener("click", () => {
            titleSearchInput.value = movie.title; // 클릭 시 제목 설정
            searchSuggestions.innerHTML = "";
          });

          searchSuggestions.appendChild(suggestionItem); // 제안 목록에 추가
        });
      }
    });
  }
  if (e.target.value === "") {
    showHistoryList();
  }
}

const showHistoryList = () => {
  const searchSuggestions = document.querySelector(".search-suggestions");
  const removeHistory = document.createElement("div");
  removeHistory.innerHTML = "<span>모두 삭제</span>";
  searchSuggestions.innerHTML =
    '<div class="recent-searhced"><div>최근 검색어</div><span id="remove-history">모두 삭제</span></div>';

  const searchHistory = getSearchHistory();

  searchHistory.forEach((history) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "suggestion-item";
    suggestionItem.textContent = history;
    suggestionItem.addEventListener("click", () => {
      titleSearchInput.value = history; // 클릭 시 제목 설정
      searchSuggestions.style.visibility = "hidden";
    });
    document.getElementById("remove-history").addEventListener("click", () => {
      localStorage.clear();
      searchSuggestions.innerHTML = "";
    });
    searchSuggestions.appendChild(suggestionItem);
  });
};

// debounce 적용된 함수
const debouncedInputChange = debounce(handleInputChange, 300);
titleSearchInput.addEventListener("input", debouncedInputChange);

let filteredMovies;
let filterdTotalPages;
// 제목 검색 결과
const fetchMovieByTitle = async (query, page) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=ko-KR&page=${page}`,
      options
    );

    const data = await response.json();

    if (data.results) {
      filteredMovies = data.results;
      filterdTotalPages = data.total_pages;
      return filteredMovies; // 검색된 영화 목록 반환
    } else {
      console.error("영화 데이터를 가져오는 데 실패했습니다.", data);
    }
  } catch (err) {
    console.error(err);
  }
};

SearchButton.addEventListener("click", function (e) {
  e.preventDefault();

  const searchInput = titleSearchInput.value;
  if (searchInput.trim() === "") {
    // 검색어가 없을 때 알림을 표시
    alert("검색어를 입력해 주세요.");
  } else {
    //세션에 검색어 저장
    sessionStorage.setItem("searchQuery", searchInput);

    //검색히스토리 추가
    addSearchQuery(searchInput);
    // search.html로 이동
    window.location.href = "search.html";
  }
});

function addSearchQuery(searchInput) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory = searchHistory.filter((value) => value !== searchInput);
  // 검색어 추가
  searchHistory.unshift(searchInput);

  // 로컬 스토리지에 업데이트
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// 검색어 기록 불러오기
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

export { fetchMovieByTitle, filteredMovies, filterdTotalPages };
