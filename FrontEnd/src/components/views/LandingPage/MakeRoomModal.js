import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./MakeRoomModal.module.css";
import { OPENVIDU_SERVER_SECRET, OPENVIDU_SERVER_URL } from "../../../_actions/urls";

function MakeRoomModal({ setIsVisibledModal }) {
    const [cookies, setCookies] = useCookies(); // 쿠키와 설정 함수, 삭제 함수 추출
    const navigate = useNavigate();
    const [mySessionId, setMySessionId] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    const closeModal = () => {
        setIsVisibledModal(false);
    };

    // SessionId 입력 변경 감지 핸들러
    const handleSessionIdChange = (event) => {
        setMySessionId(event.target.value);
    };

    const openInputBox = () => {
        setIsClicked(true);
    };
    const closeInputBox = () => {
        setIsClicked(false);
    }

    // 방 만들기
    const handleCreateSession = () => {
        // 해당 이름의 세션이 존재하는지 확인 - 존재하지 않는다면 방을 만들고 해당 세션아이디를 룸페이지로 넘김
        // 넘어가면 세션에 접속하는 로직 실행
        return new Promise((resolve, reject) => {
        let data = JSON.stringify({ customSessionId: mySessionId });

        axios
            .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
            headers: {
                Authorization: `Basic ${btoa(
                `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
                )}`,
                "Content-Type": "application/json",
            },
            })
            .then((res) => {
            resolve(res.data.id);
            navigate({ pathname: "/game", search: `?SessionId=${res.data.id}&host=1`});
            })
            .catch((res) => {
            let error = Object.assign({}, res);
            if (error?.response?.status === 409) {
                alert("이미 존재하는 세션ID입니다. 다른 이름을 사용해주세요");
            }
            });
        });
    };

    // 방 접속하기
    const handleJoinSession = () => {
        // 해당이름의 세션이 존재하는 지 확인. 있다면 - 4명미만으로 입장이 가능한지
        // 최종 입장이 가능하다면 세션아이디 넘겨주고 room으로
        return new Promise((resolve, reject) => {
        let data = JSON.stringify({ customSessionId: mySessionId });

        axios
            .get(OPENVIDU_SERVER_URL + `/openvidu/api/sessions/` + mySessionId, {
            headers: {
                Authorization: `Basic ${btoa(
                `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
                )}`,
            },
            })
            .then((response) => {
            checkSessionCapacity();
            })
            .catch((response) => {
            let error = Object.assign({}, response);
            if (error?.response?.status === 404) {
                alert(
                "존재하지 않는 세션ID입니다. 방을 만들거나 세션ID를 확인해주세요"
                );
            }
            });
        });
    };

    // 세션 입장 전 인원수 체크
    const checkSessionCapacity = () => {
        axios
        .get(
            `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${mySessionId}/connection`,
            {
            headers: {
                Authorization: `Basic ${btoa(
                `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
                )}`,
            },
            }
        )
        .then((response) => {
            const participantCount = response.data.numberOfElements;
            console.log(participantCount);
            if (participantCount > 4) {
            alert(
                "방에 최대 참가 인원(4명)을 초과하였습니다. 입장이 불가능합니다."
            );
            } else {
            navigate({ pathname: "/game", search: `?SessionId=${mySessionId}&host=0`});
            }
        })
        .catch((error) => {
            console.log("방 정보를 가져오는데 실패하였습니다.", error);
        });
    };

    return (
        <div className={style.modalBox}>           
            
            {isClicked ? (
                    <div>
                        <button className={style.closeInputBox}
                        onClick={closeInputBox}>
                            <i class="fi fi-rr-left"></i>
                        </button>
                        <input className={style.sessionInput}
                            type="text"
                            placeholder="접속할 코드를 입력하세요"
                            value={mySessionId}
                            onChange={handleSessionIdChange}
                        />
                        <button className={style.comeButton}
                        onClick={handleJoinSession}>방 접속하기</button>
                    </div>
                ) : (
                    <div className={style.firstDiv}>
                        <div className={style.labelDiv}
                        >게임 시작 옵션을 선택해 주세요</div>
                        <button className={style.makeRoomButton}
                        onClick={handleCreateSession}>방 만들기</button>
                        <button className={style.inRoomButton}
                        onClick={openInputBox}>방 접속하기</button>
                    </div>
                )
            }

            
            
            <button className={style.closeButton}
            onClick={closeModal}>x</button>
        </div>
    );
}

export default MakeRoomModal;