package com.fire4bird.oz.jwt.token.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.jwt.token.key.RefreshToken;
import com.fire4bird.oz.jwt.token.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    //redis에서 리프레시 토큰 가져오기
    public RefreshToken findRefresh(String refreshToken) {
        Optional<RefreshToken> findRefresh = refreshTokenRepository.findById(refreshToken);

        return findRefresh
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.TOKEN_NOT_VALID));
    }

    //리프레시 토큰 값 추출 테스트
    public void valueTest(RefreshToken refreshToken) {
        log.info("리프레시 토큰 값 : {}", refreshToken.getRefreshValue());
        log.info("유저 id : {}", refreshToken.getUserId());
    }
}
