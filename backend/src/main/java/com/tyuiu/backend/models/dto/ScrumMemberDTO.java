package com.tyuiu.backend.models.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScrumMemberDTO {
    private String scrumId;
    private String userId;
    private String userEmail;
    private String username;
    private LocalDateTime startDate;
    private LocalDateTime finishDate;
}
