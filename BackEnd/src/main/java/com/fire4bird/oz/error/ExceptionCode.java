package com.fire4bird.oz.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public enum ExceptionCode {
    /** 유저 관련 **/
    DUPLICATE_ID(HttpStatus.CONFLICT.value(), "중복된 아이디가 존재합니다."),
    BAD_PARAM(HttpStatus.NOT_FOUND.value(),"아이디 혹은 비밀번호가 틀렸습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND.value(),"해당 회원을 찾을 수 없습니다."),
    TOKEN_NOT_VALID(HttpStatus.UNAUTHORIZED.value(), "토큰이 유효하지 않습니다.") ,
    CODE_NOT_VALID(HttpStatus.BAD_REQUEST.value(),"잘 못 된 인증 코드입니다."),

    /** 모험 시작 **/
    TEAM_NOT_FOUND(HttpStatus.NOT_FOUND.value(), "팀을 찾을 수 없습니다."),
    VALIDATION_FAIL(HttpStatus.BAD_REQUEST.value(), "유효검사 실패하였습니다."),
    FORBIDDEN_OWNER(HttpStatus.FORBIDDEN.value(), "방장이 아닙니다."),

    /** 웹 소켓 **/
    SOCKET_MESSAGE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR.value(),"웹 소켓 메시지 전달에 실패하였습니다."),

    /** 기록 **/
    BAD_REQUEST(HttpStatus.BAD_REQUEST.value(), "잘 못 된 요청입니다."),;
    @Getter
    private final int status;

    @Getter
    private final String message;

    ExceptionCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
