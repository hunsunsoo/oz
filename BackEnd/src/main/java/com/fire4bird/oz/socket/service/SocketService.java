//package com.fire4bird.oz.socket.service;
//
//import com.fire4bird.oz.socket.dto.SocketMessage;
//import com.fire4bird.oz.socket.repository.SocketRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.listener.ChannelTopic;
//import org.springframework.stereotype.Service;
//
//@RequiredArgsConstructor
//@Service
//public class SocketService {
//    private final ChannelTopic channelTopic;
//    private final RedisTemplate redisTemplate;
//    private final SocketRepository socketRepository;
//
//    /**
//     * destination정보에서 roomId 추출
//     */
//    public String getRoomId(String destination) {
//        int lastIndex = destination.lastIndexOf('/');
//        if (lastIndex != -1)
//            return destination.substring(lastIndex + 1);
//        else
//            return "";
//    }
//
//    /**
//     * 채팅방에 메시지 발송
//     */
//    public void sendSocketMessage(SocketMessage socketMessage) {
//        socketMessage.setUserCnt(socketRepository.getUserCount(socketMessage.getRtcSession()));
//        if (SocketMessage.MessageType.ENTER.equals(socketMessage.getType())) {
//            socketMessage.setMessage(socketMessage.getUserId() + "님이 방에 입장했습니다.");
//        } else if (SocketMessage.MessageType.QUIT.equals(socketMessage.getType())) {
//            socketMessage.setMessage(socketMessage.getUserId() + "님이 방에서 나갔습니다.");
//        }
//        redisTemplate.convertAndSend(channelTopic.getTopic(), socketMessage);
//    }
//}
