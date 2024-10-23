function addBookmarkingMovies(movieId) {
  let bookmarkMovies = JSON.parse(localStorage.getItem("bookmarkMovies")) || [];
  bookmarkMovies = bookmarkMovies.filter((movie) => movie !== movieId);

  bookmarkMovies.push(movieId);

  localStorage.setItem("bookmarkMovies", JSON.stringify(bookmarkMovies));
}

function getBookmarkingMovies() {
  return JSON.parse(localStorage.getItem("bookmarkMovies")) || [];
}

export { addBookmarkingMovies, getBookmarkingMovies };
