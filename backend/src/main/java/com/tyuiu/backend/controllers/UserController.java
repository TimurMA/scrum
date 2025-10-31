package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.dto.UserDTO;
import com.tyuiu.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "Контроллер управления пользователями")
public class UserController {
    private final UserService userService;
    @GetMapping("/all")
    @Operation(summary = "Получение всех зарегистрированных пользователей")
    public Flux<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }
}
