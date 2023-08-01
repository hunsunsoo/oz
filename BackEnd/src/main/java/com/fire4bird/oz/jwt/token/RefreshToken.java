package com.fire4bird.oz.jwt.token;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

@NoArgsConstructor
@AllArgsConstructor
@Data
@RedisHash(value = "refreshToken")
public class RefreshToken {
    @Id
    private String userId;

    private String refreshValue;
}
