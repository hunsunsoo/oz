package com.fire4bird.oz.record.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "record")
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recordId;

    @Column(name = "stage_num", nullable = false)
    private int stageNum;

    @Column(name = "challenge_turn")
    @ColumnDefault("0")
    private int challengeTurn;

    //해당 현재 row 종료시간 - 시작시간
    @Column(name = "stage_record")
    private LocalDateTime stageRecord;

    //클리어가 되었을 때 기록되는 누적기록
    //같은 데이터 모든 스테이지 기록을 더함
    //-> 클리어가 되었을 때 누적기록에 save
    @Column(name = "acc_record")
    private LocalDateTime accRecord;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "clear")
    private String clear;

    @ManyToOne
    @JoinColumn(name = "round_id")
    private Round round;
}
