package com.tyuiu.backend.models.mappers;

import com.tyuiu.backend.models.dto.ScrumDTO;
import com.tyuiu.backend.models.dto.ScrumMemberDTO;
import com.tyuiu.backend.models.dto.TaskDTO;
import com.tyuiu.backend.models.dto.TaskTagDTO;
import com.tyuiu.backend.models.entities.Scrum;
import com.tyuiu.backend.models.entities.ScrumMember;
import com.tyuiu.backend.models.entities.Task;
import com.tyuiu.backend.models.entities.TaskTag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValueIterableMappingStrategy = NullValueMappingStrategy.RETURN_NULL)

public interface TaskMapper {
    TaskDTO toDTO (Task task);
    @Mapping(target = "id", ignore = true)
    Task toEntity (TaskDTO taskDTO);

    TaskTagDTO toDTO(TaskTag taskTag);

    @Mapping(target = "id", ignore = true)
    TaskTag toEntity(TaskTagDTO taskTagDTO);
}
