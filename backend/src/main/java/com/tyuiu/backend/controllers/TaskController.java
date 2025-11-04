package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.models.dto.TaskTagDTO;
import com.tyuiu.backend.models.enums.TaskStatus;
import com.tyuiu.backend.services.TaskService;
import com.tyuiu.backend.services.TaskTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/api/task")
@RequiredArgsConstructor
@Tag(name = "Контроллер управления задачами")
public class TaskController {
    private final TaskService taskService;
    private final TaskTagService taskTagService;

    @GetMapping("/board/{scrumId}")
    @Operation(summary = "Получение всех задач для доски")
    public Mono<Map<TaskStatus, Collection<TaskDTO>>> getBoardTasks(@PathVariable String scrumId) {
        return taskService.getBoardTasks(scrumId);
    }

    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Получение задач спринта")
    public Flux<TaskDTO> getSprintTasks(@PathVariable String sprintId) {
        return taskService.getSprintTasks(sprintId);
    }

    @GetMapping("/tag/all/{scrumId}")
    @Operation(summary = "Получение всех тэгов задач скрама")
    public Flux<TaskTagDTO> getTaskTags(@PathVariable String scrumId) {
        return taskTagService.getScrumTags(scrumId);
    }

    @PostMapping("/create")
    @Operation(summary = "Создание задачи")
    public Mono<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        return taskService.createTask(taskDTO);
    }

    @PostMapping("/create/tag")
    @Operation(summary = "Создание тэга")
    public Mono<TaskTagDTO> createTag(@RequestBody TaskTagDTO taskTagDTO) {
        return taskTagService.createTag(taskTagDTO);
    }

    @PutMapping("/change")
    @Operation(summary = "Изменение задачи")
    public Mono<TaskDTO> updateTask(@RequestBody TaskDTO taskDTO){
        return taskService.updateTask(taskDTO);
    }

    @DeleteMapping("/delete/{scrumId}/{taskId}")
    @Operation(summary = "Удаление задачи")
    public Mono<Void> deleteTask(@PathVariable String scrumId, @PathVariable String taskId){
        return taskService.deleteTask(scrumId, taskId);
    }
}
