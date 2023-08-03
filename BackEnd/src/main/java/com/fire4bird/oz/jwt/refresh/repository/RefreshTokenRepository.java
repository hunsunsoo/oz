package com.fire4bird.oz.jwt.refresh.repository;

import com.fire4bird.oz.jwt.refresh.key.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
