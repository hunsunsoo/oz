package com.fire4bird.oz.user.controller;

import com.fire4bird.oz.jwt.JwtProvider;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtProvider jwtProvider;

    //유저 회원가입
    @PostMapping("/signup")
    public ResponseEntity registUser(@RequestBody RegistUserDto registUserDto) {
        userService.registUser(userMapper.registUserToUser(registUserDto), "self");
        return ResponseEntity.ok("회원 가입 완료");
    }

    //유저 회원탈퇴
    @DeleteMapping("/resign")
    public ResponseEntity resignUser(@RequestBody ResignDto resignDto,
                                     HttpServletRequest request) {
        String accessToken = jwtProvider.getToken(request);
        log.info(accessToken);

        String userId = jwtProvider.getUserId(accessToken);

        userService.resignUser(Integer.parseInt(userId),resignDto.getPassword());

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

        return ResponseEntity.ok("로그인 성공");
    }
}
