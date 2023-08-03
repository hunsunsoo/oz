import React, { Component } from 'react';

export default class RoleSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: null, // 선택된 이미지의 인덱스를 저장하는 상태
    };
  }

  handleImageClick = (index) => {
    if (this.state.selectedImageIndex === index) {
      // 이미 선택된 이미지를 다시 누를 경우 선택 취소
      this.setState({ selectedImageIndex: null });
    } else {
      // 새로운 이미지를 선택할 경우 선택
      this.setState({ selectedImageIndex: index });
    }
  };

  render() {
    const container = {
      height: '60%',
      backgroundColor: '#DDE5B6',
      display: 'flex', // 컨테이너 내부의 요소들을 행으로 배치
      justifyContent: 'center', // 가로 방향 가운데 정렬
      alignItems: 'center', // 세로 방향 가운데 정렬
    }

    const rolebox = {
      height: '85%',
      width: '80%',
    }

    const box1 = {
      height: '15%', // 첫 번째 박스의 높이
      backgroundColor: '#6C584C',
      color:'white',
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
      filter: 'drop-shadow(30px 10px 4px rgb(0, 0, 0, 0.7))'
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
                    ...(this.state.selectedImageIndex === index && selectedImageStyle), // 선택된 이미지에 스타일 적용
                  }}
                  onClick={() => this.handleImageClick(index)}
                >
                  <img src={image.src} alt={`Image ${index}`} style={imageStyle} />
                </div>
              ))}
          </div>
          <div style={box3}>
            {/* <button onClick={() => this.setState({ selectedImageIndex: null })}>선택 취소</button> */}
            <button>선택 완료</button>
          </div>
        </div>
      </div>
    );
  }
}
const images = [
  { src: 'roleselect/dorothys.png' },
  { src: 'roleselect/heosus.png' },
  { src: 'roleselect/lions.png' },
  { src: 'roleselect/tws.png' },
];
