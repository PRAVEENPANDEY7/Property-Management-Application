package com.property.management.repository;

import com.property.management.entity.Property;
import com.property.management.entity.PropertyImage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Should persist property with images and cascade delete children on property removal")
    void shouldPersistPropertyWithImagesAndCascadeDelete() {
        Property property = new Property(
                "Skyline Penthouse",
                "Luxury penthouse with panoramic city views and private terrace.",
                new BigDecimal("1250000.00"),
                "742 Evergreen Terrace",
                "New York"
        );

        PropertyImage img1 = new PropertyImage(
                "uploads/properties/penthouse_1.webp",
                "penthouse_1.webp",
                "image/webp",
                204800L,
                true,
                1
        );
        PropertyImage img2 = new PropertyImage(
                "uploads/properties/penthouse_2.webp",
                "penthouse_2.webp",
                "image/webp",
                184320L,
                false,
                2
        );

        property.addImage(img1);
        property.addImage(img2);

        Property saved = propertyRepository.saveAndFlush(property);
        Long propertyId = saved.getId();
        Long img1Id = img1.getId();
        Long img2Id = img2.getId();

        entityManager.clear();

        // Verify retrieval with eager image fetch
        Optional<Property> fetched = propertyRepository.findByIdWithImages(propertyId);
        assertThat(fetched).isPresent();
        assertThat(fetched.get().getImages()).hasSize(2);
        assertThat(fetched.get().getPrice()).isEqualByComparingTo(new BigDecimal("1250000.00"));

        // Delete property and assert cascade deletion of child images
        propertyRepository.deleteById(propertyId);
        propertyRepository.flush();
        entityManager.clear();

        assertThat(propertyRepository.findById(propertyId)).isEmpty();
        assertThat(propertyImageRepository.findById(img1Id)).isEmpty();
        assertThat(propertyImageRepository.findById(img2Id)).isEmpty();
    }

    @Test
    @DisplayName("Should accurately filter properties by city case-insensitively")
    void shouldFilterPropertiesByCityCaseInsensitive() {
        propertyRepository.save(new Property("NYC Loft", "Spacious open loft in Soho", new BigDecimal("850000.00"), "100 Broadway", "New York"));
        propertyRepository.save(new Property("Manhattan Studio", "Cozy midtown studio", new BigDecimal("450000.00"), "200 5th Ave", "new york"));
        propertyRepository.save(new Property("Windy City Condo", "Lakefront modern condo", new BigDecimal("620000.00"), "50 Michigan Ave", "Chicago"));
        propertyRepository.flush();

        Page<Property> nyResults = propertyRepository.findByCityIgnoreCase("NEW YORK", PageRequest.of(0, 10));

        assertThat(nyResults.getTotalElements()).isEqualTo(2);
        assertThat(nyResults.getContent()).allMatch(p -> p.getCity().equalsIgnoreCase("New York"));
    }

    @Test
    @DisplayName("Should paginate and sort properties correctly")
    void shouldPaginateAndSortProperties() {
        for (int i = 1; i <= 5; i++) {
            propertyRepository.save(new Property(
                    "Property " + i,
                    "Description for property " + i,
                    new BigDecimal(100000 * i + ".00"),
                    "Address " + i,
                    "Boston"
            ));
        }
        propertyRepository.flush();

        // Request page 0, size 2, sorted by price descending
        Page<Property> page = propertyRepository.findAll(PageRequest.of(0, 2, Sort.by(Sort.Direction.DESC, "price")));

        assertThat(page.getTotalElements()).isEqualTo(5);
        assertThat(page.getTotalPages()).isEqualTo(3);
        assertThat(page.getContent()).hasSize(2);
        assertThat(page.getContent().get(0).getPrice()).isEqualByComparingTo(new BigDecimal("500000.00"));
        assertThat(page.getContent().get(1).getPrice()).isEqualByComparingTo(new BigDecimal("400000.00"));
    }
}
