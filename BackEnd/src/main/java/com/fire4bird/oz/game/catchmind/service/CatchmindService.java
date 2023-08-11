package com.fire4bird.oz.game.catchmind.service;

import com.fire4bird.oz.game.catchmind.dto.req.*;
import com.fire4bird.oz.game.catchmind.entity.Catchmind;
import com.fire4bird.oz.game.catchmind.entity.CatchmindLog;
import com.fire4bird.oz.game.catchmind.manager.CatchmindGameManager;
import com.fire4bird.oz.game.catchmind.repository.CatchmindLogRepsitory;
import com.fire4bird.oz.game.catchmind.repository.CatchmindRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CatchmindService {

    private final CatchmindRepository catchmindRepository;
    private final CatchmindLogRepsitory catchmindLogRepsitory;
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final RoundRepository roundRepository;
    private CatchmindGameManager catchmindGameManager;

    @PostConstruct
    public void init() { catchmindGameManager = new CatchmindGameManager(socketRepository, redisPublisher); }


    public void gameReady(ReadyReq req) {
        catchmindGameManager.checkReady(req.getRole(), req.getRtcSession(), req.getState());
    }
    // 게임 준비 확인
    public void gameStart(StartReq req) {
        int owner = socketRepository.findOwnerById(req.getRtcSession());
        if(req.getUserId()!=owner) return;

        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        Catchmind catchmind = catchmindGameManager.startGame(req, findRound, 1);

        // type 1: 게임 시작 로그
        userLog(req.getRtcSession(), req.getUserId(), 0, 1, catchmind.toString());
        catchmindRepository.save(catchmind);
    }

    public void gameReset(StartReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        int turn = catchmindRepository.maxTurn(obj.getRoundId()).getTurn()+1;
        Catchmind catchmind = catchmindGameManager.startGame(req, findRound, turn);

        // type 2: 게임 다시 시작 로그
        userLog(req.getRtcSession(),req.getUserId(),0,2, catchmind.toString());
        catchmindRepository.save(catchmind);
    }

    public void gameLog(ActorLogReq req) {
        // 정답자 행동 로그
        userLog(req.getRtcSession(), req.getUserId(), 0, 3, req.getUserAnswer());
    }

    public void userLog(String rtcSession, int userId, int system, int logType, String msg) {
        RedisSaveObject obj = socketRepository.findRoundById(rtcSession,String.valueOf(userId));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        CatchmindLog catchmindLog = CatchmindLog.builder()
                .userId(userId)
                .isSystem(system)
                .logType(logType)
                .message(msg)
                .logTime(LocalDateTime.now())
                .round(findRound)
                .build();
        catchmindLogRepsitory.save(catchmindLog);
    }

    public void gameAnswer(ActorAnswerReq req){
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(),String.valueOf(req.getUserId()));
        Catchmind catchmind = catchmindRepository.maxTurn(obj.getRoundId());

        int check = -1;
        if (req.getUserAnswer().equals(catchmind.getAnswer())) check = 1;
        catchmindGameManager.publisher(req.getRtcSession(), "catchmind/data", "게임 정답 확인", check);

        // type 4: 게임 정답 제출 로그
        userLog(req.getRtcSession(), req.getUserId(), 0, 4, req.getUserAnswer() + check);

        catchmind.setUserAnswer(req.getUserAnswer());
        catchmind.setIsCheck(check);
        catchmindRepository.save(catchmind);
    }

    public void gameImg(HelperSubmit req) {
        // 이미지 업로드 및 관련 로직을 작성합니다.
        try {
            // 이미지 파일을 저장할 경로 생성
            String uploadPath = "http://localhost:3000/public/upload";

            Path imagePath = Paths.get(uploadPath + req.getImageFile().getOriginalFilename());

            // 이미지 파일을 디스크에 저장
            Files.write(imagePath, req.getImageFile().getBytes());

            // 이미지 URL을 프론트엔드에 제공 (필요하다면)
//            String imageUrl = "/api/images/download/" + req.getImageFile().getOriginalFilename();

            // 게임 이미지 처리 및 관련 로직 추가
            // ...
        } catch (Exception e) {
            // 예외 처리
        }
    }

}
