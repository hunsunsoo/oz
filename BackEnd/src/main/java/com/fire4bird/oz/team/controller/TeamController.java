package com.fire4bird.oz.team.controller;


import com.fire4bird.oz.team.dto.CheckUserDto;
import com.fire4bird.oz.team.entity.Team;
import com.fire4bird.oz.team.mapper.TeamMapper;
import com.fire4bird.oz.team.service.TeamService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final TeamMapper teamMapper;

    // 4명의 조합이 있던 조합인지 확인
    @PostMapping("/checkteam")
    public ResponseEntity checkTeam(@RequestBody CheckUserDto checkUserDto, HttpServletResponse response) {
        Team findTeam = teamService.findTeam(checkUserDto.getUsers());

        response.setHeader("TeamResult", findTeam.getTeamName());

        return ResponseEntity.ok("팀 이름 찾음");
    }
}
