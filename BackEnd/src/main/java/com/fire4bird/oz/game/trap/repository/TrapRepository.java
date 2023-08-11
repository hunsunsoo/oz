package com.fire4bird.oz.game.trap.repository;

import com.fire4bird.oz.game.trap.entity.Trap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrapRepository extends JpaRepository<Trap, Integer> {

}
