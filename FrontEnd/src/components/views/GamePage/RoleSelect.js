import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { setGameUserInfo } from "../../../_actions/game_actions";
// import { useSelector } from "react-redux";

const RoleSelect = ({
  middleCon,
  onHandleMyRole,
  onHandleRoundId,
  onHandleMiddleCondition,
  client,
  sessionId,
  userId,
}) => {
  // 도로시 1, 사자 2, 허수아비 3, 양철 나무꾼 4
  const [s0, setS0] = useState(-1);
  const [s1, setS1] = useState(-1);
  const [s2, setS2] = useState(-1);
  const [s3, setS3] = useState(-1);
  const [myRole, setMyRole] = useState(0);
  // const dispatch = useDispatch();

  // const myRoleRDX = useSelector(
  //    (state) => state.gameUserReducer.gameUsers.myRole
  // );

  // 조건부 렌더링을위한 콜백함수
  const handleMiddleCondition = () => {
    const newStatus = middleCon + 1;
    onHandleMiddleCondition(newStatus);
  };

  useEffect(() => {
    setTimeout(subscribeToRoleSelect(), 200);
    setTimeout(subscribeSelectComplete(), 300);
  }, []);

  const subscribeToRoleSelect = () => {
    // /sub/socket/role/${sessionId} 경로로 구독 요청
    const subscription = client.subscribe(
      `/sub/socket/role/${sessionId}`,
      (message) => {
        console.log("Received message:", message.body);

        try {
          // JSON 문자열을 JavaScript 객체로 변환
          const resJsondata = JSON.parse(message.body);

          // 객체의 속성을 활용하여 처리
          const resuserId = resJsondata.userId;
          const role = resJsondata.data.role;
          const state = resJsondata.data.state;
          const saveState = resJsondata.data.saveState;

          // 누가 무엇을 골랐는지 상태 저장할 메서드 호출
          if (saveState === 1) {
            if (state === 1) {
              handleSelectRes(role - 1, resuserId);
            } else if (state === -1) {
              handleCancelRes(role - 1, resuserId);
            }
          } else {
            console.log("서버에 반영이 안되었음");
          }
        } catch (error) {
          console.error("Error parsing message body:", error);
        }
      }
    );
  };

  const subscribeSelectComplete = () => {
    const subscription1 = client.subscribe(
      `/sub/socket/round/start/${sessionId}`,
      (message) => {
        console.log("Received message:", message.body);
        try {

          const resJson = JSON.parse(message.body);
          const resJsonData = resJson.data;
          const resRoundId = resJsonData.roundId;

          handleMiddleCondition();
          onHandleRoundId(resRoundId);
        } catch (error) {
          console.error("Error parsing message body:", error);
        }
      }
    );
  };

  // 선택 상태 저장 갱신
  const handleSelectRes = (role, resuserId) => {
    if (role === 0) {
      setS0(resuserId);
    } else if (role === 1) {
      setS1(resuserId);
    } else if (role === 2) {
      setS2(resuserId);
    } else if (role === 3) {
      setS3(resuserId);
    }

    if (resuserId === userId) {
      setMyRole(role + 1);
      onHandleMyRole(role + 1); // props 전달용
      // dispatch(setGameUserInfo({ myRole: role+1 })); // redux용
    }
  };

  const handleCancelRes = (role, resuserId) => {
    if (role === 0) {
      setS0(-1);
    } else if (role === 1) {
      setS1(-1);
    } else if (role === 2) {
      setS2(-1);
    } else if (role === 3) {
      setS3(-1);
    }

    if (resuserId === userId) {
      setMyRole(0);
      onHandleMyRole(0); // props 전달용
      // dispatch(setGameUserInfo({ myRole: null })); // redux용
    }
  };

  const sendRoleSelect = async (index) => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }
      var msgstate = 1;

      if (index === 0) {
        if (s0 === userId) {
          msgstate = -1;
        } else if (s0 >= 0) {
          alert("내가 선택한 캐릭터가 아닙니다!");
          return;
        }
      } else if (index === 1) {
        if (s1 === userId) {
          msgstate = -1;
        } else if (s1 >= 0) {
          alert("내가 선택한 캐릭터가 아닙니다!");
          return;
        }
      } else if (index === 2) {
        if (s2 === userId) {
          msgstate = -1;
        } else if (s2 >= 0) {
          alert("내가 선택한 캐릭터가 아닙니다!");
          return;
        }
      } else if (index === 3) {
        if (s3 === userId) {
          msgstate = -1;
        } else if (s3 >= 0) {
          alert("내가 선택한 캐릭터가 아닙니다!");
          return;
        }
      }

      const message = {
        type: "role",
        rtcSession: `${sessionId}`,
        userId: `${userId}`,
        message: "",
        data: {
          role: `${index + 1}`,
          state: `${msgstate}`,
          saveState: -1,
        },
      };

      client.send("/pub/socket/role", {}, JSON.stringify(message));
      console.log("메시지 보냈음");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleSelectComplete = () => {
    if (s0 === -1 || s1 === -1 || s2 === -1 || s3 === -1) {
      alert("아직 역할 선택을 하지 않은 인원이 있습니다!");
    } else {
      sendSelectComplete();
    }
  };

  const sendSelectComplete = async () => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }

      const userRoleArray = [
        { userId: s0, role: 1 },
        { userId: s1, role: 2 },
        { userId: s2, role: 3 },
        { userId: s3, role: 4 },
      ];

      const message = {
        userRole: userRoleArray,
        teamName: `${localStorage.getItem("TeamName")}`,
        rtcSession: `${sessionId}`,
        userId: `${userId}`,
      };
      console.log(message);
      client.send("/pub/round/start", {}, JSON.stringify(message));
      console.log("메시지 보냈음");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const container = {
    height: "70%",
    // backgroundColor: "#DDE5B6",
    display: "flex", // 컨테이너 내부의 요소들을 행으로 배치
    justifyContent: "center", // 가로 방향 가운데 정렬
    alignItems: "center", // 세로 방향 가운데 정렬
  };

  const rolebox = {
    height: "85%",
    width: "80%",
  };

  const box1 = {
    height: "15%", // 첫 번째 박스의 높이
    backgroundColor: "#6C584C",
    fontWeight: 'bold', 
    fontSize: '20px',
    color: "white",
    display: "flex", // 컨테이너 내부의 요소들을 행으로 배치
    justifyContent: "center", // 가로 방향 가운데 정렬
    alignItems: "center", // 세로 방향 가운데 정렬
    borderRadius: "40px 40px 0 0",
    fontSize: "28px"
  };

  // const box2 = {
  //   height: "65%", // 두 번째 박스의 높이
  //   backgroundColor: "#CABE96",
  //   display: "flex",
  //   flexDirection: "row",
  // };

  const box2 = {
    height: "60%", // 두 번째 박스의 높이
    backgroundColor: "#F0EAD2",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  };

  const box3 = {
    height: "23%",
    backgroundColor: "#F0EAD2",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "2%",
    borderRadius: "0 0 40px 40px",
  }

  const boxCha = {
    backgroundColor: "#CABE96",
    width: "20%",
    height: "80%",
    margin: "4% 3% 1% 3%"
  }

  const nameBox = {
    backgroundColor: "#A98467",
    height: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    color: "#F0EAD2"
  }

  const imgbox = {
    width: "100%",
    height: "85%",
    objectFit: "cover",
    display: "flex", // 컨테이너 내부의 요소들을 행으로 배치
    justifyContent: "center", // 가로 방향 가운데 정렬
    alignItems: "center", // 세로 방향 가운데 정렬
  };

  const dorothySelected = {
    boxShadow: s0 !== -1 ? "0 0 10px 2px blue" : "none",
    // backgroundColor: isMySelectedImage(0) ? 'rgba(255, 0, 0, 0.7)' : 'none',
  };

  const lionSelected = {
    boxShadow: s1 !== -1 ? "0 0 10px 2px blue" : "none",
    // backgroundColor: isMySelectedImage(1) ? 'rgba(255, 0, 0, 0.7)' : 'none',
  };

  const heoSelected = {
    boxShadow: s2 !== -1 ? "0 0 10px 2px blue" : "none",
    // backgroundColor: isMySelectedImage(2) ? 'rgba(255, 0, 0, 0.7)' : 'none',
  };

  const twmanSelected = {
    boxShadow: s3 !== -1 ? "0 0 10px 2px blue" : "none",
    // backgroundColor: isMySelectedImage(3) ? 'rgba(255, 0, 0, 0.7)' : 'none',
  };

  const nextButton = {
    padding: '1%',
    fontSize: '20px',         // font-size 속성
    backgroundColor: '#6C584C',
    color: '#c9be96',
    border: 'none',
    fontWeight: 'bold', 
    borderRadius: '20px',
    cursor: 'pointer',
    height: '57%',
    width: '20%'              // width 속성
  };

  const imageStyle = {
    width: "80%",
    height: "80%",
    objectFit: "contain",
    filter: "drop-shadow(30px 10px 4px rgb(0, 0, 0, 0.7))",
  };

  return (
    <div style={container}>
      <div style={rolebox}>
        <div style={box1}>역할 선택</div>
        <div style={box2}>
          <div style={boxCha}>
            <div style={nameBox}>도로시</div>
            <div
              key={0}
              style={{ ...imgbox, ...dorothySelected }}
              onClick={() => sendRoleSelect(0)}
            >
              <img
                src="/image/roleSelect/dorothys.png"
                alt={"Image 0"}
                style={imageStyle}
              />
            </div>
          </div>
          <div style={boxCha}>
            <div style={nameBox}>사자</div>
            <div
              key={1}
              style={{ ...imgbox, ...lionSelected }}
              onClick={() => sendRoleSelect(1)}
            >
              <img
                src="/image/roleSelect/lions.png"
                alt={"Image 1"}
                style={imageStyle}
              />
            </div>
          </div>
          <div style={boxCha}>
            <div style={nameBox}>허수아비</div>
            <div
              key={2}
              style={{ ...imgbox, ...heoSelected }}
              onClick={() => sendRoleSelect(2)}
            >
              <img
                src="/image/roleSelect/heosus.png"
                alt={"Image 2"}
                style={imageStyle}
              />
            </div>
          </div>
          <div style={boxCha}>
            <div style={nameBox}>양철 나무꾼</div>
            <div
              key={3}
              style={{ ...imgbox, ...twmanSelected }}
              onClick={() => sendRoleSelect(3)}
            >
              <img
                src="/image/roleSelect/tws.png"
                alt={"Image 3"}
                style={imageStyle}
              />
            </div>
          </div>
        </div>
        <div style={box3}>
          <img
            src="/image/tools/roleSelBtn.png"
            style={{width: "25%", height: "120%"}}
            onClick={() => handleSelectComplete()}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
