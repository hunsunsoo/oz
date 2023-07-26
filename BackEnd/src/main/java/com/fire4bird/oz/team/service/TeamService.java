package com.fire4bird.oz.team.service;

import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.repository.TeamRepository;
import com.fire4bird.oz.team.repository.UserTeamRepositoryCustom;
import com.fire4bird.oz.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserTeamRepository userTeamRepository;
    private final UserTeamRepositoryCustom userTeamRepositoryCustom;

    // 팀 만들기
    public Team makeTeam(String teamName){
        Team team = new Team();
        team.setTeamName(teamName);
        return teamRepository.save(team);
    }

    // 팀명 중복 체크
    public void checkTeamName(String teamName) {
        if(teamRepository.existsByTeamName(teamName)){
          throw new RuntimeException("중복된 팀명입니다");
        }else{
            makeTeam(teamName);
        }
    }

    public UserTeam makeUserTeam(UserTeam userTeam){
        return userTeamRepository.save(userTeam);
    }

    public String findTeam(List<Integer> users){
        List<Integer> teamId = userTeamRepositoryCustom.findTeamIdByUserId(users);
        if(team.size() == 0) return null;

        Team team = teamRepository.findByTeamId(teamId.get(0));
        return team.getTeamName();
    }


}
