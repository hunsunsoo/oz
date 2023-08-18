package com.fire4bird.oz.emailcode.mapper;

import com.fire4bird.oz.emailcode.key.EmailCode;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmailCodeMapper {
    EmailCode paramToEmailCode(String emailCode, String email);
}
