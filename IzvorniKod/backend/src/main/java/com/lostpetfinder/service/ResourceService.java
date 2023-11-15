package com.lostpetfinder.service;

import com.lostpetfinder.exception.FileUploadFailedException;
import com.lostpetfinder.exception.ImageNotSelectedException;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.nio.file.Paths;

@Service
public class ResourceService {

    private String generateFileName() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd-HHmmssSSS");
        return dateFormat.format(new Date());
    }

    public List<String> addImages(List<MultipartFile> files) throws ImageNotSelectedException, FileUploadFailedException {
        if (files.isEmpty()) {
            throw new ImageNotSelectedException("Please select an image to upload.");
        }
        try {
            List<String> linktoImageList = new LinkedList<>();

            // Get the root directory of your static folder
            String resourceFolderPath = "";
            try {
                ClassLoader classLoader = getClass().getClassLoader();
                File file = new File(classLoader.getResource("").getFile());
                 resourceFolderPath = file.getAbsolutePath();
            } catch (NullPointerException e) {
                // Handle the exception
                e.printStackTrace();
                return null;
            }
            String rootDirectory = resourceFolderPath + "/static/";

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    throw new ImageNotSelectedException("Please select an image to upload.");
                }

                String originalFileName = file.getOriginalFilename();
                String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
                String newFileName = generateFileName() + extension;
                String pathname = rootDirectory + newFileName;
                linktoImageList.add(newFileName);

                // Save each file to the static folder
                file.transferTo(new File(pathname));
            }

            return linktoImageList;
        } catch (IOException e) {
            e.printStackTrace();
            throw new FileUploadFailedException("File upload failed.");
        }
    }

}
