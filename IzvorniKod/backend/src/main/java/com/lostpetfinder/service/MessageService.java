package com.lostpetfinder.service;

import com.lostpetfinder.dao.*;
import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.entity.pkeys.CoordinatesPK;
import org.springframework.stereotype.Service;
import java.io.IOException;
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
    private final ImageRepository imageRepository;
    private final ImageService imageService;

    public MessageService(MessageRepository messageRepository,
                          UserRepository<User> userRepository,
                          AdvertisementRepository advertisementRepository,
                          LocationRepository locationRepository,
                          LocationService locationService,
                          ImageRepository imageRepository,
                          ImageService imageService)
    {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.advertisementRepository = advertisementRepository;
        this.locationRepository = locationRepository;
        this.locationService = locationService;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
    }

    public void saveMessage(MessageDTO dto) {
        User user = userRepository.findByUsername(dto.getSenderUsername()).orElseThrow();

        Advertisement advertisement = advertisementRepository
                .findByAdvertisementId(dto.getAdvertisementId())
                .orElseThrow();

        Location location = null;
        if (dto.getDisappearanceLocationLat() != null && dto.getDisappearanceLocationLng() != null) {
            CoordinatesPK coordinatesPK = new CoordinatesPK(
                    dto.getDisappearanceLocationLat(),
                    dto.getDisappearanceLocationLng()
            );
            if (locationRepository.existsByCoordinates(coordinatesPK)) {
                location = locationRepository.findByCoordinates(coordinatesPK).orElseThrow();
            } else {
                location = locationRepository.save(locationService.getLocation(
                        dto.getDisappearanceLocationLat(),
                        dto.getDisappearanceLocationLng())
                );
            }
        }

        Image image = null;
        if (dto.getImage() != null) {
            String linkToImage = imageService.generateLinkToImage(dto.getImage());
            try {
                image = new Image(
                        linkToImage,
                        dto.getImage().getBytes(),
                        dto.getImage().getContentType(),
                        null
                );
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            imageRepository.save(image);
        }

        Message message = new Message(
                user,
                dto.getMessageText(),
                location,
                advertisement,
                image
        );

        messageRepository.save(message);
    }

    public List<MessageDTO> getChatMessages(Long advertisementId) {
        return messageRepository
                .findAllByAdvertisementAdvertisementId(advertisementId)
                .stream()
                .sorted(Comparator
                        .comparing(message -> ((Message) message).getAltId().getSendingDateTime())
                        .reversed())
                .map(MessageService::convertToMessageDTO)
                .collect(Collectors.toList());
    }

    // repair when you figure out the location and image handling
    private static MessageDTO convertToMessageDTO(Message message) {

        return new MessageDTO(
                message.getId(),
                message.getAltId().getUser().getUsername(),
                message.getAltId().getUser().getEmail(),
                message.getAltId().getUser().getPhoneNumber(),
                message.getAdvertisement().getAdvertisementId(),
                message.getText(),
                message.getLocation() == null ? null : message.getLocation().getCoordinates().getLatitude(),
                message.getLocation() == null ? null : message.getLocation().getCoordinates().getLongitude(),
                null,
                message.getImage() == null ? null : message.getImage().getLinkToImage()
        );

    }

}
