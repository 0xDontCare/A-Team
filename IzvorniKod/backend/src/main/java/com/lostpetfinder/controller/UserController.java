package com.lostpetfinder.controller;

import com.lostpetfinder.dto.HomeUserDTO;
import com.lostpetfinder.dto.LoginInfoDTO;
import com.lostpetfinder.dto.RegistrationInfoDTO;
import com.lostpetfinder.service.AuthenticationService;
import com.lostpetfinder.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

    public UserController(UserService userService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    /**
     * This method returns the currently logged user.
     * If no user is logged when called it returns with 400 Bad Request with message "No logged-in user!".
     * @return HomeUserDTO
     */
    @GetMapping("/logged")
    public ResponseEntity<Object> getLoggedUser() {return userService.getLoggedUser();}

    @PostMapping("/login")
    public ResponseEntity<String> login(HttpServletRequest req, @RequestBody LoginInfoDTO dto) {
        return authenticationService.login(req, dto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationInfoDTO dto) {
        return authenticationService.register(dto);
    }
}
