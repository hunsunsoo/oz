package com.fire4bird.oz.game.catchmind.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "catchmind_game")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Drawing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int gameId;

    @JoinColumn(name = "round_id")
    @ManyToOne
    private Round round;

    @JoinColumn(name = "drawing_id")
    @ManyToOne
    private DrawingData catchmindData;

    // 현재 그림
    @Column(length = 200, nullable = false)
    private String drawingPicture;

    // 순서 2->3->4->1

    // 정답
    @Column(length = 30, nullable = false)
    private String answer;

    // 제출한 정답
    @Column(length = 30, nullable = false)
    private String userAnswer;

    // 정답 확인
    @Column
    private int isCheck;

    // 도전횟수
    @Column(nullable = false)
    @ColumnDefault("1")
    private int turn;
}
