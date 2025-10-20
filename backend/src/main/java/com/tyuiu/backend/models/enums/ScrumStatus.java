package com.tyuiu.backend.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScrumStatus {
    ACTIVE("Активен"),
    DONE("Завершён"),
    DELETED("Удалён");

    private final String status;
}
