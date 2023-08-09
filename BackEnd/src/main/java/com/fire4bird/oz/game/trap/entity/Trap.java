package com.fire4bird.oz.game.trap.entity;

import com.fire4bird.oz.round.entity.Round;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trap_game")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer gameId;

    @ManyToOne
    @JoinColumn(name = "roundId")
    private Round round;

    // 함정맵
    @Column(length = 300, nullable = false)
    private String map;

    // 출발지, 목적지, 열쇠 위치
    @Column(length = 10, nullable = false)
    private String startLocation;

    @Column(length = 10, nullable = false)
    private String destinationLocation;

    @Column(length = 10, nullable = false)
    private String keyLocation;

    // 출발 방향 (U상 D하 L좌 R우) String
    @Column(length = 10, nullable = false)
    private String startDirection;

    // 함정위치관리
    @Column(length = 100, nullable = true)
    private String allTrapLocation;

    @Column(length = 50, nullable = true)
    private String holeLocation;

    @Column(length = 50, nullable = true)
    private String bombLocation;

    // 현재 위치, 방향
    @Column(length = 10, nullable = false)
    private String currentLocation;

    @Column(length = 10, nullable = false)
    private String currentDirection;

    @Column(nullable = false)
    private byte hasKey;

    // 몇번째턴
    @Column(nullable = false)
    private Integer turn;


}
