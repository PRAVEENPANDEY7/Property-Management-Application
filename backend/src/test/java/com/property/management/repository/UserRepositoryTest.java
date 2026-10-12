package com.property.management.repository;

import com.property.management.entity.Role;
import com.property.management.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Should successfully persist user and retrieve by email (case-insensitive)")
    void shouldPersistAndRetrieveUser() {
        User user = new User("John.Doe@Example.com", "hashed_pwd_123", "John Doe", Role.USER);
        userRepository.save(user);
        entityManager.flush();
        entityManager.clear();

        Optional<User> found = userRepository.findByEmailIgnoreCase("john.doe@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getFullName()).isEqualTo("John Doe");
        assertThat(found.get().getRole()).isEqualTo(Role.USER);
        assertThat(found.get().getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should enforce email uniqueness constraint in database")
    void shouldEnforceUniqueEmailConstraint() {
        User user1 = new User("unique@example.com", "pwd1", "User One", Role.USER);
        userRepository.saveAndFlush(user1);

        User user2 = new User("unique@example.com", "pwd2", "User Two", Role.USER);

        assertThatThrownBy(() -> userRepository.saveAndFlush(user2))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("Should support ADMIN role persistence")
    void shouldPersistAdminRole() {
        User admin = new User("admin@havenestate.com", "secure_admin_pwd", "System Admin", Role.ADMIN);
        User saved = userRepository.saveAndFlush(admin);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRole()).isEqualTo(Role.ADMIN);
    }
}
