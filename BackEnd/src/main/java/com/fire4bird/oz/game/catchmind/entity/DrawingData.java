package com.fire4bird.oz.game.catchmind.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "catchmind_game_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrawingData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int drawingId;

    // 제시어
    @Column(length = 10)
    private String answer;
}
