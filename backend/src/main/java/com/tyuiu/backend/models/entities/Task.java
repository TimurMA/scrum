package com.tyuiu.backend.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sprint")
public class Task {
    @Id
    private String id;

    private String sprintId;
    private String scrumId;
    private String name;
    private String description;
    private String creatorId;
    private String executorId;
    private Integer workingHour;
}
