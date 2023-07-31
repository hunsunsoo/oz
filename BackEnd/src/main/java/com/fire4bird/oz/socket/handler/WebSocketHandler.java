package com.fire4bird.oz.socket.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.socket.dto.SocketCreateDto;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.service.SocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final SocketService socketService;

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        var sessionId = session.getId();
        sessions.put(sessionId,session);
        log.info("입장");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception{
        String payload = message.getPayload();
        log.info("payload {}", payload);

        SocketMessage socketObjectDto = objectMapper.readValue(payload, SocketMessage.class);
        SocketCreateDto room = socketService.findRoomById(socketObjectDto.getRtcSession());
        room.handleActions(session, socketObjectDto, socketService);
    }


    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.info(session.getId()+" 예외 발생: "+exception.getMessage());
        super.handleTransportError(session, exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        log.info("퇴장");
    }
}
