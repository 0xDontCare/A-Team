package com.lostpetfinder.controller;

import jakarta.annotation.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;

@RestController
public class StaticController {
    @GetMapping("/api/images/{imageName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) throws IOException {
        ClassPathResource resource = new ClassPathResource("static/" + imageName);
        byte[] imageBytes = Files.readAllBytes(resource.getFile().toPath());
        return ResponseEntity
                .ok()
                .body(imageBytes);
    }
}