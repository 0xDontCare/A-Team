package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Shelter;
import com.lostpetfinder.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Transactional
public interface ShelterRepository  extends UserRepository<Shelter> {
}
