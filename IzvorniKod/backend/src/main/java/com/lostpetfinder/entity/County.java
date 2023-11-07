package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "counties")
public class County {

    // not sure if counties even have their own assigned value, so I'm just generating it like this for now
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int countyId;

    // potentially update the min attribute from @Size
    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    public County() {}

    public County(String name) {
        this.name = name;
    }

    public int getCountyId() {
        return countyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
