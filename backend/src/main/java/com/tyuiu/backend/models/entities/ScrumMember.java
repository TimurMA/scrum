package com.tyuiu.backend.models.entities;

import lombok.*;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scrum_member")
public class ScrumMember {
    private String scrumId;
    private String userEmail;
    private LocalDateTime startDate = LocalDateTime.now();
    private LocalDateTime finishDate;
}
