package com.fire4bird.oz.game.puzzle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.game.calculation.dto.request.SessionReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogDto;
import com.fire4bird.oz.game.puzzle.manager.PuzzleGameManager;
import com.fire4bird.oz.game.puzzle.service.PuzzleService;
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

@RequiredArgsConstructor
@Controller
@Slf4j
public class SocketPuzzleController {
    private static Map<Integer, PuzzleGameManager> gameManagerMap;
    private final RoundService roundService;
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;
    private final PuzzleService puzzleService;

    @PostConstruct
    public void init(){
        gameManagerMap = new ConcurrentHashMap<>();
    }

    // 게임 시작
    @MessageMapping("/puzzle/start/{roundId}")
    public void gameStart(@DestinationVariable Integer roundId, SessionReq req) throws Exception{
        gameManagerMap.put(roundId, new PuzzleGameManager(roundId, req.getSession(), roundService, puzzleService));
    }
    
//    @MessageMapping("/puzzle/start/{roundId}")
//    public void socketEnter(@DestinationVariable Integer roundId, SocketMessage message) {
//        puzzleService.gameStart();
//        message.setMessage("상형문자 게임 시작 데이터 전달");
//        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
//    }

    @MessageMapping("/puzzle/log")
    public void puzzleGameLog(SocketMessage message) {
        try {
            // ObjectMapper를 사용하여 JSON을 SocketRoleDto 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonString = objectMapper.writeValueAsString(message.getData());
            PuzzleLogDto puzzleLogDto = objectMapper.readValue(jsonString, PuzzleLogDto.class);

           puzzleService.gameLog(puzzleLogDto);
        }catch (Exception e){
            message.setMessage("error: "+e.getMessage());
            log.info(e.getMessage());
        }
        message.setMessage("게임로그 저장");
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    @MessageMapping("/puzzle/data")
    public void puzzleGameData(SocketMessage message) {
        try {
            // ObjectMapper를 사용하여 JSON을 SocketRoleDto 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonString = objectMapper.writeValueAsString(message.getData());
            PuzzleLogDto puzzleLogDto = objectMapper.readValue(jsonString, PuzzleLogDto.class);

//            puzzleService.gameAnswer(answerDto);
        }catch (Exception e){
            message.setMessage("error: "+e.getMessage());
            log.info(e.getMessage());
        }
        message.setMessage("게임로그 저장");
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

}
