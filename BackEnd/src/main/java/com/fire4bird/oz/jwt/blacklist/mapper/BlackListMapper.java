package com.fire4bird.oz.jwt.blacklist.mapper;

import com.fire4bird.oz.jwt.blacklist.key.BlackList;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BlackListMapper {
    BlackList stringToBlackList(String accessValue);
}
