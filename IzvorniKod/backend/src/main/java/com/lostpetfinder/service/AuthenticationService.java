package com.lostpetfinder.service;

import com.lostpetfinder.dao.RoleRepository;
import com.lostpetfinder.dao.UserRepository;
import com.lostpetfinder.dto.LoginInfoDTO;
import com.lostpetfinder.dto.RegistrationInfoDTO;
import com.lostpetfinder.entity.Role;
import com.lostpetfinder.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthenticationService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    public AuthenticationService(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<String> login(LoginInfoDTO dto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return new ResponseEntity<>("Login successful!", HttpStatus.OK);
        } catch (AuthenticationException e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<?> register(RegistrationInfoDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            return new ResponseEntity<>("User with this username already exists!", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            return new ResponseEntity<>("User with this email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhoneNumber(dto.getPhoneNumber());

        Role roles;
        if (!dto.getShelterName().isBlank()) {
            roles = roleRepository.findByName("ROLE_SHELTER").get();
            // save the user in the 'registered' table using RegisteredRepository
        } else {
            roles = roleRepository.findByName("ROLE_REGISTERED").get();
            // save the user in the 'registered' table using ShelterRepository
        }
        user.setRoles(Collections.singleton(roles));

        userRepository.save(user);

        return new ResponseEntity<>("User is registered successfully!", HttpStatus.OK);

    }

}
