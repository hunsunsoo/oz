package com.fire4bird.oz.socket.controller;

import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.socket.dto.SocketCreateDto;
import com.fire4bird.oz.socket.repository.SocketRepository;
import jakarta.validation.Valid;
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
    public ResponseEntity createRoom(@Valid @RequestBody SocketCreateDto socketCreate, BindingResult bindingResult) {
        SocketCreateDto socketRoom = socketRepository.createRoom(socketCreate.getRtcSession(),socketCreate.getTeamName());
        return new ResponseEntity<>(new CMRespDto<>(1,"웹소켓 방 생성", socketRoom), HttpStatus.OK);
    }

}