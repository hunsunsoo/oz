package com.fire4bird.oz.socket.service;

import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.dto.SocketRoleDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RoleService {

    private Map<String, int[]> roles;

    @PostConstruct
    private void init() {
        roles = new HashMap<>();
    }

    /**
     * 역할 선택 : 먼저 들어온 데이터 먼저 처리
     */
    public SocketRoleDto roleSelect(SocketMessage message, SocketRoleDto socketRoleDto) {
        int selectRole = socketRoleDto.getRole();
        int userId = message.getUserId();
        String msg = "";
        int state = -1;
        if (roles.containsKey(message.getRtcSession())) {
            int[] role = roles.get(message.getRtcSession());
            int getRole = checkRole(role, userId);
            //유저 역할 선택시
            if (socketRoleDto.getState() == 1) {
                //이미 선택된 경우
                if (role[selectRole] != 0) msg = selectRole + "역할은 이미 선택되었습니다.";
                else {
                //선택되지 않은 경우
                    //유저가 다른 역할을 선택했는지 확인
                    if (getRole == 0) {
                        role[selectRole] = userId;
                        state = 1;
                        msg = userId + "님이 " + selectRole + "역할을 선택하였습니다.";
                    } else msg = userId + "님은 이미 역할을 선택하였습니다.";
                }
            } else {
                //유저 역할 취소시
                if (getRole != 0) {
                    //갖고있는 역할이 있음
                    //선택한 역할과 갖고있는 역할이 같다면 취소
                    if (selectRole == getRole) {
                        state = 1;
                        role[getRole] = 0;
                        msg = userId + "님이 갖고 있는 역할을 취소하였습니다.";
                    } else msg = userId + "님은 " + selectRole + "역할을 갖고있지 않습니다."
                } else msg = userId + "님이 갖고 있는 역할이 없어 취소할 수 없습니다.";
            }
            roles.replace(message.getRtcSession(), role);
        } else {
            int[] role = new int[5];
            role[selectRole] = userId;
            msg = userId + "님이 " + selectRole + "역할을 선택하였습니다.";
            state = 1;
            roles.put(message.getRtcSession(), role);
        }
        message.setMessage(msg);
        socketRoleDto.setSaveState(state);
        return socketRoleDto;
    }

    private int checkRole(int[] role, int userId) {
        int check = 0;
        for (int i = 1; i < role.length; i++) {
            if (userId == role[i])
                check = i;
        }
        return check;
    }
}
