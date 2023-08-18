package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatchmindRepository extends JpaRepository<Drawing, Integer>, CatchmindRepositoryCustom {

}
