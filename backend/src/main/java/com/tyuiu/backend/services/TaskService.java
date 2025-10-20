package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.models.entities.Task;
import com.tyuiu.backend.models.entities.TaskTag;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.mappers.TaskMapper;
import com.tyuiu.backend.models.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final R2dbcEntityTemplate template;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;

    private Flux<TaskDTO> getBoardTasks(String boardId) {
        return template.select(query(where("board_id").is(boardId)), Task.class)
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

    private Mono<Void> changeTask(TaskDTO taskDTO){
        return template.update(taskMapper.toEntity(taskDTO)).then();
    }

    private Mono<Void> deleteTask(String taskId){
        return template.delete(query(where("id").is(taskId)), Task.class).then();
    }
}
