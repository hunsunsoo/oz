package com.fire4bird.oz.team.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "team", indexes = @Index(name = "idx_team_name",columnList = "team_name"))
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teamId;

    @Column(name = "team_name", length = 30)
    private String teamName;

    @CreatedDate
    @Column(name = "composition_time")
    private LocalDateTime compositionTime = LocalDateTime.now();
}
