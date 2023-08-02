import React, { Component } from "react";

class UserVideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    const { streamManager } = this.props;
    if (streamManager !== undefined && this.videoRef.current !== null) {
      // 스트림 매니저의 스트림을 video 요소에 추가
      streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentWillUnmount() {
    const { streamManager } = this.props;
    if (streamManager !== undefined && this.videoRef.current !== null) {
      // 컴포넌트가 언마운트되면 스트림 매니저에서 video 요소를 제거
      streamManager.removeVideoElement(this.videoRef.current);
    }
  }

  render() {
    return (
      <div>
        {/* 스트림을 표시하는 video 요소 */}
        <video
          ref={this.videoRef}
          autoPlay
          style={{
            width: "266px",
            height: "200px",
            backgroundColor: "black",
            marginLeft: "50px"
          }}
        />
      </div>
    );
  }
}

export default UserVideoComponent;
