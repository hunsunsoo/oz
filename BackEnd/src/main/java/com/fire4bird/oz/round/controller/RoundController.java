package com.fire4bird.oz.round.controller;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.round.dto.RoundDto;
import com.fire4bird.oz.round.service.RoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/round")
public class RoundController {

    private final RoundService roundService;

    @PostMapping("/start")
    public ResponseEntity roundStart(@Valid @RequestBody RoundDto roundDto, BindingResult bindingResult ) {
        //방장이 start 했는지 판별
        for (RoundDto.RoleDTO roleList : roundDto.getUserRole()){
            if(!roleList.getUserId().equals(roundDto.getUserId()))
                continue;

            if(roleList.getRole()!=1)
                throw new BusinessLogicException(ExceptionCode.FORBIDDEN_OWNER);
        }

        roundService.roundSave(roundDto);
        return new ResponseEntity<>(new CMRespDto<>(1,"모험 시작", null), HttpStatus.OK);
    }

}
