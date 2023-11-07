package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "places")
public class Place {

    @Id
    private int zipCode;

    // potentially update the min attribute from @Size
    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "id",nullable = false)
    private County county;

    public Place() {}

    public Place(int zipCode, String name, County county) {
        this.zipCode = zipCode;
        this.name = name;
        this.county = county;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public County getCounty() {
        return county;
    }

    public void setCounty(County county) {
        this.county = county;
    }
}
