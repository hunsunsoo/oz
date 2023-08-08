import axios from 'axios';

// 여러 컴포넌트에서 공통적으로 필요한 메서드 작성

const SERVER_URL = 'http://localhost:8080';

// 내가 방장인지 확인하는 메서드
// 해당 세션의 방장 userId값 반환
export async function amIHost(searchSessionId){
  const url = `${SERVER_URL}/socket/room?rtcSession=${searchSessionId}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error while fetching data:', error);
    return null;
  }
}