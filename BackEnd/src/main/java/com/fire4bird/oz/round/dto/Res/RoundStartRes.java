package com.fire4bird.oz.round.dto.Res;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class RoundStartRes implements Serializable {
    private int roundId;
    private int teamId;
    private int round;
}
