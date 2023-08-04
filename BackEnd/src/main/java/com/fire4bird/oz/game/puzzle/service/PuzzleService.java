package com.fire4bird.oz.game.puzzle.service;

import com.fire4bird.oz.game.puzzle.dto.PuzzleAnswer;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleStartReq;
import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.game.puzzle.entity.PuzzleLog;
import com.fire4bird.oz.game.puzzle.manager.PuzzleGameManager;
import com.fire4bird.oz.game.puzzle.repository.PuzzleLogRepository;
import com.fire4bird.oz.game.puzzle.repository.PuzzleRepository;
import com.fire4bird.oz.game.puzzle.repository.PuzzleRepositoryImpl;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PuzzleService {
    private final PuzzleRepository puzzleRepository;
    private final PuzzleRepositoryImpl puzzleRepositoryImpl;
    private final PuzzleLogRepository puzzleLogRepository;
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final RoundRepository roundRepository;
    private PuzzleGameManager puzzleGameManager;

    @PostConstruct
    public void init(){
        puzzleGameManager = new PuzzleGameManager(socketRepository, redisPublisher);
    }

    //게임 시작시 뿌려줄 데이터
    public void gameStart(PuzzleStartReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);

        puzzleRepository.save(puzzleGameManager.statGame(req,findRound));
    }

    public void gameLog(PuzzleLogReq req){
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        PuzzleLog puzzleLog = PuzzleLog.builder()
                .userId(req.getUserId())
                .isSystem(req.getIsSystem())
                .logType(req.getLogType())
                .message(req.getMessage())
                .logTime(LocalDateTime.now())
                .round(findRound)
                .build();

        puzzleLogRepository.save(puzzleLog);
    }

    public void gameAnswer(PuzzleAnswer req){
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Puzzle puzzle = puzzleRepositoryImpl.maxTurn(obj.getRoundId());

        int check = puzzleGameManager.checkAnswer(req.getUserAnswer(),puzzle.getAnswer());
        puzzleGameManager.publisher(req.getRtcSession(), "puzzle/data","게임 정답 확인",check);

        puzzle.setAnswer(req.getUserAnswer());
        puzzle.setIsCheck(check);
        puzzleRepository.save(puzzle);
    }
}
