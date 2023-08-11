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
import com.fire4bird.oz.game.puzzle.mapper.PuzzleMapper;
import com.fire4bird.oz.game.puzzle.repository.PuzzleLogRepository;
import com.fire4bird.oz.game.puzzle.repository.PuzzleRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PuzzleService {
    private final SocketRepository socketRepository;
    private final RoundRepository roundRepository;
    private final RedisPublisher redisPublisher;

    private final PuzzleMapper puzzleMapper;
    private final PuzzleRepository puzzleRepository;
    private final PuzzleLogRepository puzzleLogRepository;

    private PuzzleGameManager puzzleGameManager;


    @PostConstruct
    public void init(){
        puzzleGameManager = new PuzzleGameManager(socketRepository, redisPublisher, puzzleMapper);
    }

    //게임 시작시 뿌려줄 데이터
    @Transactional
    public void gameStart(PuzzleStartReq req) {
        //방장인지 확인
        int owner = socketRepository.findOwnerById(req.getRtcSession());
        if(req.getUserId()!=owner) return;

        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        Puzzle puzzle = puzzleGameManager.statGame(req, findRound, 1);

        //type 1: 게임 시작 로그
        saveLog(req.getRtcSession(),req.getUserId(),0,1, "Start Answer: "+puzzle.getAnswer()+", Board: "+puzzle.getBoard());

        puzzleRepository.save(puzzle);
    }

    //게임 다시 시작(오답 시)
    @Transactional
    public void gameRetry(PuzzleStartReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);

        int turn = puzzleRepository.maxTurn(obj.getRoundId()).getTurn()+1;
        Puzzle puzzle = puzzleGameManager.statGame(req, findRound, turn);

        //type 2: 게임 다시 시작 로그 저장
        saveLog(req.getRtcSession(),req.getUserId(),0,2, "Retry answer: "+ puzzle.getAnswer());

        puzzleRepository.save(puzzle);
    }

    @Transactional
    public void saveLog(String rtcSession, int userid, int system, int logType, String msg){
        RedisSaveObject obj = socketRepository.findRoundById(rtcSession,String.valueOf(userid));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);

        PuzzleLog puzzleLog = puzzleMapper.sendPuzzleLog(userid,system,logType,msg,LocalDateTime.now(),findRound);
        puzzleLogRepository.save(puzzleLog);
    }

    @Transactional
    public void gameAnswer(PuzzleAnswerReq req){
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Puzzle puzzle = puzzleRepository.maxTurn(obj.getRoundId());

        int check = -1;
        if(req.getUserAnswer().equals(puzzle.getAnswer())) check = 1;
        puzzleGameManager.publisher(req.getRtcSession(), "puzzle/data","게임 정답 확인",check);

        //type 4: 게임 정답 제출 로그
        saveLog(req.getRtcSession(),req.getUserId(),0,4, "Answer Submit: "+req.getUserAnswer()+", Check: "+ check);

        puzzle.setUserAnswer(req.getUserAnswer());
        puzzle.setIsCheck(check);
        puzzleRepository.save(puzzle);
    }
}
