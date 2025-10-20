package com.tyuiu.backend.models.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scrum")
public class Board {
    @Id
    private String id;
    private String sprintId;

    private String title;
}
