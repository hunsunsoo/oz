package com.fire4bird.oz.socket.service;

import com.fire4bird.oz.socket.dto.SocketCreateDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class SocketRepository {

    private Map<String, SocketCreateDto> socketRooms;

    @PostConstruct
    private void init() {
        socketRooms = new LinkedHashMap<>();
    }

    public SocketCreateDto findRoomById(String rtcSession) {
        return socketRooms.get(rtcSession);
    }

    public SocketCreateDto createRoom(String rtcSession, String teamName) {
        SocketCreateDto socketRoom = SocketCreateDto.create(rtcSession,teamName);
        socketRooms.put(rtcSession, socketRoom);
        return socketRoom;
    }

}