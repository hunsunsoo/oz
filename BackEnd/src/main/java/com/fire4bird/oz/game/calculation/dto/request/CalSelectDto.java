package com.fire4bird.oz.game.calculation.dto.request;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CalSelectDto implements Serializable {

    private String type;
    private String rtcSession;
    private Integer role;
    private Integer stage;
    private String message;
    private int myRole;
    private int state;
    private int location;
    private String cellValue;
}
