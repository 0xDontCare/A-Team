package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.LocationRepository;
import com.lostpetfinder.dao.MessageRepository;
import com.lostpetfinder.dao.UserRepository;
import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Location;
import com.lostpetfinder.entity.Message;
import com.lostpetfinder.entity.User;
import com.lostpetfinder.entity.pkeys.CoordinatesPK;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository<User> userRepository;
    private final AdvertisementRepository advertisementRepository;
    private final LocationRepository locationRepository;
    private final LocationService locationService;

    public MessageService(MessageRepository messageRepository,
                          UserRepository<User> userRepository,
                          AdvertisementRepository advertisementRepository,
                          LocationRepository locationRepository,
                          LocationService locationService)
    {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.advertisementRepository = advertisementRepository;
        this.locationRepository = locationRepository;
        this.locationService = locationService;
    }

    // figure out where to save the images sent to the chat
    public void saveMessage(MessageDTO dto) {
        User user = userRepository.findByUsername(dto.getSenderUsername()).orElseThrow();
        Advertisement advertisement = advertisementRepository
                .findByAdvertisementId(dto.getAdvertisementId())
                .orElseThrow();

        Location location;
        CoordinatesPK coordinatesPK = new CoordinatesPK(
                dto.getDisappearanceLocationLat(),
                dto.getDisappearanceLocationLng()
        );
        if (locationRepository.existsByCoordinates(coordinatesPK)) {
            location = locationRepository.findByCoordinates(coordinatesPK).orElseThrow();
        } else {
            location = locationRepository.save(locationService.getDisappearanceLocation(
                    dto.getDisappearanceLocationLat(),
                    dto.getDisappearanceLocationLng())
            );
        }

        Message message = new Message(
                user,
                dto.getMessageText(),
                location,
                advertisement
        );

        messageRepository.save(message);
    }

    public List<MessageDTO> getChatMessages(Long advertisementId) {
        return messageRepository
                .findAllByAdvertisementAdvertisementId(advertisementId)
                .stream()
                .sorted(Comparator
                        .comparing(message -> ((Message) message).getPk().getSendingDateTime())
                        .reversed())
                .map(MessageService::convertToMessageDTO)
                .collect(Collectors.toList());
    }

    // repair when you figure out the location and image handling
    private static MessageDTO convertToMessageDTO(Message message) {

        return new MessageDTO(
                message.getPk().getUser().getUsername(),
                message.getAdvertisement().getAdvertisementId(),
                message.getMessageText(),
                message.getLocation().getCoordinates().getLatitude(),
                message.getLocation().getCoordinates().getLongitude(),
                null
        );

    }

}
