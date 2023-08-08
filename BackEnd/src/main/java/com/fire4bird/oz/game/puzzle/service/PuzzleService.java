package com.fire4bird.oz.game.puzzle.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleAnswerReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleReadyReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleStartReq;
import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.game.puzzle.entity.PuzzleLog;
import com.fire4bird.oz.game.puzzle.manager.PuzzleGameManager;
import com.fire4bird.oz.game.puzzle.repository.PuzzleLogRepository;
import com.fire4bird.oz.game.puzzle.repository.PuzzleRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PuzzleService {
    private final PuzzleRepository puzzleRepository;
    private final PuzzleLogRepository puzzleLogRepository;
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final RoundRepository roundRepository;
    private PuzzleGameManager puzzleGameManager;

    @PostConstruct
    public void init(){
        puzzleGameManager = new PuzzleGameManager(socketRepository, redisPublisher);
    }

    //게임 준비 확인
    public void gameReady(PuzzleReadyReq req) {
        puzzleGameManager.checkReady(req.getRole(),req.getRtcSession(),req.getState());
    }

    //게임 시작시 뿌려줄 데이터
    public void gameStart(PuzzleStartReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        Puzzle puzzle = puzzleGameManager.statGame(req, findRound, 1);
        //type 1: 게임 시작 로그
        userLog(req.getRtcSession(),req.getUserId(),0,1, puzzle.toString());

        puzzleRepository.save(puzzle);
    }

    //게임 다시 시작
    public void gameReset(PuzzleStartReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        int turn = puzzleRepository.maxTurn(obj.getRoundId()).getTurn()+1;
        Puzzle puzzle = puzzleGameManager.statGame(req, findRound, turn);
        //type 2: 게임 다시 시작 로그
        userLog(req.getRtcSession(),req.getUserId(),0,2, puzzle.toString());

        puzzleRepository.save(puzzle);
    }

    public void gameLog(PuzzleLogReq req){
        //type 3: 정답자 행동 로그
        userLog(req.getRtcSession(),req.getUserId(),0,3, req.getMessage());
    }

    public void userLog(String rtcSession, int userid, int system, int logType, String msg){
        RedisSaveObject obj = socketRepository.findRoundById(rtcSession,String.valueOf(userid));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        PuzzleLog puzzleLog = PuzzleLog.builder()
                .userId(userid)
                .isSystem(system)
                .logType(logType)
                .message(msg)
                .logTime(LocalDateTime.now())
                .round(findRound)
                .build();

        puzzleLogRepository.save(puzzleLog);
    }

    public void gameAnswer(PuzzleAnswerReq req){
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Puzzle puzzle = puzzleRepository.maxTurn(obj.getRoundId());

        int check = puzzleGameManager.checkAnswer(req.getUserAnswer(),puzzle.getAnswer());
        puzzleGameManager.publisher(req.getRtcSession(), "puzzle/data","게임 정답 확인",check);

        //type 4: 게임 정답 제출 로그
        userLog(req.getRtcSession(),req.getUserId(),0,4, req.getUserAnswer()+" 제출, 정답 여부: "+ check);

        puzzle.setUserAnswer(req.getUserAnswer());
        puzzle.setIsCheck(check);
        puzzleRepository.save(puzzle);
    }
}
