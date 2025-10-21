package com.tyuiu.backend.models.dto;

import com.tyuiu.backend.models.enums.SprintStatus;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SprintDTO {
    private String id;
    private String scrumId;
    private String name;
    private String goal;
    private String report;
    private LocalDateTime startDate;
    private LocalDateTime finishDate;
    private SprintStatus status;
}
