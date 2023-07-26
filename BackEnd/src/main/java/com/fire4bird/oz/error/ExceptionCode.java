package com.fire4bird.oz.error;

import lombok.Getter;

public enum ExceptionCode {
    DUPLICATE_ID(409,"중복된 아이디가 존재합니다."),
    BAD_PARAM(404,"아이디 혹은 비밀번호가 틀렸습니다."),
    USER_NOT_FOUND(404,"해당 회원을 찾을 수 없습니다."),
    TOKEN_NOT_VALID(401, "토큰이 유효하지 않습니다.") ;

    @Getter
    private final int status;

    @Getter
    private final String message;

    ExceptionCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
