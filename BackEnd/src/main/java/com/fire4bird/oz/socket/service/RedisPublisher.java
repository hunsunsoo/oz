package com.fire4bird.oz.socket.service;

import com.fire4bird.oz.socket.dto.SocketMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

// import 생략...
@RequiredArgsConstructor
@Service
public class RedisPublisher {
    private final RedisTemplate<String, Object> redisTemplate;

    public void publish(ChannelTopic topic, SocketMessage message) {
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}