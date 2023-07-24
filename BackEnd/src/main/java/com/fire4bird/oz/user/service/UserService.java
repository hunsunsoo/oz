package com.fire4bird.oz.user.service;

import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //유저 임시 회원가입
    public void registUser(User user, String provider) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider(provider);

        userRepository.save(user);
    }

    //유저 회원 탈퇴
    public void resignUser(int userId, String password) {
        User user = findUser(userId);

        checkPassword(password, user);

        user.setOutDate(LocalDateTime.now());

        userRepository.save(user);
    }

    //유저 로그인
    public User login(String email, String password, String provider) {
        User user = findUser(email, provider);

        checkPassword(password, user);

        return user;

    }

    //회원 조회
    public User findUser(String email, String provider) {
        Optional<User> findUser = userRepository.findByEmailAndProvider(email, provider);

        return findUser
                .orElseThrow(() -> new RuntimeException("해당 회원이 없습니다."));
    }

    public User findUser(int userId) {
        Optional<User> findUser = userRepository.findById(userId);

        return findUser
                .orElseThrow(() -> new RuntimeException("비밀번호가 틀렸습니다."));
    }

    //회원가입 이메일 중복 검사

    //패스워드 일치여부 확인
    public void checkPassword(String password, User user) {
        boolean matches = passwordEncoder.matches(password, user.getPassword());

        if(!matches){
            throw new RuntimeException("비밀번호 틀림");
        }
    }
}
