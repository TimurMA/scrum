package com.tyuiu.backend.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sprint")
@RequiredArgsConstructor
@Tag(name = "Контроллер управления спринтами")
public class SprintController {
}
