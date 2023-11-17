package com.lostpetfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "registered")
@PrimaryKeyJoinColumn(name = "username")
public class Registered extends User {

    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    @Column(nullable = false)
    @Size(max = 100)
    private String surname;

    public Registered() {}

    // temp constructor
    public Registered(User superUser, String name, String surname) {
        super(superUser.getUsername(), superUser.getPassword(), superUser.getEmail(), superUser.getPhoneNumber());
        this.name = name;
        this.surname = surname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
}
