package com.fire4bird.oz.game.puzzle.controller;

import com.fire4bird.oz.game.puzzle.dto.PuzzleAnswer;
import com.fire4bird.oz.game.puzzle.dto.req.PuzzleLogReq;
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

    @MessageMapping("/puzzle/start")
    public void startGame(PuzzleStartReq req) {
        puzzleService.gameStart(req);
    }

    @MessageMapping("/puzzle/log")
    public void puzzleGameLog(PuzzleLogReq req) {
        puzzleService.gameLog(req);
    }

    @MessageMapping("/puzzle/data")
    public void puzzleGameData(PuzzleAnswer req) {
        puzzleService.gameAnswer(req);
    }

}
