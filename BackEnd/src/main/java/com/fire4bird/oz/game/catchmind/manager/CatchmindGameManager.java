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
    private CatchmindDataRepository catchmindDataRepository;

    private String answer; // 제시어(정답)
    private String userAnswer; // 유저 제출 정답

    private Map<String, int[]> ready;

    public CatchmindGameManager(SocketRepository socketRepository, RedisPublisher redisPublisher) {
        this.socketRepository = socketRepository;
        this.redisPublisher = redisPublisher;

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
        int drawingId = random.nextInt(2)+1; // 1부터 100까지의 데이터라고 가정했음

        CatchmindData catchmindData = catchmindDataRepository.findByDrawingId(drawingId);
        String answer = catchmindData.getAnswer();

        String userAnswer = " ";

        String drawingPicture = " "; // 이게 이미지 저장인데 멀티파일 뭐시기로 바꿔야함


        SendSeggestwordRes sendhelper = SendSeggestwordRes.builder()
                .answer(answer)
                .build();

        SendSeggestwordRes sendActor = SendSeggestwordRes.builder()
                        .build();

        publisherHelper(req, sendhelper);

        return Catchmind.builder()
                .catchmindData(catchmindData)
                .drawingPicture(drawingPicture)
                .userAnswer(userAnswer)
                .turn(turn)
                .round(findRound)
                .build();
    }



    public void publisher(String rtcSession, String url, String msg, int check){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(rtcSession)
                .message(msg)
                .type(url)
                .data(check)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    public void publisherHelper(StartReq req, SendSeggestwordRes data){
        SocketMessage message = SocketMessage.builder()
                .rtcSession(req.getRtcSession())
                .message("게임 시작.. 조력자에게 제시어 줄거야")
                .type("catchmind/start")
                .data(data)
                .build();
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }


}
