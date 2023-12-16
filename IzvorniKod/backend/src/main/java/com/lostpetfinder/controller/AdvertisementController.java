package com.lostpetfinder.controller;

import com.lostpetfinder.dto.AddAdvertisementDTO;
import com.lostpetfinder.dto.AdvertisementDetailsDTO;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.service.AdvertisementService;
import com.lostpetfinder.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;
    private final UserService userService;

    public AdvertisementController(AdvertisementService advertisementService, UserService userService) {
        this.advertisementService = advertisementService;
        this.userService = userService;
    }

    @GetMapping
    public List<AdvertisementSummaryDTO> getAllAdvertisements() {
        return advertisementService.getAllAdvertisements();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> addNewAdvertisement(@ModelAttribute AddAdvertisementDTO dto) {
        if (userService.getLoggedUser().getStatusCode() != ResponseEntity.ok().build().getStatusCode())
            return ResponseEntity.badRequest().body("You must be logged in to add an advertisement!");

        return advertisementService.addNewAdvertisement(dto);
    }

    @GetMapping("/{adId}")
    public AdvertisementDetailsDTO seeAdvertisementInfo(@PathVariable("adId") long adId) {
        return advertisementService.seeAdvertisementInfo(adId);
    }

    // change the data type of the return value to ResponseEntity
    @PutMapping(value ="/{adId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> changeAdvertisement(@PathVariable("adId") long adId,
                                                      @ModelAttribute AddAdvertisementDTO dto) {

        if (userService.getLoggedUser().getStatusCode() != ResponseEntity.ok().build().getStatusCode())
            return ResponseEntity.badRequest().body("You must be logged in to change an advertisement!");

        return advertisementService.changeAdvertisement(adId, dto);
    }

    // change the data type of the return value to ResponseEntity
    @DeleteMapping("/{adId}")
    public ResponseEntity<Object> deleteAdvertisement(@PathVariable("adId") Long adId) {
        if (userService.getLoggedUser().getStatusCode() != ResponseEntity.ok().build().getStatusCode())
            return ResponseEntity.badRequest().body("You must be logged in to delete an advertisement!");
        advertisementService.deleteAdvertisement(adId);
        return ResponseEntity.ok().body("Advertisement deleted successfully!");
    }

}
