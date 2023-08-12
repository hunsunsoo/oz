package com.fire4bird.oz.game.catchmind.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "catchmind_game_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrawingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int gameId;

    @JoinColumn(name = "roundId")
    @ManyToOne
    private Round round;

    // 행위자가 유저인경우
    private int userId;

    // 시스템 메시지:1, 유저:0
    private int isSystem;

    // 로그 유형
    @Column(length = 10)
    private int logType;

    // 로그 메시지
    @Column(length = 300)
    private String message;

    // 로그 생성 시간
    @CreatedDate
    @Column(name = "join_date")
    private LocalDateTime logTime = LocalDateTime.now();

}
