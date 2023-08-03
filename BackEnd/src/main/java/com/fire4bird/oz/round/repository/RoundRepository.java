package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;

@Primary
public interface RoundRepository extends JpaRepository<Round, Integer>, RoundRepositoryCustom {


}
