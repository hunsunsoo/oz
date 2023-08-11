package com.fire4bird.oz.game.test;


import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class testController {

    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;

    @MessageMapping("/socket/draw")
    public void drawing(DrawReq req){
        SocketMessage msg = new SocketMessage();

        msg.setType("socket/draw");
        msg.setRtcSession(req.getSessionId());
        msg.setMessage("그림 그리기 좌표 send 테스트");
        msg.setData(req);

        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }
}
