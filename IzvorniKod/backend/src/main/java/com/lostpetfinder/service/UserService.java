package com.lostpetfinder.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.lostpetfinder.dao.RoleRepository;
import com.lostpetfinder.dao.UserRepository;
import com.lostpetfinder.dto.HomeUserDTO;
import com.lostpetfinder.dto.LoginInfoDTO;
import com.lostpetfinder.dto.RegistrationInfoDTO;
import com.lostpetfinder.entity.Role;
import com.lostpetfinder.entity.User;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.firewall.RequestRejectedException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.print.DocFlavor;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository<User> userRepository;

    public UserService(UserRepository<User> userRepository) {
        this.userRepository = userRepository;
    }

    User loggedUser = null;

    public ResponseEntity<String> getLoggedUser() {
        String output = "";
        if (loggedUser == null)
            return new ResponseEntity<>("No logged-in user!", HttpStatus.BAD_REQUEST);
        else {
            // need to find a better way to do this!!!
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                output = objectMapper.writeValueAsString(new HomeUserDTO(loggedUser));
            } catch (JsonProcessingException e) {
                return new ResponseEntity<>("Error converting object to JSON", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(output, HttpStatus.OK);
    }

    public void setLoggedUser(User loggedUser) {
        this.loggedUser = loggedUser;
    }

    public ResponseEntity<String> logout() {
        if (loggedUser == null)
            return new ResponseEntity<>("No logged-in user!", HttpStatus.BAD_REQUEST);
        else {
            setLoggedUser(null);
            return new ResponseEntity<>("User successfully logged out!", HttpStatus.OK);
        }

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository
                .findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " not found"));
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map((role) -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
        return new org.springframework.security.core.userdetails.User(username,user.getPassword(),authorities);
    }



}