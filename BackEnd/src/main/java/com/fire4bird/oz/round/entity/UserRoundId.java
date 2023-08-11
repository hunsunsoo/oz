package com.fire4bird.oz.round.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRoundId implements Serializable {

    private Integer userId;
    private Integer teamId;
    private Integer roundId;
}
