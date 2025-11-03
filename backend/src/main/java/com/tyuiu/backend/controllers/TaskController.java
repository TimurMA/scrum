package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.models.enums.TaskStatus;
import com.tyuiu.backend.services.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.GroupedFlux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
@Tag(name = "Контроллер управления задачами")
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/board/{scrumId}")
    @Operation(summary = "Получение всех задач для доски")
    public Flux<GroupedFlux<TaskStatus, TaskDTO>> getBoardTasks(@PathVariable String scrumId) {
        return taskService.getBoardTasks(scrumId);
    }

    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Получение задач спринта")
    public Flux<TaskDTO> getSprintTasks(@PathVariable String sprintId) {
        return taskService.getSprintTasks(sprintId);
    }

    @PostMapping("/create")
    @Operation(summary = "Создание задания")
    public Mono<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        return taskService.createTask(taskDTO);
    }

    @PutMapping("/change")
    @Operation(summary = "Изменение задачи")
    public Mono<Void> changeTask(@RequestBody TaskDTO taskDTO){
        return taskService.changeTask(taskDTO);
    }

    @DeleteMapping("/delete/{taskId}")
    @Operation(summary = "Удаление задачи")
    public Mono<Void> deleteTask(@PathVariable String taskId){
        return taskService.deleteTask(taskId);
    }
}
