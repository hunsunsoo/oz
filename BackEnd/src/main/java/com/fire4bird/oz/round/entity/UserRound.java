package com.fire4bird.oz.round.entity;

import com.fire4bird.oz.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_round")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRound {

    @JoinColumn(name = "user_id")
    @ManyToOne
    private User user;

//    @JoinColumn(name = "team_id")
//    @ManyToOne
//    private Team team_id;

    @JoinColumn(name = "round_id")
    @ManyToOne
    private Round round;

    //회차 당 역할
    private int role;

}
