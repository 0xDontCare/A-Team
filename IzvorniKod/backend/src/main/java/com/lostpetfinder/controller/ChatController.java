package com.lostpetfinder.controller;

import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.lostpetfinder.service.MessageService;

@Controller
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    // IntelliJ says this is an error, but just ignore it and run the app
    public ChatController(SimpMessagingTemplate simpMessagingTemplate, MessageService messageService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/new_message")
    public MessageDTO forwardNewMessage(@Payload MessageDTO messageDTO) {
        messageService.saveMessage(messageDTO);
        String destination = "/chatroom" + messageDTO.getAdvertisementId();
        simpMessagingTemplate.convertAndSend(destination, messageDTO);
        return messageDTO;
    }

}