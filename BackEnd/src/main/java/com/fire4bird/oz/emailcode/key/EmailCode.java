package com.fire4bird.oz.emailcode.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "EmailCode")
public class EmailCode {
    @Id
    private String emailCode;

    private String email;
}
