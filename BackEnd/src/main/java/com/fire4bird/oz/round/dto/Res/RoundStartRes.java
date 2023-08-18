package com.fire4bird.oz.round.dto.Res;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoundStartRes implements Serializable {
    private int roundId;
    private int teamId;
    private int round;
}
