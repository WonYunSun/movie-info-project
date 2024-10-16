// movieApi.js
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTM2NjFkZTcxZjAwYzhmNzUyZjI3ZmIzZTQwZmI5ZSIsIm5iZiI6MTcyODk5NDI5Mi4wOTQ1NjgsInN1YiI6IjY3MGU1YTU5NDJlMTM5MWM1NjY3MGYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZjptcWP7FtfQJILaVOvkMnk4z8Ltekq_CfgQMbRqztM",
  },
};

let movies; // 전역 변수로 선언

// 영화 데이터를 가져오는 함수
const fetchMovies = async (page) => {
  console.log("fetchMovies 실행");
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=${page}&sort_by=popularity.desc`,
      options
    );
    const data = await response.json();
    console.log(data); // 응답 데이터를 출력

    if (data.results) {
      movies = data.results; // 받아온 데이터를 movies에 저장
      return movies; // movies 반환
    } else {
      console.error("영화 데이터를 가져오는 데 실패했습니다.", data);
    }
  } catch (err) {
    console.error(err);
  }
};

// movies와 fetchMovies를 내보냅니다
export { fetchMovies, movies };
