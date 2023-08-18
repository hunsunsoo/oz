package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.DrawingData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatchmindDataRepository extends JpaRepository<DrawingData, Integer> {
    DrawingData findByDrawingId(int drawingId);
}
