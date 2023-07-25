package com.fire4bird.oz.user.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fire4bird.oz.user.service.OauthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/oauth")
public class OauthController {

    private final OauthService oauthService;

    //카카오 로그인
    @PostMapping("/kakao")
    public ResponseEntity kakaoLogin(@RequestParam String code) throws JsonProcessingException {
        String token = oauthService.getToken(code);

        String userInfo = oauthService.getUserInfo(token);
        return ResponseEntity.ok(userInfo);
    }
}
