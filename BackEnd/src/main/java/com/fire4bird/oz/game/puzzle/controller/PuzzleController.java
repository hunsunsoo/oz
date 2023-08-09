package com.fire4bird.oz.game.puzzle.controller;

import com.fire4bird.oz.game.puzzle.dto.req.PuzzleAnswerReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleReadyReq;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleStartReq;
import com.fire4bird.oz.game.puzzle.service.PuzzleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PuzzleController {
    private final PuzzleService puzzleService;

    @MessageMapping("/puzzle/ready")
    public void gameReady(PuzzleReadyReq req) {
        puzzleService.gameReady(req);
    }

    @MessageMapping("/puzzle/start")
    public void gameStart(PuzzleStartReq req) {
        puzzleService.gameStart(req);
    }

    @MessageMapping("/puzzle/reset")
    public void gameReady(PuzzleStartReq req) {
        puzzleService.gameReset(req);
    }

    @MessageMapping("/puzzle/log")
    public void puzzleGameLog(PuzzleLogReq req) {
        puzzleService.gameLog(req);
    }

    @MessageMapping("/puzzle/data")
    public void puzzleGameData(PuzzleAnswerReq req) {
        puzzleService.gameAnswer(req);
    }

}
