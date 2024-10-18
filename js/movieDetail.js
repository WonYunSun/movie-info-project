import { options } from "./apiConfig.js";

// 영화 디테일
const fetchMovieDetail = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
      options
    );

    const data = await response.json();

    if (data) {
      return data; // 검색된 영화 목록 반환
    } else {
      console.error("영화 데이터를 가져오는 데 실패했습니다.", data);
    }
  } catch (err) {
    console.error(err);
  }
};

export { fetchMovieDetail };
