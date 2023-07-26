package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.entity.UserRound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRoundRepository extends JpaRepository<UserRound, Integer> {


}
