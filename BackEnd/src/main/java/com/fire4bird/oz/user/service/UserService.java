package com.fire4bird.oz.user.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.jwt.JwtProvider;
import com.fire4bird.oz.user.dto.MyPageDto;
import com.fire4bird.oz.user.dto.UpdatePassword;
import com.fire4bird.oz.user.dto.UpdateUserDto;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    //유저 회원가입
    public User registUser(User user, String provider) {
        checkEmailAndProvider(user.getEmail(), provider);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider(provider);

        return userRepository.save(user);
    }

    //유저 회원 탈퇴
    public void resignUser(int userId, String password) {
        log.info("회원 탈퇴 서비스 로직 진입");

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

    //로그인이 되었을 때
    //회원 정보 수정
    public void updateUser(UpdateUserDto user) {
        User findUser = findUser(user.getUserId());

        Optional.ofNullable(user.getName())
                .ifPresent(findUser::setName);

        Optional.ofNullable(user.getNickname())
                .ifPresent(findUser::setNickname);

        userRepository.save(findUser);
    }

    public void loginCheck(UpdatePassword updatePassword, String accessToken) {
        if (accessToken == null) {
            log.info("로그인 전");
            updatePassword(updatePassword);
        }
        else {
            log.info("로그인 후");
            log.info("accessToken : {}", accessToken);
            log.info("updatePassword :{}", updatePassword);
            int userId = Integer.parseInt(jwtProvider.getUserId(accessToken));

            updatePassword2(updatePassword, userId);
        }
    }

    //로그인 후 비밀번호 변경 로직
    public void updatePassword2(UpdatePassword updatePassword, int userId) {
        User findUser = findUser(userId);
        log.info("findUser :{}", findUser);

        Optional.ofNullable(updatePassword.getPassword())
                .ifPresent(password -> {
                    checkPassword(password,findUser);
                    findUser.setPassword(passwordEncoder.encode(updatePassword.getNewPassword()));
                });

        userRepository.save(findUser);
    }

    //로그인 전 비밀번호 변경 로직
    public void updatePassword(UpdatePassword updatePassword) {
        User user = findUser(updatePassword.getEmail(), "self");

        user.setPassword(passwordEncoder.encode(updatePassword.getNewPassword()));

        userRepository.save(user);
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
            throw new BusinessLogicException(ExceptionCode.PASSWORD_NOT_VALID);
        }
    }

    //마이페이지 조회
    public MyPageDto findMyPage(int userId) {
        return userRepository.findByUserMyPage(userId);
    }
}