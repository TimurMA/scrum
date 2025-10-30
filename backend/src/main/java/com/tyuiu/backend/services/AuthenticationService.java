package com.tyuiu.backend.services;

import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.requests.SignInRequest;
import com.tyuiu.backend.models.requests.SignUpRequest;
import com.tyuiu.backend.models.responses.JwtAuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final ReactiveAuthenticationManager authenticationManager;

    public Mono<JwtAuthResponse> signUp(SignUpRequest request) {

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        return userService.create(user).flatMap(createdUser -> {
            var jwt = jwtService.generateToken(createdUser);
            return Mono.just(new JwtAuthResponse(jwt));
        });
    }

    public Mono<JwtAuthResponse> signIn(SignInRequest request) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        ).flatMap(authentication -> userService.findByUsername(request.getUsername())
                .flatMap(userDetails -> {
                    var jwt = jwtService.generateToken(userDetails);
                    return Mono.just(new JwtAuthResponse(jwt));
                }));
    }
}
