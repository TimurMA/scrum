package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.ScrumMemberDTO;
import com.tyuiu.backend.models.entities.ScrumMember;
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
public class ScrumMemberService {
    private final R2dbcEntityTemplate template;

    private final ScrumMapper scrumMapper;

    public Flux<ScrumMemberDTO> getAllMembers(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)), ScrumMember.class)
                .map(scrumMapper::toDTO);
    }

    public Mono<Void> inviteMembers(Flux<String> emails, String scrumId) {
        return emails.flatMap(e -> {
            return template.insert(ScrumMember
                    .builder().scrumId(scrumId).userEmail(e).build());
        }).then();
    }
}
