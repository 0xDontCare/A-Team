package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.MessageRepository;
import com.lostpetfinder.dao.UserRepository;
import com.lostpetfinder.dto.MessageDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Message;
import com.lostpetfinder.entity.User;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository<User> userRepository;
    private final AdvertisementRepository advertisementRepository;

    public MessageService(MessageRepository messageRepository,
                          UserRepository<User> userRepository,
                          AdvertisementRepository advertisementRepository)
    {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.advertisementRepository = advertisementRepository;
    }

    // figure out where to save the images sent to the chat
    public void saveMessage(MessageDTO messageDTO) {
        User user = userRepository.findByUsername(messageDTO.getSenderUsername()).orElseThrow();
        Advertisement advertisement = advertisementRepository
                .findByAdvertisementId(messageDTO.getAdvertisementId())
                .orElseThrow();

        Message message = new Message(
                user,
                messageDTO.getMessageText(),
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
                null,
                null
        );

    }

}
