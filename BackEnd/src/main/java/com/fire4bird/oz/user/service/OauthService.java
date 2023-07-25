package com.fire4bird.oz.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.user.entity.User;
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

    private final UserService userService;

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

    //로그인 및 회원가입
    public void registOrLogin(String email, String nickname) {

        //회원 가입을 했는 지 확인
        //findUser가 회원 못 찾으면 에러 뱉음 -> try catch로 처리
        try {
            User user = userService.findUser(email, "kakao");

            //회원가입을 이미 했다면 로그인 처리
            //카카오는 비밀번호 대조를 진행하지 않음
            //추가적이 메서드 생성 or 회원가입 처리 시 임의의 비밀번호 insert
            //회원 가입 처리 시 임의의 비밀번호를 넣지 않는다면? -> password 컬럼 null 가능해야함 -> 자체 로그인 진행시 dto에서 password 필드유효성 검사 진행
            //임의의 비밀번호를 넣었을 경우 -> 회원 비밀번호 변경을 진행하였을 때 -> 추후 로그인 진행 시 문제 발생

        } catch (Exception e) {

        }


        //회원가입을 하지 않았다면 회원 가입 후 로그인 처리
        
    }
}
