package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.TaskTagDTO;
import com.tyuiu.backend.models.entities.TaskTag;
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
public class TaskTagService {
    private final R2dbcEntityTemplate template;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;


    public Flux<TaskTagDTO> getScrumTags(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)), TaskTag.class).map(taskMapper::toDTO);
    }

    public Mono<TaskTagDTO> createTag(TaskTagDTO taskTagDTO){
        return template.insert(taskMapper.toEntity(taskTagDTO)).map(taskMapper::toDTO);
    }
}
