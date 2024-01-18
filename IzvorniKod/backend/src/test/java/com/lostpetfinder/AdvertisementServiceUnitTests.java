package com.lostpetfinder;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.ImageRepository;
import com.lostpetfinder.dto.AddAdvertisementDTO;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.service.AdvertisementService;
import com.lostpetfinder.service.LocationService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdvertisementServiceUnitTests {

    @Mock
    private AdvertisementRepository advertisementRepository;

    @Mock
    private LocationService locationService;

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private AdvertisementService advertisementService;

    @Test
    public void testGetAllRequestedAdvertisements() {

        Advertisement advertisement1 = mock(Advertisement.class);
        lenient().when(advertisement1.getAdState()).thenReturn(AdStateEnum.ACTIVE);
        lenient().when(advertisement1.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_SRETNO_PRONAĐEN);

        User user = mock(Registered.class);
        user.setUsername("testUser");

        Pet pet = mock(Pet.class);
        pet.setAge(1);
        pet.setBreed("testBreed");
        pet.setColor("testColor");
        pet.setName("testName");
        pet.setSpecies("testSpecies");

        Image image = mock(Image.class);
        image.setLinkToImage("testLinkToImage");

        Advertisement advertisement2 = mock(Advertisement.class);
        advertisement2.setAdvertisementId(2L);

        lenient().when(advertisement2.getAdState()).thenReturn(AdStateEnum.ACTIVE);
        lenient().when(advertisement2.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA);
        lenient().when(advertisement2.getPet()).thenReturn(pet);
        lenient().when(advertisement2.getUser()).thenReturn(user);
        lenient().when(imageRepository.findAllByPetPetId(anyLong())).thenReturn(Arrays.asList(image));
        lenient().when(advertisementRepository.findAll()).thenReturn(Arrays.asList(
                advertisement1, advertisement2)
        );

        List<AdvertisementSummaryDTO> result = advertisementService.getAllAdvertisements(
                CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA
        );

        Assertions.assertEquals(1, result.size());
    }

    @Test
    public void testNoneAdsOfRequestedCategoryFound() {

        Advertisement mockAdvertisement1 = mock(Advertisement.class);
        lenient().when(mockAdvertisement1.getAdState()).thenReturn(AdStateEnum.DELETED);
        lenient().when(mockAdvertisement1.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA);

        Advertisement mockAdvertisement2 = mock(Advertisement.class);
        lenient().when(mockAdvertisement2.getAdState()).thenReturn(AdStateEnum.ACTIVE);
        lenient().when(mockAdvertisement2.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_SRETNO_PRONAĐEN);

        lenient().when(advertisementRepository.findAll()).thenReturn(Arrays.asList(
                mockAdvertisement1, mockAdvertisement2)
        );

        List<AdvertisementSummaryDTO> result = advertisementService.getAllAdvertisements(
                CategoryEnum.LJUBIMAC_JE_PRONAĐEN_U_NESRETNIM_OKOLNOSTIMA
        );

        Assertions.assertEquals(0, result.size());
    }

    @Test
    public void testRegisteredUserCannotSetInShelterCategory() {

        Long adId = 5L;

        AddAdvertisementDTO dto = new AddAdvertisementDTO();
        dto.setDisappearanceLocationLat(45.0);
        dto.setDisappearanceLocationLng(15.0);
        dto.setCategory(CategoryEnum.U_SKLONISTU);

        Advertisement changedAdvertisement = new Advertisement();
        changedAdvertisement.setUser(new Registered());

        lenient().when(advertisementRepository.existsByAdvertisementId(anyLong())).thenReturn(true);
        lenient().when(locationService.getLocation(anyDouble(), anyDouble())).thenReturn(new Location());
        lenient().when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(Optional.of(changedAdvertisement));

        ResponseEntity<Object> result = advertisementService.changeAdvertisement(adId, dto);

        Assertions.assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
    }

}