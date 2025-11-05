package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.ScrumMemberDTO;
import com.tyuiu.backend.models.entities.Scrum;
import com.tyuiu.backend.models.entities.ScrumMember;
import com.tyuiu.backend.models.entities.Task;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.models.enums.TaskStatus;
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
                                            scrumMemberDTO.setUsername(user.getUsername());
                                            return Mono.just(scrumMemberDTO);
                                        });
                            }
                            return Mono.just(scrumMemberDTO);
                        })
                )
                .filter(scrumMemberDTO -> scrumMemberDTO.getUserId() != null);
    }

    public Mono<ScrumMemberDTO> addMembers(String email, String scrumId) {
        return Mono.just(email)
                .flatMap(e -> template.exists(query(where("user_email").is(e)
                        .and(where("scrum_id").is(scrumId)).and("finish_date").isNull()), ScrumMember.class)
                        .flatMap(exists -> {
                            if (exists) {
                                return Mono.error(new RuntimeException("Пользователь уже в команде"));
                            }
                            return template.insert(ScrumMember
                                    .builder().scrumId(scrumId).userEmail(e).build())
                                    .map(scrumMapper::toDTO)
                                    .flatMap(sm -> template
                                            .selectOne(query(where("email").is(e)), User.class)
                                            .flatMap(user -> {
                                                sm.setUsername(user.getUsername());
                                                sm.setUserId(user.getId());
                                                return Mono.just(sm);
                                            }));
                        })
                );
    }

    public Mono<Void> kickMember(String email, String scrumId) {
        return template.update(query(where("user_email").is(email)
                        .and("scrum_id").is(scrumId).and("finish_date").isNull()),
                update("finish_date", LocalDateTime.now()), ScrumMember.class).then(
                        template.selectOne(query(where("id").is(scrumId)), Scrum.class)
                                .flatMap(s -> template.selectOne(query(where("email").is(email)), User.class)
                                .flatMap(user -> template.update(query(where("executor_id").is(user.getId())
                                        .and("scrum_id").is(scrumId).and("status")
                                        .is(TaskStatus.InProgress)), update("status", TaskStatus.InBackLog)
                                        .set("executor_id", s.getCreatorId()), Task.class).then()))
        );
    }

}
