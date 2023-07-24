package com.fire4bird.oz.user.repository;

import com.fire4bird.oz.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {
}
