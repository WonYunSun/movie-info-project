const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTM2NjFkZTcxZjAwYzhmNzUyZjI3ZmIzZTQwZmI5ZSIsIm5iZiI6MTcyODk5NDI5Mi4wOTQ1NjgsInN1YiI6IjY3MGU1YTU5NDJlMTM5MWM1NjY3MGYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZjptcWP7FtfQJILaVOvkMnk4z8Ltekq_CfgQMbRqztM",
  },
};

const fetchMovies = async () => {
  console.log("fetchMovies 실행");
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc",
      options
    );
    const data = await response.json();
    console.log(data); // 응답 데이터를 출력
  } catch (err) {
    console.error(err);
  }
};

fetchMovies();
