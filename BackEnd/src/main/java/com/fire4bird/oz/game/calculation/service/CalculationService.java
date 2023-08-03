package com.fire4bird.oz.game.calculation.service;

import com.fire4bird.oz.game.calculation.dto.request.*;
import com.fire4bird.oz.game.calculation.dto.response.SetBoardRes;
import com.fire4bird.oz.game.calculation.entity.Calculation;
import com.fire4bird.oz.game.calculation.entity.CalculationLog;
import com.fire4bird.oz.game.calculation.repository.CalculationLogRepository;
import com.fire4bird.oz.game.calculation.repository.CalculationRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.repository.RoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CalculationService {
    // init(게임 시작) -> 정답(1~120 사이 랜덤 생성), 숫자판 랜덤 생성(6*6 배열)
    // 선택한 숫자판 고르기
    // 답 입력
    private final CalculationRepository calculationRepository;
    private final CalculationLogRepository calculationLogRepository;
    private final RoundRepository roundRepository;

    public SetBoardRes initSave(InitReq req){
         Round findRound = roundRepository.findById(req.getRoundId()).orElseThrow(() -> new RuntimeException());
         Calculation newCalculation = calculationRepository.recentCalculation(findRound);

         int calTurn = 1;
         if(newCalculation != null)
             calTurn = newCalculation.getTurn() + 1;


         newCalculation = Calculation.builder()
                 .round(findRound)
                 .turn(calTurn).
                 answer(req.getAnswer())
                 .numberBoard(req.getNumberBoard())
                 .build();

         calculationRepository.save(newCalculation);
         newCalculation = calculationRepository.recentCalculation(findRound);

         SetBoardRes setBoardRes = new SetBoardRes();
         setBoardRes.setGameId(newCalculation.getGameId());
         setBoardRes.setTurn(newCalculation.getTurn());
         setBoardRes.setNumberBoard(newCalculation.getNumberBoard());

         return setBoardRes;
    }

    // 로그에 저장됨
    public void helperLog(HelperLogReq req, int turn) {
        Round findRound = roundRepository.findById(req.getRoundId()).orElseThrow(() -> new RuntimeException());
        String msg;
        if(req.getIsSelected() == 1) msg = "조력자: [" + req.getR() + ", " + req.getC() + "] 좌표를 선택하셨습니다.";
        else msg = "조력자: [" + req.getR() + ", " + req.getC() + "] 좌표를 취소하셨습니다.";

        CalculationLog log = CalculationLog.builder()
                .round(findRound)
                .userId(req.getUserId())
                .isSystem((byte) 0)
                .logType(3)
                .message(msg)
                .logTime(LocalDateTime.now())
                .turn(turn)
                .build();

        calculationLogRepository.save(log);
    }

    public void helperUpdate(HelperSubmitReq req) {
        Calculation findCalculation = calculationRepository.findById(req.getGameId()).orElseThrow(() -> new RuntimeException());
        findCalculation.setAidSelectNum(req.getSelectedNums());

        calculationRepository.save(findCalculation);
    }

    public void submitAnswer(ActorAnswerReq req, int answer){
        Calculation findCalculation = calculationRepository.findById(req.getGameId()).orElseThrow(() -> new RuntimeException());

        findCalculation.setActorSelectNum(req.getSelectedNums());
        findCalculation.setSelectOp(req.getMarks());
        findCalculation.setSubmitAnswer(answer);

        calculationRepository.save(findCalculation);
    }


    public void actorLog(ActorLogReq req, int turn) {
        Round findRound = roundRepository.findById(req.getRoundId()).orElseThrow(() -> new RuntimeException());
        String msg = "허수아비: [" + req.getR() + ", " + req.getC() + "] 좌표를 선택했습니다";

        CalculationLog log = CalculationLog.builder()
                .round(findRound)
                .userId(req.getUserId())
                .isSystem((byte) 0)
                .logType(2)
                .message(msg)
                .logTime(LocalDateTime.now())
                .turn(turn)
                .build();

        calculationLogRepository.save(log);
    }
}
