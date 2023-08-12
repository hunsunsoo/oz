package com.fire4bird.oz.game.catchmind.manager;

import com.fire4bird.oz.game.catchmind.dto.req.StartReq;
import com.fire4bird.oz.game.catchmind.dto.req.ReadyReq;
import com.fire4bird.oz.game.catchmind.dto.res.SendSeggestwordRes;
import com.fire4bird.oz.game.catchmind.entity.Catchmind;
import com.fire4bird.oz.game.catchmind.entity.CatchmindData;
import com.fire4bird.oz.game.catchmind.repository.CatchmindDataRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Slf4j
@AllArgsConstructor
public class CatchmindGameManager {
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final CatchmindDataRepository catchmindDataRepository;

    private String answer; // 제시어(정답)
    private String userAnswer; // 유저 제출 정답

    private Map<String, int[]> ready;

    public CatchmindGameManager(SocketRepository socketRepository, RedisPublisher redisPublisher, CatchmindDataRepository catchmindDataRepository) {
        this.socketRepository = socketRepository;
        this.redisPublisher = redisPublisher;
        this.catchmindDataRepository = catchmindDataRepository;

        this.answer = " ";
        this.userAnswer = " ";

        this.ready = new HashMap<>();
    }

    public void checkReady(int role, String rtcSession, int state){
        int check = 1;

        if (ready.containsKey(rtcSession)) {
            int[] roles = ready.get(rtcSession);
            roles[role-1] = state;
            ready.replace(rtcSession, roles);
        } else {
            int[] newRoles = new int[4];
            newRoles[role-1] = state;
            ready.put(rtcSession, newRoles);
        }

        int[] roles = ready.get(rtcSession);
        for (int people : roles){
            if (people == 0){
                check = -1;
                break;
            }
        }

        publisher(rtcSession, "catchmind/ready", "게임 준비 확인", check);
    }

    public Catchmind startGame(StartReq req, Round findRound, int turn) {
        Random random = new Random();
        int drawingId = random.nextInt(100)+1; // 1부터 100까지의 데이터라고 가정했음

        CatchmindData catchmindData = catchmindDataRepository.findByDrawingId(drawingId);
        String answer = catchmindData.getAnswer();

        System.out.println(answer);

        publisher(req.getRtcSession(),"catchmind/start","게임 시작.. 조력자에게 제시어 줄거야", answer);

        String userAnswer = " ";

        String drawingPicture = " "; // 이게 이미지 저장인데 멀티파일 뭐시기로 바꿔야함


        return Catchmind.builder()
                .catchmindData(catchmindData)
                .answer(answer)
                .drawingPicture(drawingPicture)
                .userAnswer(userAnswer)
                .turn(turn)
                .round(findRound)
                .build();
    }



    public void publisher(String rtcSession, String url, String msg, Object data){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(rtcSession)
                .message(msg)
                .type(url)
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

}
