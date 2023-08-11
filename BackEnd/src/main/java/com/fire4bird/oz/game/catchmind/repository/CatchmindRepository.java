package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.Catchmind;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatchmindRepository extends JpaRepository<Catchmind, Integer>, CatchmindRepositoryCustom {

}
