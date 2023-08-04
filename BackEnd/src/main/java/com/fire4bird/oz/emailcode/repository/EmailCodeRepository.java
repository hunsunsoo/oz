package com.fire4bird.oz.emailcode.repository;

import com.fire4bird.oz.emailcode.key.EmailCode;
import org.springframework.data.repository.CrudRepository;

public interface EmailCodeRepository extends CrudRepository<EmailCode, String> {
}
