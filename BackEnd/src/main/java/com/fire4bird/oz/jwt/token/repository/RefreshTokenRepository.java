package com.fire4bird.oz.jwt.token.repository;

import com.fire4bird.oz.jwt.token.key.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
