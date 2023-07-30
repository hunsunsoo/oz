package com.fire4bird.oz.socket.controller;

import com.fire4bird.oz.socket.dto.SocketRoomDto;
import com.fire4bird.oz.socket.service.SocketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/socket")
public class SocketController {

    private final SocketService socketService;

    @PostMapping
    public SocketRoomDto createRoom(@Valid @RequestBody SocketRoomDto createSocketDto, BindingResult bindingResult) {
        return socketService.createRoom(createSocketDto.getRtcSession(),createSocketDto.getTeamName());
    }

    @GetMapping
    public List<SocketRoomDto> findAllRoom() {
        return socketService.findAllRoom();
    }
}