package com.fire4bird.oz.game.catchmind.manager;

import com.fire4bird.oz.game.catchmind.dto.req.StartReq;
import com.fire4bird.oz.game.catchmind.entity.DrawingData;
import com.fire4bird.oz.game.catchmind.repository.CatchmindDataRepository;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.extern.slf4j.Slf4j;

import java.util.Random;

@Slf4j
public class CatchmindGameManager {
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final CatchmindDataRepository catchmindDataRepository;

    public CatchmindGameManager(SocketRepository socketRepository, RedisPublisher redisPublisher, CatchmindDataRepository catchmindDataRepository) {
        this.socketRepository = socketRepository;
        this.redisPublisher = redisPublisher;
        this.catchmindDataRepository = catchmindDataRepository;
    }

    public DrawingData startGame(StartReq req) {
        Random random = new Random();
        int drawingId = random.nextInt(100)+1; // 1부터 100까지의 데이터라고 가정했음
        DrawingData drawingData = catchmindDataRepository.findByDrawingId(drawingId);
        String answer = drawingData.getAnswer();
        System.out.println(answer);

        for(int i=2; i<5; i++)
            publisher(req.getRtcSession(),"draw/start/"+i,"게임 시작 제시어 전달", answer);
        publisher(req.getRtcSession(),"draw/start/"+1,"게임 시작", null);

        return drawingData;
    }

    public void publisher(String rtcSession, String url, String msg, Object data){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(rtcSession)
                .message(msg)
                .type(url)
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(rtcSession), message);
    }

}
