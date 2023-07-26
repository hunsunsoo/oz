package com.fire4bird.oz.team.entity;


import com.fire4bird.oz.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_team")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTeam {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "team_id", referencedColumnName = "team_id")
    Team team;
}