package com.fire4bird.oz.game.catchmind.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "catchmind_game")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Catchmind {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameId;

    @JoinColumn(name = "round_id")
    @ManyToOne
    private Round round;

    @JoinColumn(name = "drawing_id")
    @ManyToOne
    private CatchmindData catchmindData;

    // 현재 그림
    @Column(length = 200, nullable = false)
    private String drawingPicture;

    // 순서

    // 정답
    @Column(length = 30, nullable = false)
    private String answer;

    // 제출한 정답
    @Column(length = 30, nullable = false)
    private String userAnswer;

    // 정답 확인
    @Column
    private Integer isCheck;

    // 도전횟수
    @Column(nullable = false)
    private Integer turn;
}
