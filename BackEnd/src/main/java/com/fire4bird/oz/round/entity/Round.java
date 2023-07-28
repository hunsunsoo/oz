package com.fire4bird.oz.round.entity;

import com.fire4bird.oz.team.entity.Team;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Table(name = "round")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roundId;

    @JoinColumn(name = "team_id")
    @ManyToOne
    private Team team;

    //팀 별 회차
    private Integer teamRound;

}
