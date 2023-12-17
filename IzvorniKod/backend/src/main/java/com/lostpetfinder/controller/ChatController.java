package com.lostpetfinder.controller;

import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    // IntelliJ says this is an error, but just ignore it and run the app
    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // implement this method properly
    @MessageMapping("/new_message")
    public Message forwardNewMessage(@Payload MessageDTO messageDTO) {
        /*
        String destination = "/chatroom" + message.getAdvertisement().getAdvertisementId();
        simpMessagingTemplate.convertAndSend(destination, message);
        return message;
        */
        return null;
    }

}