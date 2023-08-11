package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.CatchmindData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatchmindDataRepository extends JpaRepository<CatchmindData, Integer> {
    CatchmindData findByDrawingId(int drawingId);
}
