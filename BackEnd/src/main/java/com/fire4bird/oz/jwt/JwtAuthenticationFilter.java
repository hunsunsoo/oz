package com.fire4bird.oz.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("doFilter 메서드 실행");

        String accessToken = jwtProvider.getAccessToken(request);
        String refreshToken = jwtProvider.getRefreshToken(request);

        log.info("accessToken : {}", accessToken);
        log.info("refreshToken : {}", refreshToken);

        //엑세스 토큰이 유효한 경우
        if (accessToken != null && jwtProvider.isTokenValid(accessToken)) {
            log.info("엑세스 토큰 유효");
            setAuthentication(accessToken);
        } else if (refreshToken != null && jwtProvider.isTokenValid(refreshToken)) {
            log.info("엑세스 토큰 만료");
            log.info("리프레시 토큰 유효");
            setAuthentication(refreshToken);
        }
        filterChain.doFilter(request,response);
    }
    
    //토큰에서 사용자 정보 추출 후 인메모리에 저장
    private void setAuthentication(String token) {
        Authentication authentication = jwtProvider.getAuthentication(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
