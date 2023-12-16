package com.lostpetfinder.entity;

import com.lostpetfinder.dto.AddAdvertisementDTO;
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

    @Enumerated(EnumType.ORDINAL)
    private CategoryEnum category;

    @Enumerated(EnumType.STRING)
    private AdStateEnum adState = AdStateEnum.ACTIVE;

    public Advertisement() {}

    public Advertisement(Pet pet, User user, CategoryEnum category, LocalDateTime disappearanceDateTime, String disappearanceLocation) {
        this.pet = pet;
        this.user = user;
        this.disappearanceDateTime = disappearanceDateTime;
        this.category = category;
        this.location = disappearanceLocation;
    }

    public void updateAdvertisement(AddAdvertisementDTO dto) {
        pet.updatePet(dto);
        this.disappearanceDateTime = dto.getDisappearanceDateTime();
        // need to implement this in frontend
        this.location = dto.getDisappearanceLocation();
        this.category = dto.getCategory() == null ? CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA : dto.getCategory();
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

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }

    public AdStateEnum getAdState() {
        return adState;
    }

    public void setAdState(AdStateEnum adState) {
        this.adState = adState;
    }
}
