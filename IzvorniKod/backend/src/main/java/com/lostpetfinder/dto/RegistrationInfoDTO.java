package com.lostpetfinder.dto;

public class RegistrationInfoDTO {

    private final String firstName;
    private final String lastName;
    private final String shelterName;
    private final String email;
    private final String phoneNumber;
    private final String username;
    private final String password;

    public RegistrationInfoDTO(
            String firstName,
            String lastName,
            String shelterName,
            String email,
            String phoneNumber,
            String username,
            String password)
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.shelterName = shelterName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getShelterName() {
        return shelterName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
