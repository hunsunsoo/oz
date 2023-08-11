package com.fire4bird.oz.game.calculation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.*;
import com.fire4bird.oz.game.calculation.manager.GameManager;
import com.fire4bird.oz.game.calculation.service.CalculationService;
import com.fire4bird.oz.round.service.RoundService;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CalculationController {
    private static Map<Integer, GameManager> gameManagerMap;
//    @Autowired
//    private final SimpMessagingTemplate template;
    private final RoundService roundService;
    private final CalculationService calculationService;
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;

    @PostConstruct
    public void init(){
        gameManagerMap = new ConcurrentHashMap<>();
    }

//    // 게임 시작
//    @MessageMapping("/calculation/ready/{roundId}")
//    public void gameStart(@DestinationVariable Integer roundId, SessionReq req) throws Exception{
//        gameManagerMap.putIfAbsent(roundId, new GameManager(roundId, req.getSession(), roundService, calculationService));
//        SocketMessage msg = new SocketMessage();
//        msg.setType("calculation/ready/" + roundId);
//        msg.setRtcSession(req.getSession());
//
//        msg.setMessage("준비 상태 반환");
//        msg.setData(gameManagerMap.get(roundId).startAvailable(req.getRole()));
//
//        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
//    }

    // 게임 시작을 하면 필요한 보드판 설정 및 받아오기
    @MessageMapping("/calculation/start/{roundId}")
    public void setGame(@DestinationVariable Integer roundId, SessionReq req){
        gameManagerMap.putIfAbsent(roundId, new GameManager(roundId, req.getSession(), roundService, calculationService));

        SocketMessage msg = new SocketMessage();
        SetBoardRes res = gameManagerMap.get(roundId).setGame(roundId);

        msg.setType("calculation/start/" + roundId);
        msg.setRtcSession(res.getSession());
        msg.setMessage("생성된 보드판 공개");
        msg.setData(res);

        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }

    // 만들어야 할 정답 받아오기
    @MessageMapping("/calculation/getanswer/{roundId}")
    public void getAnswer(@DestinationVariable Integer roundId){
        SocketMessage msg = new SocketMessage();
        SetAnswerRes res = gameManagerMap.get(roundId).getAnswer();

        msg.setType("calculation/getanswer/" + roundId);
        msg.setRtcSession(res.getSession());
        msg.setMessage("정답 공개");
        msg.setData(res);

        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }

    // 조력자가 선택한 번호판 log 전달 redis ver
    @MessageMapping("/calculation/helperlog/{roundId}")
    public void helperLog(@DestinationVariable Integer roundId, HelperLogReq req){
        SocketMessage msg = new SocketMessage();

        HelperRes res = gameManagerMap.get(roundId).helperLog(req);

        msg.setType("calculation/helperlog/" + roundId);
        msg.setRtcSession(res.getSession());
        msg.setUserId(req.getUserId());
        msg.setMessage("헬퍼 로그 입력");
        msg.setData(res);

        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }

    // 조력자가 고른 숫자판 전달
    @MessageMapping("/calculation/helpersubmit/{roundId}")
    public void helperSubmit(@DestinationVariable Integer roundId, HelperSubmitReq req){
        SocketMessage msg = new SocketMessage();

        HelperSubmitRes res = gameManagerMap.get(roundId).helperSubmit(req);

        msg.setType("calculation/helpersubmit/" + roundId);
        msg.setRtcSession(res.getSession());
        msg.setMessage("헬퍼 보드판 전달");
        msg.setData(res);

        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }

    // 허수아비 행동 로그 입력
    @MessageMapping("/calculation/actorlog/{roundId}")
    public void actorLog(@DestinationVariable Integer roundId, ActorLogReq req){
        gameManagerMap.get(roundId).actorLog(req);
    }

    // 허수아비 리셋 버튼 로그
    @MessageMapping("/calculation/resetanswer/{roundId}")
    public void actorReset(@DestinationVariable Integer roundId, ActorResetReq req){
        gameManagerMap.get(roundId).actorReset(req);
    }

    // 정답을 입력하면 게임 종료
    @MessageMapping("/calculation/submitanswer/{roundId}")
    public void submitAnswer(@DestinationVariable Integer roundId, ActorAnswerReq req){
        SocketMessage msg = new SocketMessage();

        GuessAnswerRes res =  gameManagerMap.get(roundId).guessAnswer(req);

        msg.setType("calculation/submitanswer/" + roundId);
        msg.setRtcSession(res.getSession());
        msg.setMessage("정답 입력");
        msg.setData(res);

        if(res.isGameEnd()) gameManagerMap.remove(roundId);
        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }




//    // 게임에 필요한 보드판 설정 및 받아오기
//    @MessageMapping("/calculation/setboard/{roundId}")
//    public SetBoardRes setGame(@DestinationVariable Integer roundId){
//        return gameManagerMap.get(roundId).setGame(roundId);
//    }
//
//    // 만들어야 할 정답 받아오기
//    @MessageMapping("/calculation/getanswer/{roundId}")
//    public SetAnswerRes getAnswer(@DestinationVariable Integer roundId){
//        return gameManagerMap.get(roundId).getAnswer();
//    }

//    // 조력자가 선택한 번호판 log 전달
//    @MessageMapping("/calculation/helperLog/{roundId}")
//    public HelperRes helperLog(@DestinationVariable Integer roundId, HelperLogReq req){
//        return gameManagerMap.get(roundId).helperLog(req);
//    }

    //    // 게임에 참여한 모든 사용자의 일련번호를 추가
//    @MessageMapping("/calculation/addplayer/{roomId}")
//    public void addPlayer(@DestinationVariable Integer roomId, @RequestBody Integer userId){
//        System.out.println("hello");
//        if(gameManagerMap.get(roomId).addPlayer(userId)){
//            broadcastAllconnected(roomId);
//        }
//    }
//
//    // 모든 사용자가 들어왔다
//    public void broadcastAllconnected(Integer roomId){
//        template.convertAndSend("/calculation/from/checkconnect/" + roomId, true);
//    }
}
