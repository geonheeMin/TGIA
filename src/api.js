import axios from "axios";
const api = axios.create({
  // 구름 컨테이너 사용시 localhost -> 해당 ip로 바꾼다.
  // 8080 포트 번호도 수정
  // baseURL: "http://localhost:8080",
  baseURL: "http://220.194.133.70:8080/",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // 쿠키, 세션 사용 위해 설정
});
export default api;
