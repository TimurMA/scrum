package com.tyuiu.backend.models.dto;

import com.tyuiu.backend.models.enums.ScrumStatus;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScrumDTO {
    private String id;

    private String name;
    private ScrumStatus status;
    private String creatorId;
}
