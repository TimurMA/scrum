package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.ScrumMemberDTO;
import com.tyuiu.backend.models.entities.ScrumMember;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.mappers.ScrumMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

import static org.springframework.data.relational.core.query.Query.query;
import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Update.update;


@Service
@RequiredArgsConstructor
public class ScrumMemberService {
    private final R2dbcEntityTemplate template;

    private final ScrumMapper scrumMapper;

    public Flux<ScrumMemberDTO> getAllMembers(String scrumId) {
        return template.select(query(where("scrum_id").is(scrumId)
                        .and(where("finish_date").isNull())), ScrumMember.class)
                .map(scrumMapper::toDTO)
                .flatMap(scrumMemberDTO -> template.exists(query(where("email")
                        .is(scrumMemberDTO.getUserEmail())), User.class)
                        .flatMap(exists -> {
                            if (exists) {
                                return template.selectOne(query(where("email").is(scrumMemberDTO.getUserEmail())), User.class)
                                        .flatMap(user -> {
                                            scrumMemberDTO.setUserId(user.getId());
                                            scrumMemberDTO.setUserName(user.getUsername());
                                            return Mono.just(scrumMemberDTO);
                                        });
                            }
                            return Mono.just(scrumMemberDTO);
                        })
                )
                .filter(scrumMemberDTO -> scrumMemberDTO.getUserId() != null);
    }

    public Mono<Void> addMembers(Flux<String> emails, String scrumId) {
        return emails
                .flatMap(e -> template.insert(ScrumMember
                            .builder().scrumId(scrumId).userEmail(e).build()))
                .then();
    }

    public Mono<Void> kickMember(String email, String scrumId) {
        return template.update(query(where("email").is(email)),
                update("finish_date", LocalDateTime.now()), ScrumMember.class).then();
    }

}
