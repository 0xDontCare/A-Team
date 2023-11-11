package com.lostpetfinder.controller;

import com.lostpetfinder.dto.LoginInfoDTO;
import com.lostpetfinder.dto.RegistrationInfoDTO;
import com.lostpetfinder.service.AuthenticationService;
import com.lostpetfinder.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final AuthenticationService authenticationService;

    public UserController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginInfoDTO dto) {
        return authenticationService.login(dto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationInfoDTO dto) {
        return authenticationService.register(dto);
    }
}
