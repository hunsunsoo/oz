package com.fire4bird.oz.team.service;

import com.fire4bird.oz.team.dto.RegistTeamDto;
import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.team.repository.TeamRepository;
import com.fire4bird.oz.team.repository.UserTeamRepository;
import com.fire4bird.oz.team.repository.UserTeamRepositoryCustom;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {
    // 대기방에서 시작을 누르면 유저 정보가 넘어와서 팀 조합 확인을 함
    // 있는 팀이면 팀명 출력, 아니면 출력 X
    // 팀명 고르고 출발하면 중복 체크를 하고 가능하면 팀 저장
    // 팀이 저장될 때 사용자 유저 테이블이 같이 만들어져야 함

    private final TeamRepository teamRepository;
    private final UserTeamRepository userTeamRepository;
    private final UserTeamRepositoryCustom userTeamRepositoryCustom;
    private final UserRepository userRepository;

    // 팀 만들기
    @Transactional
    public Team teamSave(RegistTeamDto registTeamDto){
        Team team = findTeam(registTeamDto.getUsers());

//        if(team.getTeamId() == null){
//            team.setTeamName(registTeamDto.getTeamName());
//            Team realTeam = new Team();
//            return teamRepository.save(realTeam);
//        }else{
//            team.setTeamName(registTeamDto.getTeamName());
//            return teamRepository.save(team);
//        }
        if(team == null) team = new Team();
        team.setTeamName(registTeamDto.getTeamName());

        teamRepository.save(team);
        team = teamRepository.findByTeamName(team.getTeamName()).orElseThrow(() -> new RuntimeException());
        userTeamSave(registTeamDto, team);
        return team;
    }

    // 유저 팀 만들기
    @Transactional
    public void userTeamSave(RegistTeamDto registTeamDto, Team team){
        List<Integer> userList = registTeamDto.getUsers();
        for(Integer userId : userList){
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException());

            UserTeam userTeam = UserTeam.builder().user(user).team(team).build();
            userTeamRepository.save(userTeam);
        }
    }

    // 팀명 중복 체크
    public Team checkTeamName(RegistTeamDto registTeamDto) {
        if(teamRepository.existsByTeamName(registTeamDto.getTeamName())){
            Team team = findTeam(registTeamDto.getUsers());
            if(team.getTeamName() == registTeamDto.getTeamName()){
                return team;
            }else throw new RuntimeException("중복된 팀명입니다");
        }else{
            return teamSave(registTeamDto);
        }
    }

    public UserTeam makeUserTeam(UserTeam userTeam){
        return userTeamRepository.save(userTeam);
    }

    public Team findTeam(List<Integer> users){
        List<Integer> teamId = userTeamRepositoryCustom.checkTeam(users);
        if(teamId.size() == 0) return null;

        Optional<Team> team = teamRepository.findByTeamId(teamId.get(0));
        return team
                .orElseThrow(() -> new RuntimeException("findTeam 에러"));
    }


}
