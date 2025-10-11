package com.tyuiu.backend.models.entities;

import com.tyuiu.backend.models.enums.ScrumStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scrum")
public class Scrum {
    @Id
    private String id;

    private String name;
    private ScrumStatus status;
    private String creatorId;

}
