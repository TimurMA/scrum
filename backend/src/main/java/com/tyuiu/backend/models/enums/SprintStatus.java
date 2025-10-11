package com.tyuiu.backend.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SprintStatus {
    ACTIVE("Активен"),
    DONE("Завершен");

    private final String status;
}
