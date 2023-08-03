package com.fire4bird.oz.game.puzzle.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "puzzle_game")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Puzzle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameId;

    @JoinColumn(name = "roundId")
    @ManyToOne
    private Round round;

    //전체 상형문자
    @Column(length = 100, nullable = false)
    private String board;

    //정답
    @Column(length = 10, nullable = false)
    private String answer;

    //제출한 답
    @Column(length = 10)
    private String userAnswer;

    //정답 확인
    @Column
    private Integer isCheck;

    //도전횟수
    @Column(nullable = false)
    private Integer turn;
}
