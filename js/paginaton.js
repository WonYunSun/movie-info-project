// pagination.js
import { fetchMovies, totalPages } from "./movieApi.js";
import { createMovieCard } from "./movieCard.js";
import { fetchMovieByTitle } from "./movieSearch.js";
import { movies } from "./movieApi.js";
import { filteredMovies, filterdTotalPages } from "./movieSearch.js";
import { getBookmarkingMovies } from "./bookmark.js";
import { fetchMovieDetail } from "./movieDetail.js";

let searchQuery = sessionStorage.getItem("searchQuery");

let currentPage = 1; // 현재 페이지
let endPage;
const page_list = document.getElementById("page-list");

const prev_button = document.getElementById("prev-button");
const next_button = document.getElementById("next-button");

const loadBookmarkedMovies = async () => {
  const bookmarkedMovieIds = getBookmarkingMovies();

  if (bookmarkedMovieIds.length === 0) {
    document.getElementById(
      "movies-container"
    ).innerHTML = `<div>북마크한 영화가 없습니다.</div>`;
    return;
  }

  // 모든 영화 ID에 대해 fetchMovieDetail 호출
  const bookmarkMovies = await Promise.all(
    bookmarkedMovieIds.map((id) => fetchMovieDetail(id))
  );

  // 데이터를 기반으로 영화 카드를 생성
  if (bookmarkMovies.length > 0) {
    createMovieCard(bookmarkMovies); // movieDetails는 영화 디테일 배열
    endPage = Math.ceil(bookmarkMovies.length / 20);
    paginationFnc(endPage);
  } else {
    console.log("영화 가져오기 실패");
  }
};

// 영화 데이터를 가져오고 카드 생성
const loadMovies = async (fetchFunction, query) => {
  let data;
  if (query === "bookmarked") {
    await loadBookmarkedMovies();
    return;
  }
  if (query) {
    // 제목별 검색의 경우
    data = await fetchFunction(query, currentPage);
    createMovieCard(filteredMovies);
    endPage = filterdTotalPages;
  } else {
    // 전체 영화 데이터 로드의 경우
    data = await fetchFunction(currentPage);
    createMovieCard(movies);
    endPage = totalPages;
  }

  if (!data) {
    return;
  }

  if (data.length === 0) {
    document.getElementById(
      "movies-container"
    ).innerHTML = `<div>검색 결과가 없습니다.</div>`;
  }
  window.scrollTo({ top: 0, behavior: "smooth" }); // 부드러운 스크롤
  paginationFnc(endPage);
};

let startPage = 1;

// 다음 페이지 버튼 클릭 시
next_button.addEventListener("click", () => {
  startPage += 10;
  paginationFnc(endPage);
});

// 이전 페이지 버튼 클릭 시
prev_button.addEventListener("click", () => {
  if (startPage > 1) {
    startPage -= 10;
    paginationFnc(endPage);
  }
});

const paginationFnc = (endPages) => {
  const pageNumberDiv = document.createElement("div");
  pageNumberDiv.className = "page-num-div";

  const endPage = Math.min(startPage + 9, endPages); // 총 페이지 수를 넘지 않도록

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.value = i; // 버튼의 value 속성에 페이지 번호 저장

    pageButton.addEventListener("click", () => {
      currentPage = Number(pageButton.value);
      if (window.location.pathname.split("/").pop() === "index.html") {
        loadMovies(fetchMovies);
      } else if (window.location.pathname.split("/").pop() === "search.html") {
        loadMovies(fetchMovieByTitle, "범죄");
      } else if (
        window.location.pathname.split("/").pop() === "myBookmark.html"
      ) {
      }
      paginationFnc(totalPages);
    });

    if (pageButton.value == currentPage) {
      pageButton.style.backgroundColor = "#cdcecf";
    }

    pageNumberDiv.appendChild(pageButton);
  }
  page_list.innerHTML = ""; // 기존 버튼 삭제
  page_list.appendChild(pageNumberDiv); // 새로 생성한 버튼 추가
};

// 초기 영화 데이터 로드
if (window.location.pathname.split("/").pop() === "index.html") {
  loadMovies(fetchMovies);
} else if (window.location.pathname.split("/").pop() === "search.html") {
  console.log(searchQuery);
  loadMovies(fetchMovieByTitle, searchQuery);
} else if (window.location.pathname.split("/").pop() === "myBookmark.html") {
  loadMovies(loadBookmarkedMovies, "bookmakred");
}

const SearchedTitleContainer = document.getElementById(
  "searched-title-container"
);

if (searchQuery) {
  SearchedTitleContainer.innerHTML = `
    <div id="searched-title-container">
      <div class="searched-title"><span>"${searchQuery}"</span> 의 검색결과</div>
    </div>`;
}
