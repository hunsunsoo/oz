package com.fire4bird.oz.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDto {
    private int userId;
    private String name;
    private String nickname;
    private String password;
}
