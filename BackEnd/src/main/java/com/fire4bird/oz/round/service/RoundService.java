package com.fire4bird.oz.round.service;

import com.fire4bird.oz.round.dto.RoundDto;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.round.entity.UserRoundId;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.round.repository.UserRoundRepository;
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

    @Transactional
    public void roundSave(RoundDto roundDto) {
        //팀 확인
        Team findTeam = teamRepository.findByTeamName(roundDto.getTeamName()).orElseThrow(() -> new RuntimeException());

        //가장 높은 회차 찾기
        Round findRound = roundRepository.recentRound(findTeam);
        if (findRound == null) {
            //없으면 insert
            findRound = Round.builder().team(findTeam).teamRound(1).build();
        } else {
            //있으면 insert count++
            int teamRound = findRound.getTeamRound() + 1;
            findRound = Round.builder().team(findTeam).teamRound(teamRound).build();
        }
        roundRepository.save(findRound);

        //한번에 저장
        //회차
        roleSave(roundDto, findTeam, findRound);
    }

    @Transactional
    public void roleSave(RoundDto roundDto, Team team, Round round) {
        List<RoundDto.RoleDTO> roleList = roundDto.getUserRole();
        for (RoundDto.RoleDTO roleDTO : roleList) {
            User user = userRepository.findById(roleDTO.getUserId()).orElseThrow(() -> new RuntimeException());

            //복합키
            UserRoundId userRoundId = UserRoundId.builder().roundId(round.getRoundId()).teamId(team.getTeamId()).userId(user.getUserId()).build();

            //역할군 저장 //여기가 문제야..
            UserRound userRound = UserRound.builder().role(roleDTO.getRole()).user(user).round(round).team(team).userRoundId(userRoundId).build();
            userRoundRepository.save(userRound);
        }
    }

}
