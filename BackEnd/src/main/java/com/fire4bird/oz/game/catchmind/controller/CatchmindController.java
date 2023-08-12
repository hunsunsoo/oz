package com.fire4bird.oz.game.catchmind.controller;

import com.fire4bird.oz.game.catchmind.dto.req.*;
import com.fire4bird.oz.game.catchmind.service.CatchmindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CatchmindController {

    private final CatchmindService catchmindService;


//    @MessageMapping("/catchmind/ready")
//    public void gameReady(ReadyReq req) { catchmindService.gameReady(req); }

    @MessageMapping("/catchmind/start")
    public void gameStart(StartReq req) { catchmindService.gameStart(req); }

    @MessageMapping("/catchmind/reset")
    public void gameReset(StartReq req) { catchmindService.gameReset(req); }

    @MessageMapping("/catchmind/log")
    public void catchmindGameLog(ActorLogReq req) { catchmindService.gameLog(req); }

    @MessageMapping("/catchmind/data")
    public void catchmindGameData(ActorAnswerReq req) { catchmindService.gameAnswer(req); }

//    @MessageMapping("/catchmind/Image")
//    public void uploadImage(HelperSubmit req) { catchmindService.gameImg(req); }
//
//    @MessageMapping("/catchmind/downloadImage")
//    public void downloadImage(HelperSubmit req) {  }
}
