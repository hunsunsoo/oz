package com.fire4bird.oz.socket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.socket.dto.SocketRoomDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class SocketService {

    private final ObjectMapper objectMapper;
    private Map<String, SocketRoomDto> socketRooms;

    @PostConstruct
    private void init() {
        socketRooms = new LinkedHashMap<>();
    }

    public List<SocketRoomDto> findAllRoom() {
        return new ArrayList<>(socketRooms.values());
    }

    public SocketRoomDto findRoomById(String roomId) {
        return socketRooms.get(roomId);
    }

    public SocketRoomDto createRoom(String rtcSession, String teamName) {
        SocketRoomDto socketRoom = SocketRoomDto.builder()
                .RTCSession(rtcSession)
                .teamName(teamName)
                .build();
        socketRooms.put(rtcSession, socketRoom);
        return socketRoom;
    }

    public <T> void sendMessage(WebSocketSession session, T message) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }
}