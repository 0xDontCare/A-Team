package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pets")
public class Pet {

    public Pet() {}

    public Pet(String name, String species, int age, String color, String description) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.age = age;
        this.color = color;
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // potentially add @NotNull annotations and update the min attribute from @Size where needed

    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    @Column(nullable = false)
    @Size(max = 100)
    private String species;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false)
    @Size(max = 100)
    private String color;

    @Column(nullable = false)
    @Size(max = 1000)
    private String description;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
