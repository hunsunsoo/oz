package com.fire4bird.oz.user.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fire4bird.oz.jwt.JwtProvider;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.service.OauthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/oauth")
public class OauthController {

    private final OauthService oauthService;

    private final JwtProvider jwtProvider;

    //카카오 로그인
    @PostMapping("/kakao")
    public ResponseEntity kakaoLogin(@RequestParam String code,
                                     HttpServletResponse response) throws JsonProcessingException {
        String token = oauthService.getToken(code);

        User kakaoUser = oauthService.getUserInfo(token);

        String accessToken = jwtProvider.createAccessToken(kakaoUser);
        String refreshToken = jwtProvider.createRefreshToken(kakaoUser);

        response.setHeader("AccessToken",accessToken);
        response.setHeader("RefreshToken",refreshToken);

        return ResponseEntity.ok("카카오 로그인 완료");
    }
}
