package com.lostpetfinder.entity;

import com.lostpetfinder.dto.AddAdvertisementDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petId;

    // potentially add @NotNull annotations and update the min attribute from @Size where needed

    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    @Column(nullable = false)
    @Size(max = 100)
    private String species;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    @Size(max = 100)
    private String color;

    @Column(nullable = false)
    @Size(max = 1000)
    private String description;

    public Pet() {}

    // possibly change
    public Pet(AddAdvertisementDTO dto) {
        this.name = dto.getPetName();
        this.species = dto.getSpecies();
        this.age = dto.getAge();
        this.color = dto.getColor();
        this.description = dto.getPetDescription();
    }

    // possibly change
    public void updatePet(AddAdvertisementDTO dto) {
        this.name = dto.getPetName();
        this.species = dto.getSpecies();
        this.age = dto.getAge();
        this.color = dto.getColor();
        this.description = dto.getPetDescription();
    }

    public Long getPetId() {
        return petId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
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

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
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
