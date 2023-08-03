package com.fire4bird.oz.socket.dto;

import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SocketRoleDto implements Serializable {

    private int role;
    private int state;//요청 상태(-1:취소,1:선택)
    private int saveState;//저장 상태(-1:실패,1:성공)
}