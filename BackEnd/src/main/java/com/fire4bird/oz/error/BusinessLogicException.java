package com.fire4bird.oz.error;

import lombok.Getter;

public class BusinessLogicException extends RuntimeException{

    @Getter
    private final ExceptionCode exceptionCode;

    public BusinessLogicException(ExceptionCode exceptionCode) {
        super(exceptionCode.getMessage());
        this.exceptionCode = exceptionCode;
    }
}
