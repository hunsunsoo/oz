package com.fire4bird.oz.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(name = "email", length = 50, nullable = false)
    private String email;

    @Column(name = "password", length = 70, nullable = false)
    private String password;

    @Column(name = "nickname", length = 20, nullable = false)
    private String nickname;

    @Column(name = "name", length = 10, nullable = false)
    private String name;

    @Column(name = "clear_cnt")
    @ColumnDefault("0")
    private int clearCnt;

    @Column(name = "provider", length = 20)
    private String provider;

    @CreatedDate
    @Column(name = "join_date")
    private LocalDateTime joinDate = LocalDateTime.now();

    @Column(name = "out_date")
    private LocalDateTime outDate;
}
