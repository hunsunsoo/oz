package com.fire4bird.oz.emailcode.service;

import com.fire4bird.oz.emailcode.key.EmailCode;
import com.fire4bird.oz.emailcode.repository.EmailCodeRepository;
import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailCodeService {
    private final EmailCodeRepository emailCodeRepository;
    private final JavaMailSender javaMailSender;
    private final UserService userService;

    //만든 인증코드 레디스에 저장
    public void saveEmailCode(EmailCode emailCode) {
        emailCodeRepository.save(emailCode);
    }

    //레디스에 있는 인증 코드 조회
    public void findEmailCode(String emailCode) {
        Optional<EmailCode> findEmailCode = emailCodeRepository.findById(emailCode);

        findEmailCode
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.CODE_NOT_VALID));
    }

    //레디스에 있는 인증 코드 삭제
    public void deleteEmailCode(String emailCode ) {
        emailCodeRepository.deleteById(emailCode);
    }

    //인증번호 생성
    public String createCode() {
        log.info("인증코드 생성 진입");
        Random random = new Random();
        StringBuffer key = new StringBuffer();

        for (int i = 0; i < 4; i++) {
            int index = random.nextInt(4);

            switch (index) {
                case 0:
                    key.append((char) ((int) random.nextInt(26) + 97));
                    break;
                case 1:
                    key.append((char) ((int) random.nextInt(26) + 65));
                    break;
                default:
                    key.append(random.nextInt(9));
            }
        }
        log.info("인증코드 생성 끝");
        return key.toString();
    }


    //메일 전송
    public String sendMail(int userId) throws MessagingException {
        User user = userService.findUser(userId);

        log.info("메일 전송 메서드 진입");
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        //인증 코드 생성
        String key = createCode();

        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
        mimeMessageHelper.setTo(user.getEmail());
        mimeMessageHelper.setSubject("oz 이메일 인증코드 입니다.");
        mimeMessageHelper.setText("인증코드는 : " + key + "입니다.");
        javaMailSender.send(mimeMessage);

        log.info("이메일 전송 성공");
        return key;
    }
}
