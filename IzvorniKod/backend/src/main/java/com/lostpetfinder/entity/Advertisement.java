package com.lostpetfinder.entity;

import com.lostpetfinder.dto.AdvertisementInfoDTO;
import com.lostpetfinder.dto.PetInfoDTO;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "advertisements")
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long advertisementId;

    @ManyToOne
    @JoinColumn(name = "petId",nullable = false)
    private Pet pet;


    /*
    @ManyToOne
    @JoinColumn(name = "username",nullable = false)
     */
    @Column(nullable = false, name = "username")
    private String user;

    @Column(nullable = false)
    private LocalDateTime disappearanceDateTime;

    /*
    @ManyToOne
    @JoinColumn(name = "coordinates")
     */
    @Column(nullable = false)
    private String location;

    /*
    @ManyToOne
    @JoinColumn(name = "categoryId",nullable = false)
     */
    @Column(nullable = false)
    private String category;

    public Advertisement() {}

    public Advertisement(Pet pet, PetInfoDTO dto) {
        this.pet = pet;
        this.user = "Luka"; // change when it's possible to get user info
        this.disappearanceDateTime = dto.getDisappearanceDateTime();
        this.location = dto.getDisappearanceLocation(); // change when it's possible to create the Location object properly
        this.category = "Traga se"; // change when the data for the 'categories' table is initialized
    }

    public Long getAdvertisementId() {
        return advertisementId;
    }

    public void setAdvertisementId(Long advertisementId) {
        this.advertisementId = advertisementId;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public LocalDateTime getDisappearanceDateTime() {
        return disappearanceDateTime;
    }

    public void setDisappearanceDateTime(LocalDateTime disappearanceDateTime) {
        this.disappearanceDateTime = disappearanceDateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
