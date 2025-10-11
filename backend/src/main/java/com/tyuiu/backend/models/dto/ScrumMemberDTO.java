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
    private String userEmail;
    private String userFullName;
    private String scrumRole;
    private LocalDateTime startDate;
    private LocalDateTime finishDate;
}
