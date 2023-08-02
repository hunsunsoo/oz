package com.fire4bird.oz.socket.repository;

import com.fire4bird.oz.socket.dto.SocketCreateDto;
import com.fire4bird.oz.socket.service.RedisSubscriber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RequiredArgsConstructor
@Repository
public class SocketRepository {
    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    // Redis
    private static final String SOKET_ROOMS = "SOKET_ROOMS"; // 소켓룸 저장
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, SocketCreateDto> opsHashChatRoom;
    private Map<String, ChannelTopic> topics;

    @PostConstruct
    private void init() {
        opsHashChatRoom = redisTemplate.opsForHash();
        topics = new HashMap<>();
    }

    // 모든 소켓방 조회
    public List<SocketCreateDto> findAllRoom() {
        return opsHashChatRoom.values(SOKET_ROOMS);
    }

    // 특정 소켓방 조회
    public SocketCreateDto findRoomById(String id) {
        return opsHashChatRoom.get(SOKET_ROOMS, id);
    }

    /**wqdxlmc;/cqaeKSLN<?
     * 채팅방 생성 : 서버간 채팅방 공유를 위해 redis hash에 저장한다.
     */
    public SocketCreateDto createRoom(String rtcSession,String temaName) {
        SocketCreateDto socketRoom = SocketCreateDto.builder().rtcSession(rtcSession).teamName(temaName     ).build();
        opsHashChatRoom.put(SOKET_ROOMS, rtcSession, socketRoom);
        return socketRoom;
    }

    /**
     * 채팅방 입장 : redis에 topic을 만들고 pub/sub 통신을 하기 위해 리스너를 설정한다.
     */
    public void enterSocketRoom(String roomId) {
        ChannelTopic topic = topics.get(roomId);
        if (topic == null) {
            topic = new ChannelTopic(roomId);
            redisMessageListener.addMessageListener(redisSubscriber, topic);
            topics.put(roomId, topic);
        }
    }

    public ChannelTopic getTopic(String roomId) {
        return topics.get(roomId);
    }
}