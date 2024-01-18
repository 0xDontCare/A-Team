package com.lostpetfinder;

import com.lostpetfinder.dao.*;
import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.entity.pkeys.CoordinatesPK;
import com.lostpetfinder.entity.pkeys.MessagePK;
import com.lostpetfinder.service.ImageService;
import com.lostpetfinder.service.LocationService;
import com.lostpetfinder.service.MessageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MessageServiceUnitTests {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository<User> userRepository;

    @Mock
    private AdvertisementRepository advertisementRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private LocationService locationService;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private MessageService messageService;

    @Test
    public void testSaveMessageWithTextOnly() {
        MessageDTO dto = new MessageDTO();
        dto.setSenderUsername("testUser");
        dto.setSenderEmail("testEmail");
        dto.setSenderPhoneNumber("testPhoneNumber");
        dto.setMessageText("testMessageText");
        dto.setAdvertisementId(1L);

        User user = new User();
        user.setUsername(dto.getSenderUsername());
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));

        Advertisement advertisement = new Advertisement();
        advertisement.setAdvertisementId(dto.getAdvertisementId());
        when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(Optional.of(advertisement));

        messageService.saveMessage(dto);

        Mockito.verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    public void testSaveMessageWithLocationProvided() {
        MessageDTO dto = new MessageDTO();
        dto.setSenderUsername("testUser");
        dto.setSenderEmail("testEmail");
        dto.setSenderPhoneNumber("testPhoneNumber");
        dto.setMessageText("testMessageText");
        dto.setAdvertisementId(1L);
        dto.setDisappearanceLocationLat(45.815399);
        dto.setDisappearanceLocationLng(15.966568);

        User user = new User();
        user.setUsername(dto.getSenderUsername());
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));

        Advertisement advertisement = new Advertisement();
        advertisement.setAdvertisementId(dto.getAdvertisementId());
        when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(Optional.of(advertisement));

        Location location = new Location();
        location.setCoordinates(new CoordinatesPK(
                dto.getDisappearanceLocationLat(),
                dto.getDisappearanceLocationLng())
        );
        when(locationRepository.existsByCoordinates(any(CoordinatesPK.class))).thenReturn(false);
        when(locationService.getLocation(anyDouble(), anyDouble())).thenReturn(location);
        when(locationRepository.save(any(Location.class))).thenReturn(location);

        messageService.saveMessage(dto);

        Mockito.verify(locationRepository, times(1)).save(any(Location.class));
        Mockito.verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    public void testSaveMessageWithImage() throws IOException {
        MessageDTO dto = new MessageDTO();
        dto.setSenderUsername("testUser");
        dto.setSenderEmail("testEmail");
        dto.setSenderPhoneNumber("testPhoneNumber");
        dto.setMessageText("testMessageText");
        dto.setAdvertisementId(1L);
        dto.setImage(new MockMultipartFile("testimagefile", "hello.png",
                MediaType.IMAGE_PNG_VALUE, "Hello, World!".getBytes()));

        User user = new User();
        user.setUsername(dto.getSenderUsername());
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));

        Advertisement advertisement = new Advertisement();
        advertisement.setAdvertisementId(dto.getAdvertisementId());
        when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(Optional.of(advertisement));

        when(imageService.generateLinkToImage(any())).thenReturn("linkToImage");

        messageService.saveMessage(dto);

        Mockito.verify(imageRepository, times(1)).save(any(Image.class));
        Mockito.verify(messageRepository, times(1)).save(any(Message.class));
    }


    @Test
    public void testIfRetrievedChatMessagesAreOrdered() {
        User user1 = new User();
        user1.setUsername("testUser1");
        user1.setEmail("testEmail1");
        user1.setPhoneNumber("testPhoneNumber1");
        User user2 = new User();
        user1.setUsername("testUser2");
        user1.setEmail("testEmail2");
        user1.setPhoneNumber("testPhoneNumber2");

        Advertisement advertisement1 = mock(Advertisement.class);
        advertisement1.setAdvertisementId(1L);
        Advertisement advertisement2 = mock(Advertisement.class);
        advertisement2.setAdvertisementId(2L);

        MessagePK pk1 = new MessagePK(user1, LocalDateTime.now().minusDays(1));
        MessagePK pk2 = new MessagePK(user2, LocalDateTime.now());

        Message message1 = new Message();
        message1.setAltId(pk1);
        message1.setAdvertisement(advertisement1);
        message1.setText("Hello, World from testUser1!");
        Message message2 = new Message();
        message2.setAltId(pk2);
        message2.setAdvertisement(advertisement2);
        message2.setText("Hello, World from testUser2!");

        when(messageRepository.findAllByAdvertisementAdvertisementId(anyLong())).thenReturn(
                Arrays.asList(message1, message2)
        );

        List<MessageDTO> result = messageService.getChatMessages(1L);
        assertEquals(2, result.size());
        assertEquals("Hello, World from testUser2!", result.get(0).getMessageText());
    }

}

