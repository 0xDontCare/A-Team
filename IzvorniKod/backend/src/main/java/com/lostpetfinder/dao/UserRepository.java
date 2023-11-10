package com.lostpetfinder.dao;


import com.lostpetfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // need to rethink how to implement Unregistered and Registered Users
    // issue with User unregisteredUser = new Registered();

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}
