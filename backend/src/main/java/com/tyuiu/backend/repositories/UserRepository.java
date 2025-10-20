package com.tyuiu.backend.repositories;

import com.tyuiu.backend.models.entities.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
@Repository
public interface UserRepository extends ReactiveCrudRepository<User, String> {
    Mono<User> findByUsername(String username);
    Mono<Boolean> existsByUsername(String username);
    Mono<Boolean> existsByEmail(String email);
}
