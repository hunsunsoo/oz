package com.fire4bird.oz.round.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.round.dto.RoundDto;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.entity.UserRound;
import com.fire4bird.oz.round.repository.RoundRepository;
import com.fire4bird.oz.round.repository.UserRoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoundService {
    // 모험시작 -> 역할, 유저 아이디들 전달, 팀 전달.
    // 팀명을 받아 -> 회차 테이블에서 팀별 회차 확인 -> 없으면 insert 있으면 count++ update
    // 회차 테이블이 저장될때 사용자 회차 테이블 역할군 저장 -> 사용자 일련번호/ 회차 일련번호 / 팀 일련번호 / 역할군
    private final RoundRepository roundRepository;
    private final UserRoundRepository userRoundRepository;
    @Transactional
    public void roundSave(RoundDto roundDto){
        //팀 확인
        Optional<Round> findTeam = roundRepository.findByTeamNameNull(roundDto.getTeamName());

        //없으면 insert

        //있으면 update count++

        //한번에 저장 - 역할군
        roleSave(roundDto);

        Round round = new Round();
        roundRepository.save(round);
    }

    @Transactional
    public void roleSave(RoundDto roundDto){
        //역할군 저장
        UserRound userRound = new UserRound();
        userRound.setRole(roundDto.getRole());
        userRoundRepository.save(userRound);
    }

}
