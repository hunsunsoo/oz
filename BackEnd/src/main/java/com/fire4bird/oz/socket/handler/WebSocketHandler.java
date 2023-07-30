package com.fire4bird.oz.socket.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.dto.SocketCreateDto;
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

    //양방향 데이터 통신
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception{
        String payload = message.getPayload();
        System.out.println("들어옴?");
        log.info("payload {}", payload);

        SocketMessage chatMessage = objectMapper.readValue(payload, SocketMessage.class);
        SocketCreateDto room = socketService.findRoomById(chatMessage.getRtcSession());
        room.handleActions(session, chatMessage, socketService);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        super.handleMessage(session, message);
    }

    //소켓 통신 에러
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        super.handleTransportError(session, exception);
    }

    @Override
    protected void handlePongMessage(WebSocketSession session, PongMessage message) throws Exception {
        super.handlePongMessage(session, message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        log.info("퇴장");
    }
}
