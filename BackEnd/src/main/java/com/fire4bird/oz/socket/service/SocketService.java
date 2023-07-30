package com.fire4bird.oz.socket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.socket.dto.SocketCreateDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class SocketService {

    private final ObjectMapper objectMapper;
    private Map<String, SocketCreateDto> socketRooms;

    @PostConstruct
    private void init() {
        socketRooms = new LinkedHashMap<>();
    }

    public SocketCreateDto findRoomById(String rtcSession) {
        return socketRooms.get(rtcSession);
    }

    public SocketCreateDto createRoom(String rtcSession, String teamName) {
        SocketCreateDto socketRoom = SocketCreateDto.builder()
                .rtcSession(rtcSession)
                .teamName(teamName)
                .build();
        socketRooms.put(rtcSession, socketRoom);
        return socketRoom;
    }

    public <T> void sendMessage(WebSocketSession session, T message) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        } catch (IOException e) {
            new BusinessLogicException(ExceptionCode.SOCKET_MESSAGE_FAIL);
        }
    }
}