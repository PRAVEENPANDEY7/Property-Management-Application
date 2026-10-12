package com.property.management.repository;

import com.property.management.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    /**
     * Efficient city filtering using case-insensitive match supported by database index.
     */
    Page<Property> findByCityIgnoreCase(String city, Pageable pageable);

    /**
     * Optional search combining city and property name keyword.
     */
    Page<Property> findByCityIgnoreCaseAndNameContainingIgnoreCase(String city, String name, Pageable pageable);

    /**
     * Name keyword search across all cities.
     */
    Page<Property> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Single property lookup with eager join fetch of images to avoid lazy initialization issues.
     */
    @Query("SELECT p FROM Property p LEFT JOIN FETCH p.images WHERE p.id = :id")
    Optional<Property> findByIdWithImages(@Param("id") Long id);

    /**
     * Check if a property exists with a given name in a city.
     */
    boolean existsByNameIgnoreCaseAndCityIgnoreCase(String name, String city);
}
