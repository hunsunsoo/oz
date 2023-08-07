import React, { useState, useRef, useEffect } from "react";
import UserVideoWaitingRoom from './UserVideoWaitingRoom';
import style from "./RTCViewCenter.module.css";

const RTCViewCenter = ({ publisher, subscribers, client, sessionId, userId, myNickname }) => {
  const visibleSubscribers = subscribers.slice(0, 3);
  const emptySlots = 3 - visibleSubscribers.length;

  const SERVER_URL = 'http://localhost:8080'

  useEffect(() => {
    const subscribeToChating = (maxRetries = 3, retryInterval = 2000) => {
      let retries = 0;

      const trySubscribe = () => {
        if (!client) {
          if (retries < maxRetries) {
            retries++;
            setTimeout(trySubscribe, retryInterval);
          }
          return;
        }

        const subscription = client.subscribe(`/sub/socket/chat/${sessionId}`, (resMessage) => {
          console.log('Received message:', resMessage.body);
          try {
            const resJson = JSON.parse(resMessage.body);
            const message = resJson.message;
            const Messenger = resJson.data.nickname;

            const saveMsg = {
              Messenger : Messenger,
              message : message
            }

            setChatMessages((prevMessages) => [...prevMessages, saveMsg]);
            
          } catch (error) {
            console.error('Error parsing message body:', error);
          }
        });
      };

      trySubscribe();
    };

    setTimeout(() => {
      subscribeToChating();
    }, 500);
  }, [client, sessionId]);

  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const chatMessagesRef = useRef(null);

  const RTCStyle = {
    backgroundColor: '#DDE5B6',
    height: '70%',
    display: 'flex',
  };

  useEffect(() => {
      scrollToBottom();
    }, [chatMessages]);

  const sendMessage = () => {
      if (inputMessage.trim() !== "") {
          // 입력된 메시지가 비어있지 않으면 채팅 메시지 추가
          setChatMessages((prevMessages) => [...prevMessages, inputMessage]);
          setInputMessage(""); // 입력창 초기화
      }
  };

  const sendMessageOnSocket = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
      const message = {
        "type":"chat",
        "rtcSession":`${sessionId}`,
        "userId":`${userId}`,
        "message":`${inputMessage}`,
        "data":{
          "nickname": `${myNickname}`
        }
      };
  
      client.send('/pub/socket/chat', {}, JSON.stringify(message));
      setInputMessage("");
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
      if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
  };

  return (
      <div style={RTCStyle}>
          <div className={style.videoPage}>
              {publisher !== undefined ? (
                  <div className={style.videoBox} key={publisher.stream.streamId} >
                      <div className={style.nickBox}><p>닉네임</p></div>
                      <UserVideoWaitingRoom streamManager={publisher} />
                  </div>
              ) : null}
              {visibleSubscribers.map((sub, i) => (
                  <div className={style.videoBox} key={sub.stream.streamId} >
                      <div className={style.nickBox}><p>닉네임</p></div>
                      <UserVideoWaitingRoom streamManager={sub} />
                  </div>
              ))}
              {[...Array(emptySlots)].map((_, i) => (
                  <div className={style.videoBox} >
                      <div className={style.nickBox}><p>닉네임</p></div>
                      <div className={style.emptySlot}></div>
                  </div>
                  
              ))}
          </div>
          <div className={style.chatPage}>
              {/* 채팅 메시지 출력 */}
              <div className={style.chatMessages} ref={chatMessagesRef}>
                {chatMessages.map((message, index) => (
                  <p key={index}>
                    <span className={style.Msng}>{message.Messenger}: </span>
                    {message.message}
                  </p>
                ))}
              </div>
              <div className={style.chatInput}>
                  {/* 채팅 입력창 */}
                  <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="채팅을 입력하세요..."
                  />
                  <button onClick={sendMessageOnSocket}>전송</button>
              </div>
          </div>
      </div>
  );
};

export default RTCViewCenter;