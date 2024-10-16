// pagination.js
import { fetchMovies, totalPages } from "./movieApi.js";
import { createMovieCard } from "./movieCard.js";

let currentPage = 1; // 현재 페이지

const page_list = document.getElementById("page-list");

const prev_button = document.getElementById("prev-button");
const next_button = document.getElementById("next-button");

// 영화 데이터를 가져오고 카드 생성
const loadMovies = async () => {
  await fetchMovies(currentPage);
  window.scrollTo({ top: 0, behavior: "smooth" }); // 부드러운 스크롤
  createMovieCard(); // 카드 생성
  paginationFnc(totalPages);
};
let startPage = 1;

// 다음 페이지 버튼 클릭 시
next_button.addEventListener("click", () => {
  startPage += 10;
  paginationFnc(totalPages);
});

// 이전 페이지 버튼 클릭 시
prev_button.addEventListener("click", () => {
  if (startPage > 1) {
    startPage -= 10;
    paginationFnc(totalPages);
  }
});

const paginationFnc = (totalPages) => {
  const pageNumberDiv = document.createElement("div");
  pageNumberDiv.className = "page-num-div";

  const endPage = Math.min(startPage + 9, totalPages); // 총 페이지 수를 넘지 않도록

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.value = i; // 버튼의 value 속성에 페이지 번호 저장

    pageButton.addEventListener("click", () => {
      currentPage = Number(pageButton.value);
      loadMovies();
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
loadMovies();
