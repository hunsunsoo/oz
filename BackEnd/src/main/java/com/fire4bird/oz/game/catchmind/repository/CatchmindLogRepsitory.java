package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.DrawingLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatchmindLogRepsitory extends JpaRepository<DrawingLog, Integer> {

}
