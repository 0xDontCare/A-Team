package com.lostpetfinder.entity.pkeys;

import com.lostpetfinder.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.io.Serializable;
import java.time.LocalDateTime;

@Embeddable
public class MessagePK implements Serializable {

    @ManyToOne(optional = false)
    @JoinColumn(name = "username", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime sendingDateTime;

    public MessagePK() {}

    public MessagePK(User user, LocalDateTime sendingDateTime) {
        this.user = user;
        this.sendingDateTime = sendingDateTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getSendingDateTime() {
        return sendingDateTime;
    }

    public void setSendingDateTime(LocalDateTime sendingDateTime) {
        this.sendingDateTime = sendingDateTime;
    }
}
