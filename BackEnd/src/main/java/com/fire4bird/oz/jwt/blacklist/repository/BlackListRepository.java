package com.fire4bird.oz.jwt.blacklist.repository;

import com.fire4bird.oz.jwt.blacklist.key.BlackList;
import org.springframework.data.repository.CrudRepository;

public interface BlackListRepository extends CrudRepository<BlackList,String> {
}
