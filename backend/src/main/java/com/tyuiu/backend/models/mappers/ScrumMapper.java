package com.tyuiu.backend.models.mappers;

import com.tyuiu.backend.models.dto.ScrumDTO;
import com.tyuiu.backend.models.dto.ScrumMemberDTO;
import com.tyuiu.backend.models.entities.Scrum;
import com.tyuiu.backend.models.entities.ScrumMember;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValueIterableMappingStrategy = NullValueMappingStrategy.RETURN_NULL)
public interface ScrumMapper {
    ScrumDTO toDTO (Scrum scrum);
    @Mapping(target = "id", ignore = true)
    Scrum toEntity (ScrumDTO scrumDTO);

    ScrumMemberDTO toDTO(ScrumMember scrumMember);

    @Mapping(target = "id", ignore = true)
    ScrumMember toEntity(ScrumMemberDTO scrumMemberDTO);

}
