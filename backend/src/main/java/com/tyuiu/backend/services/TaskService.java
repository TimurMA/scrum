package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.models.entities.Task;
import com.tyuiu.backend.models.entities.TaskTag;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.enums.TaskStatus;
import com.tyuiu.backend.models.mappers.TaskMapper;
import com.tyuiu.backend.models.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {
    private final R2dbcEntityTemplate template;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;

    private final Sinks.Many<TaskDTO> tasksChannel = Sinks.many().replay().all();
    private final Map<String, Sinks.Many<String>> scrumDeletionChannels = new ConcurrentHashMap<>();

    private Sinks.Many<String> getOrCreateScrumDeletionChannel(String scrumId) {
        return scrumDeletionChannels.computeIfAbsent(scrumId, key -> {
            Sinks.Many<String> sink = Sinks.many().multicast().onBackpressureBuffer();
            log.debug("Created deletion channel for scrum: {}", scrumId);
            return sink;
        });
    }
    private Mono<TaskDTO> enrichTaskWithRelations(Task task) {
        return Mono.just(task)
                .map(taskMapper::toDTO)
                .flatMap(taskDTO ->
                        loadTaskTag(taskDTO)
                                .then(loadCreator(taskDTO))
                                .then(loadExecutorIfExists(taskDTO))
                                .thenReturn(taskDTO)
                )
                .doOnError(error -> log.error("Error enriching task with ID: {}", task.getId(), error));
    }

    private Mono<TaskDTO> loadTaskTag(TaskDTO taskDTO) {
        if (taskDTO.getTaskTagId() == null) {
            return Mono.just(taskDTO);
        }

        return template.selectOne(query(where("id").is(taskDTO.getTaskTagId())), TaskTag.class)
                .map(taskTag -> {
                    taskDTO.setTaskTag(taskMapper.toDTO(taskTag));
                    return taskDTO;
                })
                .defaultIfEmpty(taskDTO);
    }

    private Mono<TaskDTO> loadCreator(TaskDTO taskDTO) {
        return template.selectOne(query(where("id").is(taskDTO.getCreatorId())), User.class)
                .map(userMapper::toDTO)
                .map(creator -> {
                    taskDTO.setCreator(creator);
                    return taskDTO;
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Creator not found for task ID: {}", taskDTO.getId());
                    return Mono.just(taskDTO);
                }));
    }

    private Mono<TaskDTO> loadExecutorIfExists(TaskDTO taskDTO) {
        if (taskDTO.getExecutorId() == null) {
            return Mono.just(taskDTO);
        }

        return template.selectOne(query(where("id").is(taskDTO.getExecutorId())), User.class)
                .map(userMapper::toDTO)
                .map(executor -> {
                    taskDTO.setExecutor(executor);
                    return taskDTO;
                })
                .defaultIfEmpty(taskDTO);
    }

    public Mono<Map<TaskStatus, Collection<TaskDTO>>> getBoardTasks(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)), Task.class)
                .flatMap(this::enrichTaskWithRelations)
                .collectMultimap(TaskDTO::getStatus, item->item);
    }

    public Flux<TaskDTO> getSprintTasks(String sprintId) {
        return template.select(query(where("sprint_id").is(sprintId)), Task.class)
                .flatMap(this::enrichTaskWithRelations);
    }

    public Mono<TaskDTO> createTask(TaskDTO taskDTO) {
        return Mono.just(taskDTO)
                .map(dto -> {
                    Task task = taskMapper.toEntity(dto);
                    dto.setCreatedAt(LocalDateTime.now());
                    return task;
                })
                .flatMap(template::insert)
                .flatMap(this::enrichTaskWithRelations)
                .doOnSuccess(createdTask -> {
                    if (tasksChannel.tryEmitNext(createdTask).isFailure()) {
                        log.warn("Failed to emit created task to channel: {}", createdTask.getId());
                    }
                    log.info("Task created successfully: {}", createdTask.getId());
                })
                .doOnError(error -> log.error("Error creating task", error));
    }

    public Mono<TaskDTO> updateTask(TaskDTO taskDTO) {
        return Mono.just(taskDTO)
                .map(dto -> {
                    Task task = taskMapper.toEntity(dto);
                    task.setId(dto.getId());
                    return task;
                })
                .flatMap(template::update)
                .flatMap(this::enrichTaskWithRelations)
                .doOnSuccess(updatedTask -> {
                    if (tasksChannel.tryEmitNext(updatedTask).isFailure()) {
                        log.warn("Failed to emit updated task to channel: {}", updatedTask.getId());
                    }
                    log.info("Task updated successfully: {}", updatedTask.getId());
                })
                .doOnError(error -> log.error("Error updating task ID: {}", taskDTO.getId(), error));
    }

    public Mono<Void> deleteTask(String scrumId, String taskId) {
        return template.delete(query(where("id").is(taskId)), Task.class)
                .doOnSuccess(deletedCount -> {
                    if (deletedCount > 0) {
                        getOrCreateScrumDeletionChannel(scrumId).tryEmitNext(taskId);
                        log.info("Task deleted successfully: {} from scrum: {}", taskId, scrumId);
                    } else {
                        log.warn("No task found to delete with ID: {}", taskId);
                    }
                })
                .doOnError(error -> log.error("Error deleting task ID: {}", taskId, error))
                .then();
    }

    public Flux<TaskDTO> getTaskUpdates() {
        return tasksChannel.asFlux()
                .onBackpressureBuffer(1000, dropped ->
                        log.warn("Task update dropped due to backpressure: {}", dropped)
                );
    }

    public Flux<String> getTaskDeletions(String scrumId) {
        return getOrCreateScrumDeletionChannel(scrumId)
                .asFlux()
                .onBackpressureBuffer(100, dropped ->
                        log.warn("Task deletion event dropped due to backpressure for scrum {}: {}", scrumId, dropped)
                );
    }
}