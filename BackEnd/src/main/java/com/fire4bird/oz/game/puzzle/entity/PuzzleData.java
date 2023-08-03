package com.fire4bird.oz.game.puzzle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "puzzle_game_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PuzzleData {

    @Id
    private Integer puzzleField;

    @Id
    private Integer fieldSeq;

    @Column(length = 100, nullable = false)
    private String puzzleImage;

}
