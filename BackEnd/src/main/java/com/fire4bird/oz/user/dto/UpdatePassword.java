package com.fire4bird.oz.user.dto;

import lombok.Data;

@Data
public class UpdatePassword {
    private String password;
    private String newPassword;
    private String email;
}
