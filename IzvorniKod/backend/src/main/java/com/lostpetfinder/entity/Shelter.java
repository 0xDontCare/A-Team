package com.lostpetfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "shelters")
@PrimaryKeyJoinColumn(name = "username")
public class Shelter extends User{

    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    public Shelter() {}

    // temp constructor
    public Shelter(User superUser, String name) {
        super(superUser.getUsername(), superUser.getPassword(), superUser.getEmail(), superUser.getPhoneNumber());
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
