package com.fire4bird.oz.game.puzzle.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "puzzle_game_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PuzzleLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameId;

    @JoinColumn(name = "roundId")
    @ManyToOne
    private Round round;

    //행위자의 일련 번호
    @Column(nullable = false)
    private Integer userId;

    //시스템 메시지:1, 유저:0
    @Column(nullable = false)
    private int isSystem;

    //로그 유형
    @Column(length = 10, nullable = false)
    private int logType;

    //로그 메시지
    @Column(length = 300, nullable = false)
    private String message;

    //로그 생성 시간
    @CreatedDate
    @Column(name = "join_date")
    private LocalDateTime logTime = LocalDateTime.now();

}
