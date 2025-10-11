package com.tyuiu.backend.models.mappers;

import com.tyuiu.backend.models.dto.ScrumDTO;
import com.tyuiu.backend.models.dto.SprintDTO;
import com.tyuiu.backend.models.entities.Scrum;
import com.tyuiu.backend.models.entities.Sprint;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValueIterableMappingStrategy = NullValueMappingStrategy.RETURN_NULL)
public interface SprintMapper {
    SprintDTO toDTO (Sprint sprint);
    @Mapping(target = "id", ignore = true)
    Sprint toEntity (SprintDTO sprintDTO);
}
