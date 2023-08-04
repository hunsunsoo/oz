package com.fire4bird.oz.user.mapper;

import com.fire4bird.oz.user.dto.RegistUserDto;
import com.fire4bird.oz.user.dto.UpdateUserDto;
import com.fire4bird.oz.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User registUserToUser(RegistUserDto registUserDto);

    User updateUserDtoToUser(UpdateUserDto updateUserDto);
}
