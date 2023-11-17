package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Registered;
import com.lostpetfinder.entity.Shelter;
import com.lostpetfinder.entity.User;

public class HomeUserDTO {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String shelterName;

    public HomeUserDTO(User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        if (user instanceof Registered) {
            this.firstName = ((Registered)user).getName();
            this.lastName = ((Registered)user).getSurname();
        } else {
            this.shelterName = ((Shelter)user).getName();
        }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getShelterName() {
        return shelterName;
    }

    public void setShelterName(String shelterName) {
        this.shelterName = shelterName;
    }
}
