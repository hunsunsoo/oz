package com.fire4bird.oz.round.entity;

import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Builder
public class UserRoundId implements Serializable {

    // 생성자 추가
    public UserRoundId(){}

    public UserRoundId(Integer roundId, Integer userId, Integer teamId) {
        this.roundId = roundId;
        this.userId = userId;
        this.teamId = teamId;
    }

    private Integer userId;
    private Integer teamId;
    private Integer roundId;
}
