package com.fire4bird.oz.jwt.refresh.key;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@NoArgsConstructor
@AllArgsConstructor
@Data
@RedisHash(value = "refreshToken")
public class RefreshToken {
    //jpa가 쓰는 id랑 다름
    //스프링프레임워크.데이터.어노테이션에 있는 id 써야함
    @Id
    private String refreshValue;

    private int userId;
}
