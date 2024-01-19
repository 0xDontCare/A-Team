package com.lostpetfinder;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.ImageRepository;
import com.lostpetfinder.dto.AddAdvertisementDTO;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.service.AdvertisementService;
import com.lostpetfinder.service.LocationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdvertisementServiceUnitTests {

    @Mock
    private AdvertisementRepository advertisementRepository;

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private AdvertisementService advertisementService;

    @Test
    @DisplayName("All requested advertisements are fetched")
    public void testGetAllRequestedAdvertisements() {

        Advertisement advertisement1 = mock(Advertisement.class);
        when(advertisement1.getAdState()).thenReturn(AdStateEnum.ACTIVE);
        when(advertisement1.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_SRETNO_PRONAĐEN);

        Advertisement advertisement2 = mock(Advertisement.class);
        when(advertisement2.getAdState()).thenReturn(AdStateEnum.ACTIVE);
        when(advertisement2.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA);
        when(advertisement2.getPet()).thenReturn(mock(Pet.class));
        when(advertisement2.getUser()).thenReturn(mock(Registered.class));
        when(imageRepository.findAllByPetPetId(anyLong())).thenReturn(Arrays.asList(mock(Image.class)));

        when(advertisementRepository.findAll()).thenReturn(Arrays.asList(
                advertisement1, advertisement2)
        );

        List<AdvertisementSummaryDTO> result = advertisementService.getAllAdvertisements(
                CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA
        );

        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Having zero advertisements of requested category is handled correctly")
    public void testNoneAdsOfRequestedCategoryFound() {

        Advertisement advertisement1 = mock(Advertisement.class);
        when(advertisement1.getAdState()).thenReturn(AdStateEnum.DELETED);

        Advertisement advertisement2 = mock(Advertisement.class);
        when(advertisement2.getAdState()).thenReturn(AdStateEnum.ACTIVE);
        when(advertisement2.getCategory()).thenReturn(CategoryEnum.LJUBIMAC_JE_SRETNO_PRONAĐEN);

        when(advertisementRepository.findAll()).thenReturn(Arrays.asList(
                advertisement1, advertisement2)
        );

        List<AdvertisementSummaryDTO> result = advertisementService.getAllAdvertisements(
                CategoryEnum.LJUBIMAC_JE_PRONAĐEN_U_NESRETNIM_OKOLNOSTIMA
        );

        assertEquals(0, result.size());
    }

    @Test
    @DisplayName("Non-shelter user cannot set U_SKLONISTU category")
    public void testRegisteredUserCannotSetInShelterCategory() {

        assertThrows(SecurityException.class, () -> {

            Long adId = 1L;
            AddAdvertisementDTO dto = mock(AddAdvertisementDTO.class);
            when(dto.getCategory()).thenReturn(CategoryEnum.U_SKLONISTU);
            when(dto.getDisappearanceLocationLat()).thenReturn(null);

            when(advertisementRepository.existsByAdvertisementId(anyLong())).thenReturn(true);

            Advertisement changedAdvertisement = mock(Advertisement.class);
            when(changedAdvertisement.getUser()).thenReturn(mock(Registered.class));

            when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(Optional.of(changedAdvertisement));

            advertisementService.changeAdvertisement(adId, dto);
        });
    }

}