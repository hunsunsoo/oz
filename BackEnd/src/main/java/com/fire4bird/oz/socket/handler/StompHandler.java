//package com.fire4bird.oz.socket.handler;
//
//import com.fire4bird.oz.socket.dto.SocketMessage;
//import com.fire4bird.oz.socket.repository.SocketRepository;
//import com.fire4bird.oz.socket.service.SocketService;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompCommand;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//
//import java.security.Principal;
//import java.util.Optional;
//
//@Slf4j
//public class StompHandler implements ChannelInterceptor {
//
//    private SocketRepository socketRepository;
//    private SocketService socketService;
//
//    // websocket을 통해 들어온 요청이 처리 되기전 실행된다.
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//        if (StompCommand.CONNECT == accessor.getCommand()) { // websocket 연결요청
//            String jwtToken = accessor.getFirstNativeHeader("token");
//            log.info("CONNECT {}", jwtToken);
//        } else if (StompCommand.SUBSCRIBE == accessor.getCommand()) { // 소켓룸 구독요청
//            // header정보에서 구독 destination정보를 얻고, roomId를 추출한다.
//            String roomId = socketService.getRoomId(Optional.ofNullable((String) message.getHeaders().get("simpDestination")).orElse("InvalidRoomId"));
//            // 소켓방에 들어온 클라이언트 sessionId를 roomId와 맵핑해 놓는다.(나중에 특정 세션이 어떤 소켓방에 들어가 있는지 알기 위함)
//            String sessionId = (String) message.getHeaders().get("simpSessionId");
//            socketRepository.setUserEnterInfo(sessionId, roomId);
//            // 소켓방의 인원수를 +1한다.
//            socketRepository.plusUserCount(roomId);
//            // 클라이언트 입장 메시지를 소켓방에 발송한다.(redis publish)
//            String userId = Optional.ofNullable((Principal) message.getHeaders().get("UserId")).map(Principal::getName).orElse("UnknownUser");
//            socketService.sendSocketMessage(SocketMessage.builder().type(SocketMessage.MessageType.ENTER).rtcSession(roomId).userId(Integer.parseInt(userId)).build());
//            log.info("SUBSCRIBED {}, {}", userId, roomId);
//        } else if (StompCommand.DISCONNECT == accessor.getCommand()) { // Websocket 연결 종료
//            // 연결이 종료된 클라이언트 sesssionId로 소켓방 id를 얻는다.
//            String sessionId = (String) message.getHeaders().get("rtcSessionId");
//            String roomId = socketRepository.getUserEnterRoomId(sessionId);
//            // 소켓방의 인원수를 -1한다.
//            socketRepository.minusUserCount(roomId);
//            // 클라이언트 퇴장 메시지를 소켓방에 발송한다.(redis publish)
//            String userId = Optional.ofNullable((Principal) message.getHeaders().get("simpUser")).map(Principal::getName).orElse("UnknownUser");
//            socketService.sendSocketMessage(SocketMessage.builder().type(SocketMessage.MessageType.QUIT).rtcSession(roomId).userId(Integer.parseInt(userId)).build());
//            // 퇴장한 클라이언트의 roomId 맵핑 정보를 삭제한다.
//            socketRepository.removeUserEnterInfo(sessionId);
//            log.info("DISCONNECTED {}, {}", sessionId, roomId);
//        }
//        return message;
//    }
//}