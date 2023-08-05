package com.fire4bird.oz.user.repository;

import com.fire4bird.oz.user.dto.MyPageDto;

public interface UserRepositoryCustom {

    MyPageDto findByUserMyPage(int userId);
}
