package com.lostpetfinder.entity;

import com.lostpetfinder.dto.AdvertisementDetailsDTO;
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


    @ManyToOne
    @JoinColumn(name = "username",nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime disappearanceDateTime;

    /*
    @ManyToOne
    @JoinColumn(name = "coordinates")
     */
    @Column(nullable = false)
    private String location;

    @ManyToOne
    @JoinColumn(name = "categoryId",nullable = false)
    private Category category;

    public Advertisement() {}

    // change when possible
    public Advertisement(Pet pet, User user, Category category, LocalDateTime disappearanceDateTime, String disappearanceLocation) {
        this.pet = pet;
        this.user = user;
        this.disappearanceDateTime = disappearanceDateTime;
        this.category = category;
        this.location = disappearanceLocation;
    }

    public void updateAdvertisement(AdvertisementDetailsDTO dto) {
        pet.updatePet(dto);
        this.disappearanceDateTime = dto.getDisappearanceDateTime();
        this.location = dto.getDisappearanceLocation();
        // this.category = dto.getCategory;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

}
