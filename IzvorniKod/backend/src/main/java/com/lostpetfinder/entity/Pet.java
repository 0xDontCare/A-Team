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

    public String getName() {
        return name;
    }

    public String getSpecies() {
        return species;
    }

    public int getAge() {
        return age;
    }

    public String getColor() {
        return color;
    }

    public String getDescription() {
        return description;
    }

}
