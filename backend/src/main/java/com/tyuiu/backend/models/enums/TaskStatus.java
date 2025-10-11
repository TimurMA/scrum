package com.tyuiu.backend.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;


@Getter
@RequiredArgsConstructor
public enum TaskStatus {
    InBackLog("В бэклоге"),
    OnModification("На редактировании"),
    NewTask("Новая"),
    InProgress("Выполняется"),
    OnVerification("Проверяется"),
    Done("Завершена");
    private final String status;

}
