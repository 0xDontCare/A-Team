package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryId(Long categoryId);

    Optional<Category> findByDescription(String description);

    boolean existsByDescriptionNot(String description);

    boolean existsByCategoryIdNot(Long categoryId);

}
