package com.fire4bird.oz.socket.repository;

import com.fire4bird.oz.round.dto.Res.RoundStartRes;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.service.RedisSubscriber;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
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
    //Redis CacheKeys
    private static final String SOKET_ROOMS = "SOKET_ROOMS";

    @Resource(name = "redisTemplate")
    private HashOperations<String, String, Integer> opsHashSocketRoom;
    @Resource(name = "redisTemplate")
    private HashOperations<String, String, RedisSaveObject> manageUserChannel;

    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    private Map<String, ChannelTopic> topics;

    @PostConstruct
    private void init() {
        topics = new HashMap<>();
    }

    // redis 키 생성 : 서버간 소켓방 공유를 위해 redis hash에 저장한다.(+방장)
    public void createRoom(String rtcSession, Integer userId) {
        opsHashSocketRoom.put(SOKET_ROOMS, rtcSession, userId);
    }

    // 모든 소켓방 조회
    public List<Integer> findAllRoom() {
        return opsHashSocketRoom.values(SOKET_ROOMS);
    }

    // 특정 소켓방 방장 조회
    public Integer findOwnerById(String rtcSession) {
        return opsHashSocketRoom.get(SOKET_ROOMS, rtcSession);
    }

    // 특정 소켓방 제거
    public void deleteRoom(String rtcSession) {
        opsHashSocketRoom.delete(SOKET_ROOMS, rtcSession);
    }

    // 관리방 유저 등록(+회차)
    public void enterUser(String rtcSession, String userId, RedisSaveObject round) {
        manageUserChannel.put(rtcSession, userId, round);
    }

    // 관리방 유저 모두 조회
    public List<RedisSaveObject> findAllUser(String rtcSession) {
        return manageUserChannel.values(rtcSession);
    }

    // 관리방 유저 회차 조회
    public RedisSaveObject findRoundById(String rtcSession, String userId) {
        return manageUserChannel.get(rtcSession, userId);
    }

    // 관리방 유저 삭제
    public void deleteUser(String rtcSession, String userId) {
        manageUserChannel.delete(rtcSession, userId);
    }

    // channel 생성 : redis에 topic을 만들고 pub/sub 통신을 하기 위해 리스너를 설정한다.
    public void createChannel(String roomId) {
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