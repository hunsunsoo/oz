package com.fire4bird.oz.jwt;

import com.fire4bird.oz.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JwtProvider {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.access-token-valid-time}")
    private long accessTokenValidTime;

    @Value("${jwt.refresh-token-valid-time}")
    private long refreshTokenValidTime;

    //키 생성
    private static Key getSigningKey(String secretKey) {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        SecretKey key = new SecretKeySpec(keyBytes, "HmacSHA256");
        return key;
    }

    //토큰생성 - 공통 코드
    public String createToken(User user,long time) {
        //토큰 제목
        log.info("토큰 생성하러 들어감");
        Claims claims = Jwts.claims();

        Date now = new Date();
        claims
                .setSubject(Integer.toString(user.getUserId()))
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime()+ time));

        claims.put("userId",user.getUserId());
        claims.put("email",user.getEmail());
        claims.put("name",user.getName());
        claims.put("nickname",user.getNickname());
        claims.put("provider",user.getProvider());

        return Jwts.builder()
                .setClaims(claims)
                .signWith(getSigningKey(secretKey), SignatureAlgorithm.HS256)
                .compact();
    }

    //엑세스 토큰 생성
    public String createAccessToken(User user) {
        return this.createToken(user, accessTokenValidTime);
    }

    //리프레시 토큰 생성
    public String createRefreshToken(User user) {
        return this.createToken(user, refreshTokenValidTime * 2);
    }
    //토큰에서 유저정보 까기
    
    //토큰 유효성 검증

    //엑세스 토큰 재발급
}
