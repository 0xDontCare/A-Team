package com.lostpetfinder.controller;

import com.lostpetfinder.dto.HomeUserDTO;
import com.lostpetfinder.dto.LoginInfoDTO;
import com.lostpetfinder.dto.RegistrationInfoDTO;
import com.lostpetfinder.service.AuthenticationService;
import com.lostpetfinder.service.UserService;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/logged")
    public ResponseEntity<String> getLoggedUser() {return userService.getLoggedUser();}

    /**
     * This method logs the current user out.
     * If no user is logged when called it returns with 400 Bad Request with message "No logged-in user!".
     * Otherwise, it returns message "User successfully logged out!"
     * @return ResponseEntity<String>
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {return userService.logout();}

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginInfoDTO dto) {
        return authenticationService.login(dto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationInfoDTO dto) {
        return authenticationService.register(dto);
    }
}
