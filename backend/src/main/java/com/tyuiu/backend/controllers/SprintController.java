package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.dto.SprintDTO;
import com.tyuiu.backend.services.SprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/sprint")
@RequiredArgsConstructor
@Tag(name = "Контроллер управления спринтами")
public class SprintController {
    private final SprintService sprintService;

    @GetMapping("/all/{scrumId}")
    @Operation(summary = "Получение всех спринтов скрама")
    public Flux<SprintDTO> getAllSprints(@PathVariable String scrumId) {
        return sprintService.getAllSprints(scrumId);
    }

    @GetMapping("/active/{scrumId}")
    @Operation(summary = "Получение всех активных спринтов скрама")
    public Flux<SprintDTO> getActiveSprints(@PathVariable String scrumId) {
        return sprintService.getActiveSprints(scrumId);
    }

    @PostMapping("/create")
    @Operation(summary = "Создание спринта")
    public Mono<SprintDTO> createSprint(@RequestBody SprintDTO sprintDTO) {
        return sprintService.createSprint(sprintDTO);
    }

    @PutMapping("/update")
    @Operation(summary = "Обновление спринта")
    public Mono<SprintDTO> updateSprint(@RequestBody SprintDTO sprintDTO) {
        return sprintService.updateSprint(sprintDTO);
    }

    @PatchMapping("/start/{sprintId}")
    @Operation(summary = "Старт спринта")
    public Mono<Void> startSprint(@PathVariable String sprintId){
        return sprintService.startSprint(sprintId);
    }

    @PatchMapping("/complete/{sprintId}")
    @Operation(summary = "Завершение спринта")
    public Mono<Void> completeSprint(@PathVariable String sprintId,
                                     @RequestBody String report) {
        return sprintService.completeSprint(sprintId, report);
    }

    @DeleteMapping("/delete/{sprintId}")
    @Operation(summary = "Удаление спринта")
    public Mono<Void> deleteSprint(@PathVariable String sprintId) {
        return sprintService.deleteSprint(sprintId);
    }
}
