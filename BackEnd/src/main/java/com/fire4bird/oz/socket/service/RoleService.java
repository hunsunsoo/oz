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
        if(roles.containsKey(message.getRtcSession())){
            int[] role = roles.get(message.getRtcSession());
            int selectedRole = role[message.getUserId()];
            //유저 역할 선택시
            if(socketRoleDto.getState()==1){
                //이미 선택한 경우
                if(selectedRole!=0){
                    message.setMessage(message.getUserId() + "님은 이미 "+selectedRole+"역할을 선택하였습니다.");
                    socketRoleDto.setSaveState(-1);
                }else{
                //선택하지 않은 경우
                    //선택 할 수 있는 경우
                    if(checkRole(role, selectRole)){
                        role[message.getUserId()] = selectRole;
                        message.setMessage(message.getUserId() + "님이"+selectRole+"역할을 선택하였습니다.");
                        socketRoleDto.setSaveState(1);
                    }else {
                    //다른 유저가 선택한 경우
                        message.setMessage(message.getUserId() + "님은 이미 다른 유저가 선택하였습니다.");
                        socketRoleDto.setSaveState(-1);
                    }
                }
            }else {
            //유저 역할 취소
                role[message.getUserId()] = 0;
                message.setMessage(message.getUserId() + "님이"+selectRole+"역할을 취소하였습니다.");
            }
            roles.replace(message.getRtcSession(), role);
        }else{
            int[] role = new int[4];
            role[message.getUserId()] = selectRole;
            message.setMessage(message.getUserId() + "님이"+selectRole+"역할을 선택하였습니다.");
            roles.put(message.getRtcSession(), role);
        }

        return socketRoleDto;
    }

    private boolean checkRole(int[] role, int selectId){
        boolean check = true;
        for(int roleId : role){
            if(roleId==selectId)
                check = false;
        }
        return check;
    }

}
