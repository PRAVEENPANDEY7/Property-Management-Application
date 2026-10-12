package com.property.management.repository;

import com.property.management.entity.PropertyInquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyInquiryRepository extends JpaRepository<PropertyInquiry, Long> {

    @Query(value = "SELECT i FROM PropertyInquiry i JOIN FETCH i.property ORDER BY i.createdAt DESC",
           countQuery = "SELECT COUNT(i) FROM PropertyInquiry i")
    Page<PropertyInquiry> findAllWithProperty(Pageable pageable);

    long countByStatus(PropertyInquiry.Status status);
}
