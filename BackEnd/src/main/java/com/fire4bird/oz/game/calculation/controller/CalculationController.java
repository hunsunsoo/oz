package com.fire4bird.oz.game.calculation.controller;

import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.*;
import com.fire4bird.oz.game.calculation.manager.GameManager;
import com.fire4bird.oz.game.calculation.service.CalculationService;
import com.fire4bird.oz.round.service.RoundService;
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

    @PostConstruct
    public void init(){
        gameManagerMap = new ConcurrentHashMap<>();
    }

    // 게임 시작
    @MessageMapping("/calculation/start/{roundId}")
    public void gameStart(@DestinationVariable Integer roundId) throws Exception{
        System.out.println("first");
        gameManagerMap.put(roundId, new GameManager(roundId, roundService, calculationService));
    }

    // 게임에 필요한 보드판 설정 및 받아오기
    @MessageMapping("/calculation/setboard/{roundId}")
    public SetBoardRes setGame(@DestinationVariable Integer roundId){
        return gameManagerMap.get(roundId).setGame(roundId);
    }

    // 만들어야 할 정답 받아오기
    @MessageMapping("/calculation/getanswer/{roundId}")
    public SetAnswerRes getAnswer(@DestinationVariable Integer roundId){
        return gameManagerMap.get(roundId).getAnswer();
    }

    // 조력자가 선택한 번호판 log 전달
    @MessageMapping("/calculation/helperLog/{roundId}")
    public HelperRes helperLog(@DestinationVariable Integer roundId, HelperLogReq req){
        return gameManagerMap.get(roundId).helperLog(req);
    }

    // 조력자가 고른 숫자판 전달
    @MessageMapping("/calculation/helpersubmit/{roundId}")
    public HelperSubmitRes helperSubmit(@DestinationVariable Integer roundId, HelperSubmitReq req){
        return gameManagerMap.get(roundId).helperSubmit(req);
    }

    // 허수아비 행동 로그 입력
    @MessageMapping("/calculation/actorLog/{roundId}")
    public void actorLog(@DestinationVariable Integer roundId, ActorLogReq req){
        gameManagerMap.get(roundId).actorLog(req);
    }

    // 정답을 입력하면 게임 종료
    @MessageMapping("/calculation/submitAnswer/{roomId}")
    public GuessAnswerRes submitAnswer(@DestinationVariable Integer roundId, ActorAnswerReq req){
        GuessAnswerRes res =  gameManagerMap.get(roundId).guessAnswer(req);
        if(res.isGameEnd()) gameManagerMap.remove(roundId);
        return res;
    }

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
