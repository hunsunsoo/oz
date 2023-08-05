import React, { useState, useEffect } from 'react';

const RoleSelect = ({middleCon, onHandleMiddleCondition, client, sessionId}) => {
  const images = [
    { src: 'image/roleSelect/dorothys.png' },
    { src: 'image/roleSelect/heosus.png' },
    { src: 'image/roleSelect/lions.png' },
    { src: 'image/roleSelect/tws.png' },
  ];
  // const [selectedImageIndex, setSelectedImageIndex] = useState(null); // 선택된 이미지의 인덱스를 저장하는 상태
  // const [receivedMessages, setReceivedMessages] = useState(null);

  const [selectedImages, setSelectedImages] = useState(Array(images.length).fill(false));
  const [selectedUserIds, setSelectedUserIds] = useState(Array(images.length).fill(null));

  const handleImageSelect = (index, userId) => {
    const newSelectedImages = [...selectedImages];
    const newSelectedUserIds = [...selectedUserIds];

    newSelectedImages[index] = !newSelectedImages[index];
    newSelectedUserIds[index] = newSelectedImages[index] ? userId : null;

    setSelectedImages(newSelectedImages);
    setSelectedUserIds(newSelectedUserIds);
  };

  const handleMiddleCondition = () => {
    const newStatus = middleCon + 1;
    onHandleMiddleCondition(newStatus);
  }

  useEffect(() => {
    subscribeToTopic();
    console.log(sessionId)
  }, []);

  const subscribeToTopic = () => {
    // /sub/socket/role/${sessionId} 경로로 구독 요청
    const subscription = client.subscribe(`/sub/socket/role/${sessionId}`, (message) => {
        console.log('Received message:', message.body);
        
        try {
          // JSON 문자열을 JavaScript 객체로 변환
          const resJsondata = JSON.parse(message.body);
      
          // 객체의 속성을 활용하여 처리
          const type = resJsondata.type;
          const rtcSession = resJsondata.rtcSession;
          const userId = resJsondata.userId;
          const role = resJsondata.data.role;
          const state = resJsondata.data.state;
          const saveState = resJsondata.data.saveState;
      
          // 여기서부터 data 객체의 정보를 활용하여 필요한 작업 수행
          console.log('Received message type:', type);
          console.log('RTC session:', rtcSession);
          console.log('User ID:', userId);
          console.log('Role:', role);
          console.log('State:', state);
          console.log('Save State:', saveState);
      
          // 추가적인 작업 수행
          if (saveState === 1) {
            handleImageSelect(role, userId);
          } else {
            console.log("서버에 반영이 안되었음")
          }
        } catch (error) {
          console.error('Error parsing message body:', error);
        }

    });

    // 언마운트 시 구독 해제 처리 필요할지?

  };



  const sendRoleSelect = async (index) => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
      console.log(index)

      const message = {
        "type":"role",
        "rtcSession":`${sessionId}`,
        "userId":"1",
        "message":"",
        "data":{
            // "role":`${index+1}`,
            "role":2,
            "state":1,
            "saveState":-1
        }
      };

      client.send('/pub/socket/role', {}, JSON.stringify(message));
      console.log('메시지 보냈음');
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const container = {
    height: '60%',
    backgroundColor: '#DDE5B6',
    display: 'flex', // 컨테이너 내부의 요소들을 행으로 배치
    justifyContent: 'center', // 가로 방향 가운데 정렬
    alignItems: 'center', // 세로 방향 가운데 정렬
  };

  const rolebox = {
    height: '85%',
    width: '80%',
  };

  const box1 = {
    height: '15%', // 첫 번째 박스의 높이
    backgroundColor: '#6C584C',
    color: 'white',
    display: 'flex', // 컨테이너 내부의 요소들을 행으로 배치
    justifyContent: 'center', // 가로 방향 가운데 정렬
    alignItems: 'center', // 세로 방향 가운데 정렬
  };

  const box2 = {
    height: '65%', // 두 번째 박스의 높이
    backgroundColor: '#CABE96',
    display: 'flex',
    flexDirection: 'row',
  };

  const box3 = {
    height: '20%', // 두 번째 박스의 높이
    backgroundColor: '#F0EAD2',
  };

  const imgbox = {
    width: '25%',
    height: '100%',
    objectFit: 'cover',
    display: 'flex', // 컨테이너 내부의 요소들을 행으로 배치
    justifyContent: 'center', // 가로 방향 가운데 정렬
    alignItems: 'center', // 세로 방향 가운데 정렬
  };

  const selectedImageStyle = {
    border: '3px solid red', // 선택된 이미지의 테두리 스타일
  };

  const imageStyle = {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    filter: 'drop-shadow(30px 10px 4px rgb(0, 0, 0, 0.7))',
  };

  return (
    <div style={container}>
      <div style={rolebox}>
        <div style={box1}>역할 선택</div>
        <div style={box2}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                ...imgbox,
                ...(selectedImages[index] ? selectedImageStyle : null), // 선택된 이미지일 때 테두리 스타일 적용
              }}
              onClick={() => sendRoleSelect(index)}
            >
              <img src={image.src} alt={`Image ${index}`} style={imageStyle} />
            </div>
          ))}
        </div>
        <div style={box3}>
          <button onClick={() => handleMiddleCondition()}>선택 완료</button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
