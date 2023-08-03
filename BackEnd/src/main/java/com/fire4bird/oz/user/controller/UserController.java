package com.fire4bird.oz.user.controller;

import com.fire4bird.oz.emailcode.mapper.EmailCodeMapper;
import com.fire4bird.oz.emailcode.service.EmailCodeService;
import com.fire4bird.oz.jwt.JwtProvider;
import com.fire4bird.oz.jwt.blacklist.service.BlackListService;
import com.fire4bird.oz.jwt.refresh.key.RefreshToken;
import com.fire4bird.oz.jwt.refresh.service.RefreshTokenService;
import com.fire4bird.oz.user.dto.LoginDto;
import com.fire4bird.oz.user.dto.RegistUserDto;
import com.fire4bird.oz.user.dto.ResignDto;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.mapper.UserMapper;
import com.fire4bird.oz.user.service.UserService;
import jakarta.mail.MessagingException;
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
    private final EmailCodeMapper emailCodeMapper;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;
    private final BlackListService blackListService;
    private final EmailCodeService emailCodeService;

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

        return ResponseEntity.ok("로그인 성공");
    }

    //엑세스 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity reissue(HttpServletRequest request, HttpServletResponse response) {
        //헤더에서 리프레시 토큰 꺼내기
        String refreshToken = jwtProvider.getRefreshToken(request);

        //레디스에 해당 리프레시 토큰 있나 확인하고 객체 가져오기
        RefreshToken refresh = refreshTokenService.findRefresh(refreshToken);

        //시큐리티가 들고있던 유저 식별자 가져오기
        String payloadId = SecurityContextHolder.getContext().getAuthentication().getName();

        /**
         * 리프레시가 가지고 있던 유저 식별자
         * 시큐리티가 가지고 있던 유저 식별자 비교
         */
        User user = userService.checkUser(refresh.getUserId(), Integer.parseInt(payloadId));

        //액세스 토큰 생성
        String accessToken = jwtProvider.createAccessToken(user);

        //반환
        response.setHeader("AccessToken", accessToken);

        return ResponseEntity.ok("엑세스 토큰 재발급 성공");
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseEntity logoutUser(HttpServletRequest request) {
        String accessToken = jwtProvider.getAccessToken(request);
        String refreshToken = jwtProvider.getRefreshToken(request);

        refreshTokenService.deleteRefreshToken(refreshToken);
        blackListService.registBlackList(accessToken);

        return ResponseEntity.ok("로그아웃 성공");
    }

    //이메일 인증
    @PostMapping("/mail")
    public ResponseEntity sendMail() throws MessagingException {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        String emailCode = emailCodeService.sendMail(Integer.parseInt(userId));

        emailCodeService.saveEmailCode(emailCodeMapper.paramToEmailCode(emailCode, Integer.parseInt(userId)));

        return ResponseEntity.ok("인증 코드 전송");
    }


    //비밀번호 변경
}
