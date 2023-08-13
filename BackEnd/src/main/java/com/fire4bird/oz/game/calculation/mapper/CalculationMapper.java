package com.fire4bird.oz.game.calculation.mapper;

import com.fire4bird.oz.socket.dto.SocketMessage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CalculationMapper {

    SocketMessage sendSocketMessage(String type, String rtcSession, String message, Object data);
}
