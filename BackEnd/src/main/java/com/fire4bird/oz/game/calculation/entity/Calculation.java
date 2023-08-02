package com.fire4bird.oz.game.calculation.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "calculation_game")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Calculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameId;

    @ManyToOne
    @JoinColumn(name = "round_id", referencedColumnName = "roundId")
    private Round round;

    @Column(name = "number_board", length = 500, nullable = false)
    private String numberBoard;

    @Column(name = "answer", nullable = false)
    private int answer;

    @Column(name = "submit_answer")
    private int submitAnswer;

    @Column(name = "aid_select_num", length = 100)
    private String aidSelectNum;

    @Column(name = "actor_select_num", length = 100)
    private String actorSelectNum;

    @Column(name = "select_op", length = 15)
    private String selectOp;

    @Column(name = "turn", nullable = false)
    private int turn;
}

