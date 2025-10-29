package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.models.entities.Task;
import com.tyuiu.backend.models.entities.TaskTag;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.enums.TaskStatus;
import com.tyuiu.backend.models.mappers.TaskMapper;
import com.tyuiu.backend.models.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.GroupedFlux;
import reactor.core.publisher.Mono;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final R2dbcEntityTemplate template;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;

    public Flux<GroupedFlux<TaskStatus, TaskDTO>> getBoardTasks(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)), Task.class)
                .map(taskMapper::toDTO)
                .flatMap(task -> template.selectOne(query(where("task_id").is(task.getTaskTagId())), TaskTag.class)
                        .flatMap(taskTag -> template.selectOne(query(where("id").is(task.getExecutorId())), User.class)
                                .flatMap(creator -> {
                                    task.setTaskTag(taskMapper.toDTO(taskTag));
                                    task.setCreator(userMapper.toDTO(creator));
                                    if (task.getExecutorId() != null){
                                        return template.selectOne(query(where("id").is(task.getExecutorId())), User.class)
                                                .flatMap(executor -> {
                                                    task.setExecutor(userMapper.toDTO(executor));
                                                    return Mono.just(task);
                                                });
                                    }
                                    return Mono.just(task);
                                }))).groupBy(TaskDTO::getStatus);
    }

    public Flux<TaskDTO> getSprintTasks(String sprintId) {
        return template.select(query(where("sprint_id").is(sprintId)), Task.class)
                .map(taskMapper::toDTO)
                .flatMap(task -> template.selectOne(query(where("task_id").is(task.getTaskTagId())), TaskTag.class)
                        .flatMap(taskTag -> template.selectOne(query(where("id").is(task.getExecutorId())), User.class)
                                .flatMap(creator -> {
                                    task.setTaskTag(taskMapper.toDTO(taskTag));
                                    task.setCreator(userMapper.toDTO(creator));
                                    if (task.getExecutorId() != null){
                                        return template.selectOne(query(where("id").is(task.getExecutorId())), User.class)
                                                .flatMap(executor -> {
                                                    task.setExecutor(userMapper.toDTO(executor));
                                                    return Mono.just(task);
                                                });
                                    }
                                    return Mono.just(task);
                                })));
    }

    public Mono<Void> changeTask(TaskDTO taskDTO){
        return template.update(taskMapper.toEntity(taskDTO)).then();
    }

    public Mono<Void> deleteTask(String taskId){
        return template.delete(query(where("id").is(taskId)), Task.class).then();
    }
}
