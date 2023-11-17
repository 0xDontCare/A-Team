package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Registered;
import com.lostpetfinder.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Transactional
public interface RegisteredRepository extends UserRepository<Registered> {
}
