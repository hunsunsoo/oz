package com.fire4bird.oz.round.entity;

import com.fire4bird.oz.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_round")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRound {

    @EmbeddedId
    private UserRoundId userRoundId;

    @JoinColumn(name = "user_id")
    @ManyToOne
    @MapsId("userId")
    private User user;

    @JoinColumn(name = "team_id")
    @ManyToOne
    @MapsId("teamId")
    private Team team;

    @JoinColumn(name = "round_id")
    @ManyToOne
    @MapsId("roundId")
    private Round round;

    //회차 당 역할
    private int role;

}
