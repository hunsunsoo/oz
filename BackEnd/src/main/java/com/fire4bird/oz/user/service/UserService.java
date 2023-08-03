package com.fire4bird.oz.user.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
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

    //유저 회원가입
    public User registUser(User user, String provider) {
        checkEmailAndProvider(user.getEmail(), provider);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider(provider);

        return userRepository.save(user);
    }

    //유저 회원 탈퇴
    public void resignUser(int userId, String password) {
        User user = findUser(userId);

        if (user.getProvider().equals("self")) {
            checkPassword(password, user);
        }

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
        Optional<User> findUser = userRepository.findByEmailAndProviderAndOutDateNull(email, provider);

        return findUser
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }

    //회원 정보 수정
    public void updateUser(User user) {
        User findUser = findUser(user.getUserId());

        Optional.ofNullable(user.getName())
                .ifPresent(findUser::setName);

        Optional.ofNullable(user.getNickname())
                .ifPresent(findUser::setNickname);

        Optional.ofNullable(user.getPassword())
                        .ifPresent(password -> findUser.setPassword(passwordEncoder.encode(password)));

        userRepository.save(findUser);
    }

    public User findUser(int userId) {
        Optional<User> findUser = userRepository.findById(userId);

        return findUser
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }


    //리프레시 유저 식별자 = 토큰 payload 사용자 동일한지 확인
    public User checkUser(int refreshUserId, int payloadId) {
        if(refreshUserId == payloadId){
            return findUser(refreshUserId);
        }

        throw new BusinessLogicException(ExceptionCode.TOKEN_NOT_VALID);
    }

    //회원가입 이메일 및 provider 중복 검사
    public void checkEmailAndProvider(String email, String provider) {
        Optional<User> findUser = userRepository.findByEmailAndProviderAndOutDateNull(email, provider);

        if (findUser.isPresent()) {
            throw new BusinessLogicException(ExceptionCode.DUPLICATE_ID);
        }
    }

    //패스워드 일치여부 확인
    public void checkPassword(String password, User user) {
        boolean matches = passwordEncoder.matches(password, user.getPassword());

        if(!matches){
            throw new BusinessLogicException(ExceptionCode.BAD_PARAM);
        }
    }
}