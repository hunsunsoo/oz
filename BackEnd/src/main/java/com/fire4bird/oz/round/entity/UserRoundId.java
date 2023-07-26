package com.fire4bird.oz.round.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class UserRoundId implements Serializable {
    private Integer userId;
    private Integer teamId;
    private Integer roundId;
}
