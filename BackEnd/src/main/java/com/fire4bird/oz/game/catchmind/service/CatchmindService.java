package com.fire4bird.oz.game.catchmind.service;

import com.fire4bird.oz.game.catchmind.dto.DrawingDto;
import com.fire4bird.oz.game.catchmind.dto.req.AnswerReq;
import com.fire4bird.oz.game.catchmind.dto.req.PassReq;
import com.fire4bird.oz.game.catchmind.dto.req.StartReq;
import com.fire4bird.oz.game.catchmind.entity.Drawing;
import com.fire4bird.oz.game.catchmind.entity.DrawingData;
import com.fire4bird.oz.game.catchmind.entity.DrawingLog;
import com.fire4bird.oz.game.catchmind.manager.CatchmindGameManager;
import com.fire4bird.oz.game.catchmind.repository.CatchmindDataRepository;
import com.fire4bird.oz.game.catchmind.repository.CatchmindLogRepsitory;
import com.fire4bird.oz.game.catchmind.repository.CatchmindRepository;
import com.fire4bird.oz.record.service.RecordService;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatchmindService {

    private final CatchmindRepository catchmindRepository;
    private final CatchmindLogRepsitory catchmindLogRepsitory;
    private final CatchmindDataRepository catchmindDataRepository;
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final RoundRepository roundRepository;
    private final RecordService recordService;
    private CatchmindGameManager catchmindGameManager;


    @PostConstruct
    public void init() {
        catchmindGameManager = new CatchmindGameManager(socketRepository, redisPublisher, catchmindDataRepository);
    }

    // 게임 준비 확인
    public void gameStart(StartReq req) {
        int owner = socketRepository.findOwnerById(req.getRtcSession());
        if (req.getUserId() != owner) return;

        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        long turn = catchmindRepository.countTurn(obj.getRoundId()) + 1;
        DrawingData drawingData = catchmindGameManager.startGame(req);

        //기록 유효성 검사 및 기록 테이블에 등록
        //중복되는 서칭들 있음 추후 리팩토링 필수
        //userId는 방장으로 판단 -> 그대로 사용
        //roundId 그대로 사용 -> turn은 어떤건지 정확히 판단 불가 -> 기록테이블에서도 중복서칭 됨 ->수정 필수
        log.info("찾아온 roundId : {}", findRound.getRoundId());
        log.info("요청 받은 roundId : {}", obj.getRoundId());
        log.info("방장 : {}", owner);
        recordService.validRequest(4, findRound.getRoundId(), owner);
        recordService.saveStartRecord(findRound.getRoundId(), 4);

        Drawing drawing = Drawing.builder()
                .catchmindData(drawingData)
                .answer(drawingData.getAnswer())
                .turn((int) turn)
                .userAnswer("")
                .round(findRound)
                .drawingPicture("")
                .build();

        // type 1: 게임 시작 로그
        userLog(req.getRtcSession(), req.getUserId(), 0, 1, turn + "회차 제시어: " + drawing.getAnswer());
        catchmindRepository.save(drawing);
    }

    public void gameDrawing(DrawingDto req) {
        catchmindGameManager.publisher(req.getSessionId(), "draw/drawing", "그리는 중", req);
    }

    public void gamePass(PassReq req) {
        catchmindGameManager.publisher(req.getRtcSession(), "draw/pass", "턴 넘기기", req.getCurrentRole() + 1);

        // type 2: 역할 넘기기 로그
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        long turn = catchmindRepository.countTurn(obj.getRoundId());
        userLog(req.getRtcSession(), req.getUserId(), 0, 1, turn + "회차 " + req.getCurrentRole() + 1 + "역할에게 " + req.getPng() + "넘기기");
    }

    public void imageReset(StartReq req) {
        catchmindGameManager.publisher(req.getRtcSession(), "draw/reset", "그림 리셋", null);

        // type 3: 리셋 로그
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        long turn = catchmindRepository.countTurn(obj.getRoundId());
        userLog(req.getRtcSession(), req.getUserId(), 0, 1, turn + "회차 " + req.getUserId() + "가 리셋함");
    }

    public void gameAnswer(AnswerReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        Drawing catchmind = catchmindRepository.maxTurn(obj.getRoundId());

        //정답 확인 후 유효성 검사
        //일단 주석 처리
//        recordService.validRequest(4, obj.getRoundId(), obj.getUserId());

        int check = -1;
        if (req.getUserAnswer().equals(catchmind.getAnswer())) check = 1;

        //일단 주석 처리
//        if (check == 1) {
//            recordService.clearCheck(obj.getRoundId(), 4, "clear");
//        }
//        else {
//            recordService.clearCheck(obj.getRoundId(), 4, "false");
//        }

        catchmindGameManager.publisher(req.getRtcSession(), "draw/data", "게임 정답 확인", check);


        // type 4: 게임 정답 제출 로그
        userLog(req.getRtcSession(), req.getUserId(), 0, 4, "제출한 답: " + req.getUserAnswer() + ", 정답 확인: " + check);

        catchmind.setUserAnswer(req.getUserAnswer());
        catchmind.setIsCheck(check);
        catchmind.setDrawingPicture(req.getPng());
        catchmindRepository.save(catchmind);
    }

    public void userLog(String rtcSession, int userId, int system, int logType, String msg) {
        RedisSaveObject obj = socketRepository.findRoundById(rtcSession, String.valueOf(userId));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        DrawingLog catchmindLog = DrawingLog.builder()
                .userId(userId)
                .isSystem(system)
                .logType(logType)
                .message(msg)
                .logTime(LocalDateTime.now())
                .round(findRound)
                .build();
        catchmindLogRepsitory.save(catchmindLog);
    }

}
