package com.fire4bird.oz.jwt;

import com.fire4bird.oz.jwt.token.key.RefreshToken;
import com.fire4bird.oz.jwt.token.repository.RefreshTokenRepository;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import com.fire4bird.oz.user.service.CustomUserDetailService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
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

    private final UserRepository userRepository;
    private final CustomUserDetailService customUserDetailService;
    private final RefreshTokenRepository refreshTokenRepository;

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
        return this.createToken(user, accessTokenValidTime * 10);
    }

    //리프레시 토큰 생성
    public String createRefreshToken(User user) {
        String refreshToken = this.createToken(user, refreshTokenValidTime * 10);

        //리프레시 토큰이 redis에 저장되는 로직
        RefreshToken rt = new RefreshToken();
        rt.setRefreshValue(refreshToken);
        rt.setUserId(user.getUserId());
        refreshTokenRepository.save(rt);

//      리프레시 토큰이 mysql entity에 저장되는 로직
//      user.setRefreshToken(refreshToken);
//      userRepository.save(user);

        return refreshToken;
    }

    //토큰 디코딩
    public String getUserId(String token) {
        JwtParser parser = Jwts.parserBuilder().setSigningKey(getSigningKey(secretKey)).build();
        
        //토큰에서 바디를 꺼내 payload의 sub만 꺼냈음 -> 유저 식별자를 통해 db를 조회하기 위함
        //payload의 내용이 충분히 있다면 db조회 과정을 생략하고 claim을 바로 사용해되나
        //payload에 많은 정보가 들어가는 것은 보안적으로 불리하며 식별자를 통해 db를 한 번 조회하는 것이 깔끔하고 정확하다고 판단
        return parser.parseClaimsJws(token).getBody().getSubject();
    }

    //헤더에서 토큰 가져오기
    public String getAccessToken(HttpServletRequest request) {

        return request.getHeader("AccessToken");
    }
    public String getRefreshToken(HttpServletRequest request) {

        return request.getHeader("RefreshToken");
    }

    //토큰 인증 정보 조회
    public Authentication getAuthentication(String token) {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(this.getUserId(token));

        return new UsernamePasswordAuthenticationToken(userDetails, "", Collections.emptyList());
    }

    //토큰 유효성 검증
    //유효성 검사 성공 true 실패 false
    public boolean isTokenValid(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey(secretKey))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
