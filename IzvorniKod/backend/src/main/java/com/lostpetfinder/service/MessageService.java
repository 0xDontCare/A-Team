package com.lostpetfinder.service;

import com.lostpetfinder.dao.*;
import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.dto.MessageInputDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.entity.pkeys.CoordinatesPK;
import com.lostpetfinder.utils.BASE64DecodedMultipartFile;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Base64;
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
    private final ImageService imageService;
    private final MessageImageRepository messageImageRepository;

    public MessageService(MessageRepository messageRepository,
                          UserRepository<User> userRepository,
                          AdvertisementRepository advertisementRepository,
                          LocationRepository locationRepository,
                          LocationService locationService,
                          ImageRepository imageRepository,
                          ImageService imageService,
                          MessageImageRepository messageImageRepository)
    {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.advertisementRepository = advertisementRepository;
        this.locationRepository = locationRepository;
        this.locationService = locationService;
        this.imageService = imageService;
        this.messageImageRepository = messageImageRepository;
    }

    public void saveMessage(MessageInputDTO dto) {
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

        Message message = new Message(
                user,
                dto.getMessageText(),
                location,
                advertisement
        );

        messageRepository.save(message);

        MessageImage image = null;
        if (dto.getImages() != null) {
            BASE64DecodedMultipartFile decodedImage;
            for (String i : dto.getImages()) {
                decodedImage = new BASE64DecodedMultipartFile(Base64.getDecoder().decode(i));
                String linkToImage = imageService.generateLinkToImage(decodedImage);
                try {
                    image = new MessageImage(
                            linkToImage,
                            decodedImage.getBytes(),
                            decodedImage.getContentType(),
                            message
                    );
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                messageImageRepository.save(image);
            }
        }
    }

    public List<MessageDTO> getChatMessages(Long advertisementId) {
        return messageRepository
                .findAllByAdvertisementAdvertisementId(advertisementId)
                .stream()
                .sorted(Comparator
                        .comparing(message -> ((Message) message).getAltId().getSendingDateTime())
                        .reversed())
                .map(this::convertToMessageDTO)
                .collect(Collectors.toList());
    }

    // repair when you figure out the location and image handling
    private MessageDTO convertToMessageDTO(Message message) {

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
                messageImageRepository.findByMessageId(message.getId())
                        .stream()
                        .map(MessageImage::getLinkToImage)
                        .collect(Collectors.toList())
        );

    }

}
