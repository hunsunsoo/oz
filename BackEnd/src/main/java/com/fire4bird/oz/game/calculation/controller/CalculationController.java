package com.fire4bird.oz.game.calculation.controller;

import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.GuessAnswerRes;
import com.fire4bird.oz.game.calculation.dto.response.HelperRes;
import com.fire4bird.oz.game.calculation.dto.response.HelperSubmitRes;
import com.fire4bird.oz.game.calculation.dto.response.SetBoardRes;
import com.fire4bird.oz.game.calculation.manager.GameManager;
import com.fire4bird.oz.game.calculation.service.CalculationService;
import com.fire4bird.oz.team.service.TeamService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CalculationController {
    private static Map<Integer, GameManager> gameManagerMap;

    @Autowired
    private final SimpMessagingTemplate template;

    private final TeamService teamService;
    private final CalculationService calculationService;


    @PostConstruct
    public void init(){
        gameManagerMap = new ConcurrentHashMap<>();
    }

    @MessageMapping("/calculation/start/{roomId}")
    @SendTo("/calculation/from/start/{roomId}")
    public void gameStart(@DestinationVariable Integer roomId) throws Exception{
        System.out.println("first");
        gameManagerMap.put(roomId, new GameManager(roomId, teamService, calculationService));
    }

    // 게임에 참여한 모든 사용자의 일련번호를 추가
    @MessageMapping("/calculation/addplayer/{roomId}")
    public void addPlayer(@DestinationVariable Integer roomId, @RequestBody Integer userId){
        System.out.println("hello");
        if(gameManagerMap.get(roomId).addPlayer(userId)){
            broadcastAllconnected(roomId);
        }
    }

    // 모든 사용자가 들어왔다
    public void broadcastAllconnected(Integer roomId){
        template.convertAndSend("/calculation/from/checkconnect/" + roomId, true);
    }

    // 게임에 필요한 보드판, 답 설정
    @MessageMapping("/calculation/setboard/{roomId}")
    public SetBoardRes setGame(@DestinationVariable Integer roomId, InitReq req){
        return gameManagerMap.get(roomId).setGame(req);
    }

    // 조력자가 번호를 선택함 log 전달
    @MessageMapping("/calculation/selecthelp/{roomId}")
    public HelperRes helpBlock(@DestinationVariable Integer roomId, HelperSubmitReq req){
        return gameManagerMap.get(roomId).getHelperNum(req);
    }

    @MessageMapping("/calculation/selecthelpall/{roomId}")
    public HelperSubmitRes showHelp(@DestinationVariable Integer roomId, HelperSubmitAllReq req){
        return gameManagerMap.get(roomId).showHelp(req);
    }

    @MessageMapping("/calculation/selectAnswerOne/{roomId}")
    public void selectAnswerOne(@DestinationVariable Integer roomId, ActorSelectOneReq req){
        gameManagerMap.get(roomId).selectAnswerOne(req);
    }

    @MessageMapping("/calculation/selectAnswer/{roomId}")
    public GuessAnswerRes selectAnswer(@DestinationVariable Integer roomId, SubmitAnswerReq req){
        return gameManagerMap.get(roomId).guessAnswer(req);
    }
}
