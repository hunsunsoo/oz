package com.fire4bird.oz.game.puzzle.repository;


import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleRepository extends JpaRepository<Puzzle, Integer>, PuzzleRepositoryCustom {


}
