package com.fire4bird.oz.round.mapper;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.team.entity.Team;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoundMapper {

//    UserRoundId setComplexKey(int userId, int teamId, int roundId);

//    RedisSaveObject setRedisSave(int roundId, int teamId, int round, int role, int userId);

//    RoundStartRes setRoundRes(int roundId, int teamId, int round);

//    UserRound setUserRound(UserRoundId userRoundId, User user, Team team, Round round, int role);

    Round setRound(Team team, int teamRound);

    SocketMessage setSocketMessage(String type, String rtcSession, Integer userId, String message, Object data);
}
