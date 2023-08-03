package com.fire4bird.oz.jwt.refresh.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.jwt.refresh.key.RefreshToken;
import com.fire4bird.oz.jwt.refresh.repository.RefreshTokenRepository;
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
}
