package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
/*
@Entity
@Table(name = "locations")
public class Location {

    // potentially update the min attribute from @Size
    @Id
    @Size(max = 100)
    private String coordinates;

    @ManyToOne
    @JoinColumn(name = "zipCode",nullable = false)
    private Place place;

    public Location() {}

    public Location(String coordinates, Place place) {
        this.coordinates = coordinates;
        this.place = place;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

}
*/