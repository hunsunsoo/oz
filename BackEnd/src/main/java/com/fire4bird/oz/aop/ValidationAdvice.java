package com.fire4bird.oz.aop;


import java.util.HashMap;
import java.util.Map;

import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.error.CustomValidationApiException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@Component
@Aspect //AOP 처리
@Slf4j
public class ValidationAdvice {
    @Around("execution(* com.fire4bird.oz.*.controller.*Controller.*(..))")
    public Object apiAdvice(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
        Object[] args = proceedingJoinPoint.getArgs();
        for (Object arg : args) {
            if(arg instanceof BindingResult) {
                BindingResult bindingResult = (BindingResult) arg;
                if (bindingResult.hasErrors()) {
                    Map<String, String> errorMap = new HashMap<>();

                    for (FieldError error : bindingResult.getFieldErrors()) {
                        errorMap.put(error.getField(), error.getDefaultMessage());
                        log.info(error.getDefaultMessage());
                    }
                    throw new CustomValidationApiException(ExceptionCode.VALIDATION_FAIL.getMessage(), errorMap);
                }
            }
        }

        return proceedingJoinPoint.proceed();
    }

}
