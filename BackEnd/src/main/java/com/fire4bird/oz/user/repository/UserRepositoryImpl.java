package com.fire4bird.oz.user.repository;

import com.fire4bird.oz.user.dto.MyPageDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.user.entity.QUser.user;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public MyPageDto findByUserMyPage(int userId) {
        return jpaQueryFactory
                .select(Projections.fields(MyPageDto.class,
                        user.email,
                        user.name,
                        user.nickname))
                .from(user)
                .where(user.userId.eq(userId))
                .fetchOne();

    }
}
