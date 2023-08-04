package com.fire4bird.oz.socket.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class RedisSaveObject implements Serializable {
        private int roundId;
        private int teamId;
        private int round;
        private int role;
        private int userId;
}
