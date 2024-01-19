package com.lostpetfinder;

import com.lostpetfinder.dao.*;
import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.dto.MessageInputDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.entity.pkeys.CoordinatesPK;
import com.lostpetfinder.entity.pkeys.MessagePK;
import com.lostpetfinder.service.ImageService;
import com.lostpetfinder.service.LocationService;
import com.lostpetfinder.service.MessageService;
import org.junit.jupiter.api.DisplayName;
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
    private MessageImageRepository messageImageRepository;

    @InjectMocks
    private MessageService messageService;

    @Test
    @DisplayName("Messages with text only are successfully saved")
    public void testSaveMessageWithTextOnly() {

        MessageInputDTO dto = mock(MessageInputDTO.class);
        when(dto.getSenderUsername()).thenReturn("testUser");
        when(dto.getMessageText()).thenReturn("testMessageText");
        when(dto.getAdvertisementId()).thenReturn(1L);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(mock(User.class)));
        when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(
                Optional.of(mock(Advertisement.class))
        );

        messageService.saveMessage(dto);

        Mockito.verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    @DisplayName("Messages with location included are successfully saved")
    public void testSaveMessageWithLocationProvided() {

        MessageInputDTO dto = mock(MessageInputDTO.class);
        when(dto.getSenderUsername()).thenReturn("testUser");
        when(dto.getMessageText()).thenReturn("testMessageText");
        when(dto.getAdvertisementId()).thenReturn(1L);
        when(dto.getDisappearanceLocationLat()).thenReturn(45.815399);
        when(dto.getDisappearanceLocationLng()).thenReturn(15.966568);

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(mock(User.class)));
        when(advertisementRepository.findByAdvertisementId(anyLong())).thenReturn(
                Optional.of(mock(Advertisement.class))
        );
        when(locationRepository.existsByCoordinates(any(CoordinatesPK.class))).thenReturn(false);
        when(locationService.getLocation(anyDouble(), anyDouble())).thenReturn(mock(Location.class));

        messageService.saveMessage(dto);

        Mockito.verify(locationRepository, times(1)).save(any(Location.class));
        Mockito.verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    @DisplayName("Messages are retrieved in correct order")
    public void testIfRetrievedChatMessagesAreOrdered() {

        Message message1 = mock(Message.class);
        when(message1.getAltId()).thenReturn(new MessagePK(mock(User.class), LocalDateTime.now().minusDays(1)));
        when(message1.getAdvertisement()).thenReturn(mock(Advertisement.class));
        when(message1.getText()).thenReturn("Hello, World from testUser1!");

        Message message2 = mock(Message.class);
        when(message2.getAltId()).thenReturn(new MessagePK(mock(User.class), LocalDateTime.now()));
        when(message2.getAdvertisement()).thenReturn(mock(Advertisement.class));
        when(message2.getText()).thenReturn("Hello, World from testUser2!");

        when(messageRepository.findAllByAdvertisementAdvertisementId(anyLong())).thenReturn(
                Arrays.asList(message1, message2)
        );

        List<MessageDTO> result = messageService.getChatMessages(1L);

        assertEquals(2, result.size());
        assertEquals("Hello, World from testUser2!", result.get(0).getMessageText());
    }

}

