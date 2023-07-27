package com.fire4bird.oz.team.controller;


import com.fire4bird.oz.CMRespDto;
import com.fire4bird.oz.team.dto.CheckUserDto;
import com.fire4bird.oz.team.dto.RegistTeamDto;
import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.mapper.TeamMapper;
import com.fire4bird.oz.team.service.TeamService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    // 4명의 조합이 있던 조합인지 확인
    @PostMapping("/checkteam")
    public ResponseEntity checkTeam(@RequestBody CheckUserDto checkUserDto) {
        Team findTeam = teamService.findTeam(checkUserDto.getUsers());

        return new ResponseEntity<>(new CMRespDto<>(1, "유저 팀 확인 완료", findTeam), HttpStatus.OK);
    }


    @PostMapping("/registteam")
    public ResponseEntity registTeam(@RequestBody RegistTeamDto registTeamDto){
        Team startTeam = teamService.checkTeamName(registTeamDto);

        return new ResponseEntity<>(new CMRespDto<>(1, "팀 구성 완료", startTeam), HttpStatus.OK);
    }
}
