package com.lostpetfinder.controller;

import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.service.MessageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{advertisementId}")
    public List<MessageDTO> getChatMessages(@PathVariable Long advertisementId) {
        return messageService.getChatMessages(advertisementId);
    }

}
