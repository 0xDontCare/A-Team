package com.lostpetfinder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "communication")
public class Communication {

    @ManyToOne
    @JoinColumn(name = "petId", nullable = false)
    private Pet pet;

    @Id
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "username"),
            @JoinColumn(name = "sending_date_time")
    })
    private Message message;

    public Communication() {}

    public Communication(Pet pet, Message message) {
        this.pet = pet;
        this.message = message;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }
}
