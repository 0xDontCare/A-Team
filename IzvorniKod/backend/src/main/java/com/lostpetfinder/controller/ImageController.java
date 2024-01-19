package com.lostpetfinder.controller;

import com.lostpetfinder.dao.MessageImageRepository;
import com.lostpetfinder.entity.MessageImage;
import com.lostpetfinder.service.ImageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class ImageController {

    private final ImageService imageService;
    private final MessageImageRepository messageImageRepository;

    public ImageController(ImageService imageService, MessageImageRepository messageImageRepository) {
        this.imageService = imageService;
        this.messageImageRepository = messageImageRepository;
    }

    @GetMapping("/api/images/{imageName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) throws IOException {
        var image = imageService.getFile(imageName).orElseThrow();
        return ResponseEntity
                .ok()
                .contentType(MediaType.valueOf(image.getContentType()))
                .body(image.getData());
    }

    @GetMapping("/api/message/images/{imageName}")
    public ResponseEntity<byte[]> getMessageImage(@PathVariable String imageName) throws IOException {
        var image = messageImageRepository.findByLinkToImage(imageName).orElseThrow();
        return ResponseEntity
                .ok()
                .contentType(MediaType.valueOf(image.getContentType()))
                .body(image.getData());
    }
}