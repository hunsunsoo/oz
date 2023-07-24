package com.fire4bird.oz.user.controller;

import com.fire4bird.oz.user.dto.RegistUserDto;
import com.fire4bird.oz.user.mapper.UserMapper;
import com.fire4bird.oz.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    //유저 회원가입
    @PostMapping("/signup")
    public ResponseEntity registUser(@RequestBody RegistUserDto registUserDto) {
        userService.registUser(userMapper.registUserToUser(registUserDto),"self");
        return ResponseEntity.ok("회원 가입 완료");
    }
    //유저 회원탈퇴


}
