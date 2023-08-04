package com.fire4bird.oz.game.puzzle.controller;

import com.fire4bird.oz.game.puzzle.dto.req.PuzzleAnswerReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogReq;
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

@Controller
@RequiredArgsConstructor
@Slf4j
public class PuzzleController {
//    private static Map<Integer, PuzzleGameManager> gameManagerMap;
    private final RoundService roundService;
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;
    private final PuzzleService puzzleService;

//    @PostConstruct
//    public void init(){
//        gameManagerMap = new ConcurrentHashMap<>();
//    }
//
//    // 게임 시작
//    @MessageMapping("/puzzle/start")
//    public void gameStart(@DestinationVariable Integer roundId, SessionReq req) throws Exception{
//        gameManagerMap.put(roundId, new PuzzleGameManager(roundId, req.getSession(), roundService, puzzleService));
//    }

    @MessageMapping("/puzzle/start")
    public void socketEnter(@DestinationVariable Integer roundId, SocketMessage message) {
        puzzleService.gameStart();
        message.setMessage("상형문자 게임 시작 데이터 전달");
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    @MessageMapping("/puzzle/log")
    public void puzzleGameLog(PuzzleLogReq req) {
        SocketMessage msg = new SocketMessage();

        puzzleService.gameLog(req);
        msg.setRtcSession(req.getRtcSession());
        msg.setMessage("게임로그 저장 성공");
        msg.setType("puzzle/log");
        redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }

    @MessageMapping("/puzzle/data")
    public void puzzleGameData(PuzzleAnswerReq req) {
            SocketMessage msg = new SocketMessage();

            puzzleService.gameAnswer(req);
            msg.setRtcSession(req.getRtcSession());
            msg.setMessage("정답 확인");
            msg.setType("puzzle/data");
            redisPublisher.publish(socketRepository.getTopic(msg.getRtcSession()), msg);
    }

}
