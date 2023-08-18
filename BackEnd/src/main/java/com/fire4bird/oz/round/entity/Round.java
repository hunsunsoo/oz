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
    private int roundId;

    @JoinColumn(name = "team_id")
    @ManyToOne
    private Team team;

    private int teamRound;

}
