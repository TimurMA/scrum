package com.tyuiu.backend.models.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardDTO {
    private String id;
    private String sprintId;

    private String title;
}
