package com.lostpetfinder.controller;

import com.lostpetfinder.dto.PetInfoDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pets")
public class PetController {

    /*
    returns all visible advertisements
    of missing pets - change the return data type and implement the method
     */
    @GetMapping
    public void getAllAdvertisements() {}

    /*
    adds an advertisement for the missing
    pet - change the return data type and implement the method
     */
    @PostMapping
    public void addNewAdvertisement(@RequestBody(required = false) PetInfoDTO dto) {}

    /*
    returns info about the selected pet - change the return
    data type and implement the method
     */
    @GetMapping("/{petID}")
    public void seeAdvertisementInfo() {}

    /*
    edits a missing pet advertisement - change the return data type
    and implement the method
     */
    @PutMapping("/{petID}")
    public void changeAdvertisement() {}

    /*
    deletes a missing pet advertisement - change the return data type
    and implement the method
     */
    @DeleteMapping("/{petID}")
    public void deleteAdvertisement() {}

}
