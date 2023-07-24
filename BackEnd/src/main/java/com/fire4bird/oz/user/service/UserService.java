package com.fire4bird.oz.user.service;

import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //유저 임시 회원가입
    public void registUser(User user,String provider) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider(provider);

        userRepository.save(user);
    }
}
