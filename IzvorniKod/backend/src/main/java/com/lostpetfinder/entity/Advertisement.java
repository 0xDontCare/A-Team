package com.lostpetfinder.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "advertisements")
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "petId",nullable = false)
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "username",nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime disappearanceDateTime;

    @ManyToOne
    @JoinColumn(name = "coordinates")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "categoryId",nullable = false)
    private Category category;

    public Advertisement() {}

    public Advertisement(Pet pet, User user, LocalDateTime disappearanceDateTime, Location location, Category category) {
        this.pet = pet;
        this.user = user;
        this.disappearanceDateTime = disappearanceDateTime;
        this.location = location;
        this.category = category;
    }

    public int getId() {
        return id;
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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
