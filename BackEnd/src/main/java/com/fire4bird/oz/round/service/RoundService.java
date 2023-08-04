package com.fire4bird.oz.round.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.round.dto.Req.RoundStartReq;
import com.fire4bird.oz.round.dto.Res.RoundStartRes;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.round.entity.UserRoundId;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.round.repository.UserRoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.repository.TeamRepository;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class RoundService {

    private final TeamRepository teamRepository;
    private final RoundRepository roundRepository;
    private final UserRepository userRepository;
    private final UserRoundRepository userRoundRepository;
    private final SocketRepository socketRepository;

    @Transactional
    public RoundStartRes roundSave(RoundStartReq roundDto) {
        //팀 확인
        Team findTeam = teamRepository.findByTeamName(roundDto.getTeamName()).orElseThrow(() -> new BusinessLogicException(ExceptionCode.TEAM_NOT_FOUND));

        //가장 높은 회차 찾기
        Round findRound = roundRepository.recentRound(findTeam);
        if (findRound == null) {
            //없으면 insert
            findRound = Round.builder()
                    .team(findTeam)
                    .teamRound(1)
                    .build();
        } else {
            //있으면 insert count++
            int teamRound = findRound.getTeamRound() + 1;
            findRound = Round.builder()
                    .team(findTeam)
                    .teamRound(teamRound)
                    .build();
        }
        roundRepository.save(findRound);

        RoundStartRes roundRes = RoundStartRes.builder()
                .roundId(findRound.getRoundId())
                .teamId(findTeam.getTeamId())
                .round(findRound.getTeamRound())
                .build();

        //한번에 저장
        //역할 저장
        roleSave(roundDto, findTeam, findRound);
        return roundRes;
    }

    @Transactional
    public void roleSave(RoundStartReq roundDto, Team team, Round round) {
        List<RoundStartReq.RoleDTO> roleList = roundDto.getUserRole();
        for (RoundStartReq.RoleDTO roleDTO : roleList) {
            User user = userRepository.findById(roleDTO.getUserId()).orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

            //복합키
            UserRoundId userRoundId = UserRoundId.builder()
                    .roundId(round.getRoundId())
                    .teamId(team.getTeamId())
                    .userId(user.getUserId())
                    .build();

            //역할군 저장
            UserRound userRound = UserRound.builder()
                    .role(roleDTO.getRole())
                    .user(user)
                    .round(round)
                    .team(team)
                    .userRoundId(userRoundId)
                    .build();

            //소켓 관리방 유저 등록
            RedisSaveObject save = RedisSaveObject.builder()
                    .roundId(round.getRoundId())
                    .round(round.getTeamRound())
                    .teamId(team.getTeamId())
                    .role(roleDTO.getRole())
                    .userId(user.getUserId())
                    .build();

            socketRepository.enterUser(roundDto.getRtcSession(),String.valueOf(user.getUserId()),save);
            userRoundRepository.save(userRound);
        }
    }

    public List<UserRound> findAllRoundByRoundId(Integer roundId){
        return userRoundRepository.findAllByRound_RoundId(roundId);
    }

}
