package com.fire4bird.oz.team.entity;


import com.fire4bird.oz.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Table(name = "user_team")
@IdClass(UserTeamPK.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTeam {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")//, referencedColumnName = "userId")
    @MapsId("userId")
    User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "team_id")//, referencedColumnName = "teamId")
    @MapsId("teamId")
    Team team;
}