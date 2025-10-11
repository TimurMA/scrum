package com.tyuiu.backend.models.entities;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "task_tag")
public class TaskTag {
    @Id
    private String id;

    private String name;
    private String color;
    private String scrumId;
}
