package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

@Controller
@RequiredArgsConstructor
public class TaskRSocketController {

    private final TaskService taskService;

    @MessageMapping("tasks.receive.{scrumId}")
    public Flux<TaskDTO> receiveTasksByScrumId(@DestinationVariable String scrumId) {
        return taskService.getTaskUpdates().filter(taskDTO -> taskDTO.getScrumId().equals(scrumId));
    }

    @MessageMapping("tasks.deletions.{scrumId}")
    public Flux<String> streamScrumTaskDeletions(@DestinationVariable String scrumId) {
        return taskService.getTaskDeletions(scrumId);
    }
}
