package com.fire4bird.oz.jwt.blacklist.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "BlackList")
public class BlackList {
    @Id
    private String accessValue;
}
