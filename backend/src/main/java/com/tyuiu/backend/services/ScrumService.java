package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.ScrumDTO;
import com.tyuiu.backend.models.entities.Scrum;
import com.tyuiu.backend.models.mappers.ScrumMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import static org.springframework.data.relational.core.query.Query.query;
import static org.springframework.data.relational.core.query.Criteria.where;



@Service
@RequiredArgsConstructor
public class ScrumService {
    private final R2dbcEntityTemplate template;
    private final ScrumMapper scrumMapper;

    public Flux<ScrumDTO> getAllScrums() {
        return template.select(Scrum.class).all().map(scrumMapper::toDTO);
    }

    public Flux<ScrumDTO> getScrumsByCreatorId(String creatorId) {
        return template.select(query(where("creator_id").is(creatorId)), Scrum.class).map(scrumMapper::toDTO);
    }

    public Mono<ScrumDTO> getById(String id){
        return template.selectOne(query(where("id").is("id")), Scrum.class).map(scrumMapper::toDTO);
    }

    public Mono<ScrumDTO> createScrum(ScrumDTO scrumDTO) {
        return template.insert(scrumMapper.toEntity(scrumDTO)).map(scrumMapper::toDTO);
    }

    public Mono<Void> deleteScrum(String scrumId) {
        return template.delete(query(where("id").is(scrumId)), Scrum.class).then();
    }
}
