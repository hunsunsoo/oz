package com.fire4bird.oz.game.trap.service;

import com.fire4bird.oz.game.trap.dto.req.LionMoveReq;
import com.fire4bird.oz.game.trap.dto.req.TrapStartReq;
import com.fire4bird.oz.game.trap.dto.res.SendResult;
import com.fire4bird.oz.game.trap.entity.Trap;
import com.fire4bird.oz.game.trap.manager.TrapGameManager;
import com.fire4bird.oz.game.trap.repository.TrapRepository;
import com.fire4bird.oz.game.trap.repository.TrapRepositoryImpl;
import com.fire4bird.oz.record.service.RecordService;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrapService {

    private final TrapRepository trapRepository;
    private final SocketRepository socketRepository;
    private final RedisPublisher redisPublisher;
    private final RoundRepository roundRepository;
    private final TrapRepositoryImpl trapRepositoryImpl;
    private final RecordService recordService;
    private TrapGameManager trapGameManager;

    @PostConstruct
    public void init() {
        trapGameManager = new TrapGameManager(socketRepository, redisPublisher);
    }

    public void gameStart(TrapStartReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        Round findRound = roundRepository.findById(obj.getRoundId()).orElseThrow(RuntimeException::new);
        long turn = trapRepositoryImpl.countTurn(obj.getRoundId());
        //기록 유효성 검사 및 저장 타이밍
        recordService.validRequest(2, findRound.getRoundId(), obj.getUserId());
        recordService.saveStartRecord(findRound.getRoundId(), 2);

        trapRepository.save(trapGameManager.startGame(req, findRound, (int) turn + 1));
    }

    public void lionMove(LionMoveReq req) {
        RedisSaveObject obj = socketRepository.findRoundById(req.getRtcSession(), String.valueOf(req.getUserId()));
        Trap trap = trapRepositoryImpl.maxTurn(obj.getRoundId());

        int curLocX = Integer.parseInt(trap.getCurrentLocation().split(" ")[0]);
        int curLocY = Integer.parseInt(trap.getCurrentLocation().split(" ")[1]);
        String curDir = trap.getCurrentDirection();
        byte hasKey = trap.getHasKey();
        String nextDir = curDir;

        if (req.getMoving().equals("Go")) {   // 사자가 이동했을때
            // 이동
            if (curDir.equals("U")) {
                curLocX -= 1;
            } else if (curDir.equals("D")) {
                curLocX += 1;
            } else if (curDir.equals("L")) {
                curLocY -= 1;
            } else if (curDir.equals("R")) {
                curLocY += 1;
            }

            // 0 pass, 1 열쇠획득, 2 도착, 3 함정
            int check = trapGameManager.locationCheck(curLocX, curLocY, trap.getMap(), hasKey);

            if (check == 0) {
                trapGameManager.lionMovePublisher(req, trapGameManager.lionScreen(trap.getMap(), curLocX, curLocY, curDir, hasKey, trap.getScreenMap()));
            } else if (check == 1) {
                hasKey = 1;
                trapGameManager.lionMovePublisher(req, trapGameManager.lionScreen(trap.getMap(), curLocX, curLocY, curDir, hasKey, trap.getScreenMap()));
            } else if (check == 2) {
                //기록 저장 타이밍
                recordService.validRequest(2, obj.getRoundId(), obj.getUserId());
                recordService.clearCheck(obj.getRoundId(), 2, "clear");

                // 클리어 처리해야함
                // 모두에게 클리어 전송
                SendResult result = SendResult.builder()
                        .resultCode(1)
                        .build();
                trapGameManager.publisher(req, result);

            } else if (check == 3) {
                //기록 저장 타이밍
                recordService.validRequest(2, obj.getRoundId(), obj.getUserId());
                recordService.clearCheck(obj.getRoundId(), 2, "false");

                // 실패 처리
                // 모두에게 실패 전송
                SendResult result = SendResult.builder()
                        .resultCode(0)
                        .build();
                trapGameManager.publisher(req, result);
            }
        } else {    // 사자가 머리돌렸을 때
            if (req.getMoving().equals("R")) {
                if (curDir.equals("U")) {
                    nextDir = "R";
                } else if (curDir.equals("D")) {
                    nextDir = "L";
                } else if (curDir.equals("L")) {
                    nextDir = "U";
                } else if (curDir.equals("R")) {
                    nextDir = "D";
                }
            } else if (req.getMoving().equals("L")) {
                if (curDir.equals("U")) {
                    nextDir = "L";
                } else if (curDir.equals("D")) {
                    nextDir = "R";
                } else if (curDir.equals("L")) {
                    nextDir = "D";
                } else if (curDir.equals("R")) {
                    nextDir = "U";
                }
            }

            trapGameManager.lionMovePublisher(req, trapGameManager.lionScreen(trap.getMap(), curLocX, curLocY, nextDir, hasKey, trap.getScreenMap()));
        }

        trap.setHasKey(hasKey);
        trap.setCurrentLocation(curLocX + " " + curLocY);
        trap.setCurrentDirection(nextDir);

        trapRepository.save(trap);
    }


}
