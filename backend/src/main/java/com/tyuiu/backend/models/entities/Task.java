package com.tyuiu.backend.models.entities;

import com.tyuiu.backend.models.enums.TaskStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "task")
public class Task {
    @Id
    private String id;
    private String sprintId;
    private String scrumId;
    private String taskTagId;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String creatorId;
    private String executorId;
}
