package com.fire4bird.oz.round.service;

import com.fire4bird.oz.round.dto.RoundDto;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.entity.Team;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.round.entity.UserRoundId;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.round.repository.TeamRepository;
import com.fire4bird.oz.round.repository.UserRoundRepository;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class RoundService {
    // 모험시작 -> 역할, 유저 아이디들 전달, 팀 전달.
    // 팀명을 받아 -> 회차 테이블에서 팀별 회차 확인 -> 없으면 insert 있으면 count++ update
    // 회차 테이블이 저장될때 사용자 회차 테이블 역할군 저장 -> 사용자 일련번호/ 회차 일련번호 / 팀 일련번호 / 역할군

    private final TeamRepository teamRepository;
    private final RoundRepository roundRepository;
    private final UserRepository userRepository;
    private final UserRoundRepository userRoundRepository;

    @Transactional
    public void roundSave(RoundDto roundDto) {
        //팀 확인
        Team findTeam = teamRepository.findByTeamName(roundDto.getTeamName()).orElseThrow(() -> new RuntimeException());

        //회차 찾기
        Round findRound = roundRepository.findByTeam(findTeam).orElse(new Round());

        if (findRound.getRoundId() == null) {
            //없으면 insert
            Round round = Round.builder().team(findTeam).teamRound(1).build();
            roundRepository.save(round);
        } else {
            //있으면 update count++
            int teamRound = findRound.getTeamRound() + 1;
            findRound.setTeamRound(teamRound);
            roundRepository.save(findRound);
        }

        //한번에 저장
        //회차
        Round realfindRound = roundRepository.findByTeam(findTeam).orElse(new Round());
        roleSave(roundDto, findTeam, realfindRound);
    }

    @Transactional
    public void roleSave(RoundDto roundDto, Team team, Round round) {
        List<RoundDto.RoleDTO> roleList = roundDto.getUserRole();
        for (RoundDto.RoleDTO roleDTO : roleList) {
            User user = userRepository.findById(roleDTO.getUserId()).orElseThrow(() -> new RuntimeException());

            //복합키
            UserRoundId userRoundId = UserRoundId.builder().roundId(round.getRoundId()).teamId(team.getTeamId()).userId(user.getUserId()).build();

            //역할군 저장
            UserRound userRound = UserRound.builder().role(roleDTO.getRole()).user(user).round(round).team(team).userRoundId(userRoundId).build();
            userRoundRepository.save(userRound);
        }
    }

}
