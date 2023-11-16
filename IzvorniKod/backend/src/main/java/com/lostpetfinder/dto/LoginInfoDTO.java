package com.lostpetfinder.dto;

public class LoginInfoDTO {

    private final String username;
    private final String password;

    public LoginInfoDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
