package com.tyuiu.backend.models.entities;

import com.tyuiu.backend.models.enums.SprintStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sprint")
public class Sprint {
    @Id
    private String id;
    private String scrumId;
    private String name;
    private String goal;
    private String report;
    private LocalDateTime startDate;
    private LocalDateTime finishDate;
    private SprintStatus status;

}
