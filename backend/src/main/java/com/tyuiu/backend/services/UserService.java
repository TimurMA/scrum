package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.UserDTO;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.mappers.UserMapper;
import com.tyuiu.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserService implements ReactiveUserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;


    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return userRepository.findByUsername(username).cast(UserDetails.class);
    }

    public Mono<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Flux<UserDTO> getAllUsers() {
        return userRepository.findAll().map(userMapper::toDTO);
    }

    public Mono<User> create(User user) {
        return userRepository.existsByUsername(user.getUsername())
                .flatMap(usernameExists -> {
                    if (usernameExists) {
                        return Mono.error(new UsernameNotFoundException("Пользователь с таким именем уже существует"));
                    }
                    return userRepository.existsByEmail(user.getEmail());
                })
                .flatMap(emailExists -> {
                    if (emailExists) {
                        return Mono.error(new UsernameNotFoundException("Пользователь с таким email уже существует"));
                    }
                    return userRepository.save(user);
                });
    }
}
