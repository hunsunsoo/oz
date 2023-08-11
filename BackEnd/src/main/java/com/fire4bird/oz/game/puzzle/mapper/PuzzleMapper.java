package com.fire4bird.oz.game.puzzle.mapper;

import com.fire4bird.oz.game.puzzle.dto.SendData;
import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.game.puzzle.entity.PuzzleLog;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.socket.dto.SocketMessage;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface PuzzleMapper {

    SendData sendData(int location, String puzzle);

    PuzzleLog sendPuzzleLog(Integer userId, int isSystem, int logType, String message, LocalDateTime logTime, Round round);

    Puzzle sendPuzzle(Round round, String board, String answer, int turn);

    SocketMessage sendSocketMessage(String type, String rtcSession, String message, Object data);
}
