package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.requests.SignInRequest;
import com.tyuiu.backend.models.requests.SignUpRequest;
import com.tyuiu.backend.models.responses.JwtAuthResponse;
import com.tyuiu.backend.services.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth/sign")
@RequiredArgsConstructor
@Tag(name = "Аутентификация")
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping("/up")
    @Operation(summary = "Регистрация пользователя")
    public Mono<JwtAuthResponse> signUp(@RequestBody @Valid SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @Operation(summary = "Авторизация пользователя")
    @PostMapping("/in")
    public Mono<JwtAuthResponse> signIn(@RequestBody @Valid SignInRequest request) {
        return authenticationService.signIn(request);
    }
}
