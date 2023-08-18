import React from "react";
import "./gameexplain.module.css";
const Stage1Explain = [
  {
    index: 1,
    character: "허수아비",
    title: <>허수아비를 도와 문제를 풀어라 </>,
    message: (
      <>
        <ul>
          <li>10초 동안 보여 주는 36칸의 숫자판을 최대한 외운다.</li>
          <br />
          <li>제시된 수를 보고 조력자들이 상의하는 동안 문제를 푼다.</li>
          <br />
          <li>5초 동안 조력자가 골라 준 숫자 여섯 개를 확인한다.</li>
          <br />
          <li>문제를 풀어 정답을 제출한다.</li>
        </ul>
      </>
    ),
  },
  {
    index: 2,
    character: "조력자",
    title: <>허수아비를 도와 문제를 풀어라</>,
    message: (
      <>
        <ul>
          <li>10초 동안 보여 주는 36칸의 숫자판을 최대한 외운다.</li>
          <br />
          <li>20초 동안 허수아비에게 보여 줄 6개의 판을 선택한다.</li>
          <br />
          <li>문제를 맞힐 수 있게 허수아비를 응원한다.</li>
        </ul>
      </>
    ),
  },
];

const Stage2Explain = [
  {
    index: 1,
    character: "모두",
    title: <>사자가 함정을 피해 출구에 도착할 수 있게 도와주자</>,
    message: (
      <>
        <ul>
          <li>
            맵 어딘가에 위치한 열쇠를 획득하고 출구로 도착하세요. 
            <br />각 방은 상하좌우네 방향으로 이동 가능합니다.
          </li>
          <br />
          <li>각 방은 빨강, 초록, 파랑 중 하나의 고유한 색상이 있습니다.</li>
          <br />
          <li>지도는 고유한 색상의 방과 장애물 위치를 알 수 있습니다.</li>
        </ul>
      </>
    ),
  },
  {
    index: 2,
    character: "사자",
    title: <>사자가 함정을 피해 출구에 도착할 수 있게 도와주자</>,
    message: (
      <>
        <ul>
          <li>방향키의 ↑ 키는 앞으로 이동하는 키이다.</li>
          <br />
          <li>방향키의 ←, → 키는 각 방향으로 90도 회전하는 키이다.</li>
          <br />
          <li>보고 있는 방향의 다음 칸 색상이 보이게 된다.</li>
          <br />
          <li>열쇠의 위치를 파악해 찾은 다음 출구로 도착해야 한다. </li>
        </ul>
      </>
    ),
  },
  {
    index: 3,
    character: "조력자",
    title: <>사자가 함정을 피해 출구에 도착할 수 있게 도와주자</>,
    message: (
      <>
        <ul>
          <li>각 조력자는 서로 다른 색상이 표시된 지도를 보게 된다.</li>
          <br />
          <li>지도에는 폭탄, 구덩이, 출발지와 도착지가 각각 표시되어 있다.</li>
          <br />
          <li>
            사자와 다른 조력자들과 상의하여 위치를 공유하고
            <br />사자가 무사히 도착할 수 있게 도와주어야 한다.
          </li>
        </ul>
      </>
    ),
  },
];
const Stage3Explain = [
  {
    index: 1,
    character: "양철나무꾼",
    title: <>알맞은 상형문자로 양철나무꾼의 심장을 채워 주세요!</>,
    message: (
      <>
        <ul>
          <li>양철 나무꾼의 심장에는 3개의 칸과 3개의 문자가 들어 있다.</li>
          <br />
          <li>조력자들의 설명을 통해 알맞은 상형문자를 고른다.</li>
          <br />
          <li>상형문자를 드래그해 모든 빈칸을 채운 후 정답을 제출한다.</li>
        </ul>
      </>
    ),
  },
  {
    index: 2,
    character: "조력자",
    title: <>알맞은 상형문자로 양철나무꾼의 심장을 채워 주세요!</>,
    message: (
      <>
        <ul>
          <li>각 조력자들은 나무꾼의 심장의 일부분만 볼 수 있다.</li>
          <br />

          <li>
            본인이 보이는 문자와 나무꾼의 빈칸을 유추해<br />
            정답을 찾을 수 있게 설명해 주어야 한다.
          </li>
        </ul>
      </>
    ),
  },
];

const Stage4Explain = [
  {
    index: 1,
    character: "도로시",
    title: <>최종 스테이지! 마녀를 혼내 주세요!</>,
    message: (
      <>
        <ul>
          <li>동료들이 그린 그림을 보고 첫 제시어가 무엇일지 유추한다.</li>
          <br />
          <li>유추한 답을 쓰고 정답 제출을 눌러 마녀를 혼내 준다.</li>
        </ul>
      </>
    ),
  },
  {
    index: 2,
    character: "조력자",
    title: <>최종 스테이지! 마녀를 혼내 주세요!</>,
    message: (
      <>
        <ul>
          <li>제시된 제시어의 그림을 순서대로 7초씩 이어 그린다.</li>
          <br />
          <li>이어 그린 그림을 도로시가 맞힐 수 있게 응원한다.</li>
        </ul>
      </>
    ),
  },
];

export { Stage1Explain, Stage2Explain, Stage3Explain, Stage4Explain };
