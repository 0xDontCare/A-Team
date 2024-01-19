package com.lostpetfinder.controller;

import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.dto.MessageInputDTO;
import com.lostpetfinder.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages/")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{advertisementId}")
    public List<MessageDTO> getChatMessages(@PathVariable Long advertisementId) {
        return messageService.getChatMessages(advertisementId);
    }

    @PostMapping()
    public void saveMessage(@RequestBody MessageInputDTO dto) {
        messageService.saveMessage(dto);
    }

}
