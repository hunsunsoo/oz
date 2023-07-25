package com.fire4bird.oz.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
@Slf4j
public class OauthService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.token-url}")
    private String tokenUri;

    @Value("${kakao.info-url}")
    private String infoUri;

    //인가 코드로 토큰 받아오기
    public String getToken(String code) {
        WebClient webClient = WebClient.create();

        //kakao 요청 문서에 따른 폼 데이터 생성
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);
        body.add("grant_type","authorization_code");


        return webClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) //폼 데이터 형식
                .body(BodyInserters.fromFormData(body)) //폼 데이터를 바디에 넣음
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    //토큰으로 사용자 정보 받아오기
    public String getUserInfo(String response) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        WebClient webClient = WebClient.create();
        //일단 응답 받고 어떻게 가져오는 지 확인하기

        String accessToken = mapper.readTree(response).get("access_token").asText();

        log.info("accessToken : {}", accessToken);


        String userInfo = webClient.post()
                .uri(infoUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        String nickname = mapper.readTree(userInfo).get("properties").get("nickname").asText();
        String email = mapper.readTree(userInfo).get("kakao_account").get("email").asText();

        log.info("nickname : {}", nickname);
        log.info("email : {}", email);

        return userInfo;
    }
}
