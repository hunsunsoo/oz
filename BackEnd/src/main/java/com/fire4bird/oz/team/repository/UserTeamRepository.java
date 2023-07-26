package com.fire4bird.oz.team.repository;

import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.team.entity.UserTeamPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTeamRepository extends JpaRepository<UserTeam, UserTeamPK>, UserTeamRepositoryCustom {

}
