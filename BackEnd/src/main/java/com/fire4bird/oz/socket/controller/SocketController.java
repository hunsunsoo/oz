package com.fire4bird.oz.socket.controller;

import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.socket.dto.SocketRoomDto;
import com.fire4bird.oz.socket.repository.SocketRepository;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/socket")
public class SocketController {

    private final SocketRepository socketRepository;

    @PostMapping
    public ResponseEntity createSocketRoom(@Valid @RequestBody SocketRoomDto socketRoomDto, BindingResult bindingResult) {
        socketRepository.createRoom(socketRoomDto.getRtcSession(),socketRoomDto.getOwner());
        socketRepository.createChannel(socketRoomDto.getRtcSession());
        return new ResponseEntity<>(new CMRespDto<>(1,"소켓방 등록", null), HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity deleteSocketRoom(@RequestParam String rtcSession) {
        socketRepository.deleteRoom(rtcSession);
        return new ResponseEntity<>(new CMRespDto<>(1,"소켓방 나가기", null), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity findOwner(@RequestParam String rtcSession) {
        return new ResponseEntity<>(new CMRespDto<>(1,"방장 조회", socketRepository.findRoomById(rtcSession)), HttpStatus.OK);
    }
}