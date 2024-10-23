function bookmarkingMovies(movieId) {
  let bookmarkMovies = JSON.parse(localStorage.getItem("bookmarkMovies")) || [];

  // 이미 있는 ID면 삭제하고, 없으면 추가
  if (bookmarkMovies.includes(movieId)) {
    bookmarkMovies = bookmarkMovies.filter((movie) => movie !== movieId);
  } else {
    console.log("없음");
    bookmarkMovies.unshift(movieId);
  }

  localStorage.setItem("bookmarkMovies", JSON.stringify(bookmarkMovies));
}

function getBookmarkingMovies() {
  return JSON.parse(localStorage.getItem("bookmarkMovies")) || [];
}

export { bookmarkingMovies, getBookmarkingMovies };
