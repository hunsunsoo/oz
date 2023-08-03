package com.fire4bird.oz.jwt.blacklist.service;

import com.fire4bird.oz.jwt.blacklist.key.BlackList;
import com.fire4bird.oz.jwt.blacklist.mapper.BlackListMapper;
import com.fire4bird.oz.jwt.blacklist.repository.BlackListRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlackListService {
    private final BlackListRepository blackListRepository;
    private final BlackListMapper blackListMapper;

    // 로그아웃 시 블랙리스트 테이블에 엑세스토큰 추가
    public void registBlackList(String accessToken) {
        BlackList blackList = mapping(accessToken);
        blackListRepository.save(blackList);
        log.info("엑세스 토큰 블랙리스트에 추가");
    }

    //매핑
    public BlackList mapping(String accessToken) {
        return blackListMapper.stringToBlackList(accessToken);
    }
}
