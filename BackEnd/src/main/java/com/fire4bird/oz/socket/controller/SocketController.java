package com.fire4bird.oz.socket.controller;

import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.round.dto.Res.RoundStartRes;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
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

    @PostMapping("/room")
    public ResponseEntity createSocketRoom(@Valid @RequestBody SocketRoomDto socketRoomDto, BindingResult bindingResult) {
        socketRepository.createRoom(socketRoomDto.getRtcSession(),socketRoomDto.getUserId());
        socketRepository.createChannel(socketRoomDto.getRtcSession());
        return new ResponseEntity<>(new CMRespDto<>(1,"소켓방 등록", null), HttpStatus.OK);
    }

    @DeleteMapping("/room")
    public ResponseEntity deleteSocketRoom(@RequestParam String rtcSession) {
        socketRepository.deleteRoom(rtcSession);
        return new ResponseEntity<>(new CMRespDto<>(1,"소켓방 나가기", null), HttpStatus.OK);
    }

    @GetMapping("/room")
    public ResponseEntity findOwner(@RequestParam String rtcSession) {
        return new ResponseEntity<>(new CMRespDto<>(1,"방장 조회", socketRepository.findOwnerById(rtcSession)), HttpStatus.OK);
    }

    @PostMapping("/user")
    public ResponseEntity findAllRoomUser(@RequestParam String rtcSession) {
        return new ResponseEntity<>(new CMRespDto<>(1,"소켓방 유저 확인", socketRepository.findAllUser(rtcSession)), HttpStatus.OK);
    }

    @DeleteMapping("/user")
    public ResponseEntity outRoomUser(@Valid @RequestBody SocketRoomDto socketRoomDto, BindingResult bindingResult) {
        socketRepository.deleteUser(socketRoomDto.getRtcSession(),socketRoomDto.getUserId());
        return new ResponseEntity<>(new CMRespDto<>(1,"소켓방 유저 나감", null), HttpStatus.OK);
    }

    //해당 유저가 갖고 있는 게임 정보(회차, 역할 등)
    @GetMapping("/user")
    public RedisSaveObject findUserRound(@Valid @RequestBody SocketRoomDto socketRoomDto, BindingResult bindingResult) {
        return socketRepository.findRoundById(socketRoomDto.getRtcSession(),String.valueOf(socketRoomDto.getUserId()));
    }

}