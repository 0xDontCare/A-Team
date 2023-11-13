package com.lostpetfinder.service;

import com.lostpetfinder.dao.RegisteredRepository;
import com.lostpetfinder.dao.RoleRepository;
import com.lostpetfinder.dao.ShelterRepository;
import com.lostpetfinder.dao.UserRepository;
import com.lostpetfinder.dto.LoginInfoDTO;
import com.lostpetfinder.dto.RegistrationInfoDTO;
import com.lostpetfinder.entity.Registered;
import com.lostpetfinder.entity.Role;
import com.lostpetfinder.entity.Shelter;
import com.lostpetfinder.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthenticationService {

    @Autowired
    private UserService userService;
    private AuthenticationManager authenticationManager;
    private UserRepository<User> userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private RegisteredRepository registeredRepository;
    private ShelterRepository shelterRepository;

    public AuthenticationService(AuthenticationManager authenticationManager, UserRepository<User> userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, RegisteredRepository registeredRepository, ShelterRepository shelterRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.registeredRepository = registeredRepository;
        this.shelterRepository = shelterRepository;
    }

    public ResponseEntity<String> login(HttpServletRequest request, LoginInfoDTO dto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
            );
            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            // Create a new session and add the security context.
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

            //userService.setLoggedUser();

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
        if (dto.getShelterName() != null) {
            roles = roleRepository.findByName("ROLE_SHELTER").get();
            shelterRepository.save(new Shelter(user, dto.getShelterName()));
        } else {
            roles = roleRepository.findByName("ROLE_REGISTERED").get();
            registeredRepository.save(new Registered(user, dto.getFirstName(), dto.getLastName()));
        }
        user.setRoles(Collections.singleton(roles));

        //userRepository.save(user);

        return new ResponseEntity<>("User is registered successfully!", HttpStatus.OK);

    }

}
