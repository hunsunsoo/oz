package com.fire4bird.oz.game.catchmind.controller;

import com.fire4bird.oz.game.catchmind.dto.DrawingDto;
import com.fire4bird.oz.game.catchmind.dto.req.*;
import com.fire4bird.oz.game.catchmind.service.CatchmindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CatchmindController {

    private final CatchmindService catchmindService;

    @MessageMapping("/draw/start")
    public void gameStart(StartReq req) { catchmindService.gameStart(req); }

    @MessageMapping("/draw/drawing")
    public void gameDrawing(DrawingDto req) { catchmindService.gameDrawing(req); }

    @MessageMapping("/draw/pass")
    public void gamePass(PassReq req) { catchmindService.gamePass(req); }

    @MessageMapping("/draw/reset")
    public void gameReset(StartReq req) { catchmindService.imageReset(req); }

    @MessageMapping("/draw/data")
    public void gameAnswer(AnswerReq req) { catchmindService.gameAnswer(req); }

}
