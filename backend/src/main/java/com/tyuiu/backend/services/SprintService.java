package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.SprintDTO;
import com.tyuiu.backend.models.entities.Sprint;
import com.tyuiu.backend.models.enums.SprintStatus;
import com.tyuiu.backend.models.mappers.SprintMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;
import static org.springframework.data.relational.core.query.Update.update;

@Service
@RequiredArgsConstructor
public class SprintService {
    private final R2dbcEntityTemplate template;
    private final SprintMapper sprintMapper;

    public Flux<SprintDTO> getAllSprints(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)), Sprint.class)
                .map(sprintMapper::toDTO);
    }

    public Flux<SprintDTO> getActiveSprints(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)
                .and(where("status").is(SprintStatus.ACTIVE))), Sprint.class)
                .map(sprintMapper::toDTO);
    }

    public Mono<SprintDTO> createSprint(SprintDTO sprintDTO) {
        return template.insert(sprintMapper.toEntity(sprintDTO))
                .map(sprintMapper::toDTO);
    }

    public Mono<SprintDTO> updateSprint(SprintDTO sprintDTO) {
        return template.update(sprintMapper.toEntity(sprintDTO))
                .flatMap(updated -> template.selectOne(query(where("id").is(sprintDTO.getId())), Sprint.class))
                .map(sprintMapper::toDTO);
    }

    public Mono<Void> startSprint(String sprintId) {
        return template.update(query(where("id").is(sprintId).and(where("status").is(SprintStatus.ACTIVE))),
                        update("status", SprintStatus.DONE), Sprint.class)
                .then(template.update(query(where("id").is(sprintId)),
                update("status", SprintStatus.ACTIVE), Sprint.class)).then();
    }

    public Mono<Void> completeSprint(String sprintId, String report) {
        return template.update(query(where("id").is(sprintId)),
                update("status", SprintStatus.DONE)
                        .set("report", report), Sprint.class)
                .then();
    }

    public Mono<Void> deleteSprint(String sprintId) {
        return template.delete(query(where("id").is(sprintId)), Sprint.class).then();
    }
}
