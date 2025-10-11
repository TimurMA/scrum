package com.tyuiu.backend.models.mappers;

import com.tyuiu.backend.models.dto.SprintDTO;
import com.tyuiu.backend.models.dto.UserDTO;
import com.tyuiu.backend.models.entities.Sprint;
import com.tyuiu.backend.models.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValueIterableMappingStrategy = NullValueMappingStrategy.RETURN_NULL)
public interface UserMapper {
    UserDTO toDTO (User user);
    @Mapping(target = "id", ignore = true)
    User toEntity (UserDTO userDTO);
}
