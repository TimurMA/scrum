package com.tyuiu.backend.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    USER("Пользователь"),
    ADMIN("Админ");

    private final String role;
}
