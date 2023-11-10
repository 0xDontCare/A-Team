package com.lostpetfinder.dto;

public class LoginInfoDTO {

    private String email;
    private String password;

    // potentially remove
    public LoginInfoDTO() {
    }

    public LoginInfoDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
