package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
/*
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    // potentially update the min attribute from @Size where needed
    @Id
    @Size(max = 100)
    private String username;

    @Column(nullable = false)
    @Size(max = 100)
    private String password;

    @Column(nullable = false)
    @Size(max = 100)
    private String email;

    @Column(nullable = false)
    @Size(max = 20)
    private String phoneNumber;

    // why is this needed for a user?
    @ManyToOne
    @JoinColumn(name = "zipCode",nullable = false)
    private Place place;

    public User() {}

    public User(String username, String password, String email, String phoneNumber, Place place) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.place = place;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

}
*/