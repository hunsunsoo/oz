package com.fire4bird.oz.round.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.round.dto.Req.RoundStartReq;
import com.fire4bird.oz.round.dto.Res.RoundStartRes;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.round.entity.UserRoundId;
import com.fire4bird.oz.round.mapper.RoundMapper;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.round.repository.UserRoundRepository;
import com.fire4bird.oz.socket.dto.RedisSaveObject;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.repository.TeamRepository;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Slf4j
@RequiredArgsConstructor
public class RoundService {
    private final SocketRepository socketRepository;

    private final RoundRepository roundRepository;
    private final UserRepository userRepository;
    private final UserRoundRepository userRoundRepository;

    private final TeamRepository teamRepository;
    private final RoundMapper roundMapper;

    @Transactional
    public Round roundSave(RoundStartReq req) {
        //팀 확인
        Team findTeam = checkTeam(req.getTeamName());

        //가장 높은 회차 찾기
        Round findRound;
        Optional<Round> optionalRound = Optional.ofNullable(roundRepository.recentRound(findTeam));
        if (optionalRound.isPresent()) {
            Round round = optionalRound.get();
            findRound = roundMapper.setRound(findTeam, round.getTeamRound() + 1);
        } else {
            findRound = roundMapper.setRound(findTeam, 1);
        }
        return roundRepository.save(findRound);
    }

    @Transactional
    public int roleSave(RoundStartReq req, Round round) throws BusinessLogicException {
        //팀 확인
        log.info("rtcSession: "+req.getRtcSession());
        Team team = checkTeam(req.getTeamName());
        log.info("team: "+team);
        List<RoundStartReq.RoleDTO> roleList = req.getUserRole();
        log.info("roleList: "+roleList);
        log.info("roleList.size()1: "+roleList.size());
        if(roleList.size() != 4) return -1;
        log.info("roleList.size()2: "+roleList.size());
        for (RoundStartReq.RoleDTO roleDTO : roleList) {

            User user = userRepository.findById(roleDTO.getUserId()).orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
            log.info("user: "+user);
            //복합키
            UserRoundId userRoundId = UserRoundId.builder()
                    .roundId(round.getRoundId())
                    .teamId(team.getTeamId())
                    .userId(user.getUserId())
                    .build();

            //역할군 저장
//            UserRound userRound = roundMapper.setUserRound(userRoundId,user,team,round,roleDTO.getRole());
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
            log.info("userId: "+user.getUserId()+", save: "+save);
            socketRepository.enterUser(req.getRtcSession(),String.valueOf(user.getUserId()),save);
            userRoundRepository.save(userRound);
        }
        return 1;
    }

    public RoundStartRes responseData(RoundStartReq req, Round round) {
        //팀 확인
        Team team = checkTeam(req.getTeamName());

//        return roundMapper.setRoundRes(round.getRoundId(), team.getTeamId(), round.getTeamRound());
        return RoundStartRes.builder()
                .roundId(round.getRoundId())
                .teamId(team.getTeamId())
                .round(round.getTeamRound())
                .build();
    }

    public SocketMessage message(RoundStartReq req, RoundStartRes res) {
        return roundMapper.setSocketMessage("round/start",req.getRtcSession(),req.getUserId(),"모험 시작",res);
    }

    public Team checkTeam(String teamName){
        return teamRepository.findByTeamName(teamName).orElseThrow(() -> new BusinessLogicException(ExceptionCode.TEAM_NOT_FOUND));
    }

    public List<UserRound> findAllRoundByRoundId(Integer roundId){
        return userRoundRepository.findAllByRound_RoundId(roundId);
    }

    public Round findRound(int roundId) {
        Optional<Round> findRound = roundRepository.findById(roundId);

       return findRound.orElseThrow(
                () -> new BusinessLogicException(ExceptionCode.TEAM_NOT_FOUND));
    }
}
