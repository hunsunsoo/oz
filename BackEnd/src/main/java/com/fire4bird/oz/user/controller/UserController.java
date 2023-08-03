package com.fire4bird.oz.user.controller;

import com.fire4bird.oz.jwt.JwtProvider;
import com.fire4bird.oz.jwt.token.key.RefreshToken;
import com.fire4bird.oz.jwt.token.service.RefreshTokenService;
import com.fire4bird.oz.user.dto.LoginDto;
import com.fire4bird.oz.user.dto.RegistUserDto;
import com.fire4bird.oz.user.dto.ResignDto;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.mapper.UserMapper;
import com.fire4bird.oz.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    //유저 회원가입
    @PostMapping("/signup")
    public ResponseEntity registUser(@RequestBody RegistUserDto registUserDto) {
        userService.registUser(userMapper.registUserToUser(registUserDto), "self");
        return ResponseEntity.ok("회원 가입 완료");
    }

    //유저 회원탈퇴
    @DeleteMapping("/resign")
    public ResponseEntity resignUser(@RequestBody ResignDto resignDto) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        userService.resignUser(Integer.parseInt(userId), resignDto.getPassword());

        return ResponseEntity.ok("회원 탈퇴 완료");

    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        User findUser = userService.login(loginDto.getEmail(), loginDto.getPassword(), "self");

        String accessToken = jwtProvider.createAccessToken(findUser);
        log.info("accessToken {}", accessToken);

        String refreshToken = jwtProvider.createRefreshToken(findUser);
        log.info("refreshToken {}", refreshToken);

        response.setHeader("AccessToken", accessToken);
        response.setHeader("RefreshToken", refreshToken);

        RefreshToken refresh = refreshTokenService.findRefresh(refreshToken);
        refreshTokenService.valueTest(refresh);

        return ResponseEntity.ok("로그인 성공");
    }

    //엑세스 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity reissue(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtProvider.getRefreshToken(request);

        User dbUser = userService.findUser(refreshToken);

        String payloadId = SecurityContextHolder.getContext().getAuthentication().getName();

        userService.checkUser(dbUser.getUserId(), Integer.parseInt(payloadId));

        String accessToken = jwtProvider.createAccessToken(dbUser);

        response.setHeader("AccessToken", accessToken);

        return ResponseEntity.ok("엑세스 토큰 재발급 성공");
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseEntity logoutUser(HttpServletRequest request) {
        String refreshToken = jwtProvider.getRefreshToken(request);

        userService.deleteRefreshToken(refreshToken);

        return ResponseEntity.ok("로그아웃 성공");
    }
}
