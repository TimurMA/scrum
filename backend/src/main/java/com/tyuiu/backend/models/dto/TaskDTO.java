package com.tyuiu.backend.models.dto;

import com.tyuiu.backend.models.enums.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private String id;
    private String boardId;
    private String scrumId;
    private TaskTagDTO taskTag;
    private String taskTagId;
    private String title;
    private LocalDateTime createdAt;
    private String description;
    private TaskStatus status;
    private UserDTO creator;
    private String creatorId;
    private UserDTO executor;
    private String executorId;
}
