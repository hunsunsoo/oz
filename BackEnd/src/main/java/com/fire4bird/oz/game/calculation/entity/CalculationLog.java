package com.fire4bird.oz.game.calculation.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "calculation_game_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalculationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "round_id", referencedColumnName = "roundId")
    private Round round;

    @Column(name = "turn", nullable = false)
    private int turn;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "is_system", nullable = false)
    private Byte isSystem;

    @Column(name = "log_type", nullable = false)
    private int logType;

    @Column(name = "message", length = 300, nullable = false)
    private String message;

    @CreatedDate
    @Column(name = "log_time")
    private LocalDateTime logTime = LocalDateTime.now();
}