package com.lostpetfinder.entity;

import com.lostpetfinder.entity.pkeys.CoordinatesPK;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Columns;

@Entity
@Table(name = "locations")
public class Location {

    // potentially update the min attribute from @Size

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(nullable = false, unique = true)
    private CoordinatesPK coordinates;

    @ManyToOne
    @JoinColumn(name = "zipCode",nullable = false)
    private Place place;

    public Location() {}

    public Location(CoordinatesPK coordinates, Place place) {
        this.coordinates = coordinates;
        this.place = place;
    }

    public Location(Double latitude, Double longitude, Place place) {
        this.coordinates = new CoordinatesPK(latitude, longitude);
        this.place = place;
    }

    public CoordinatesPK getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(CoordinatesPK coordinates) {
        this.coordinates = coordinates;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

}
