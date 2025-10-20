package com.tyuiu.backend.models.mappers;

import com.tyuiu.backend.models.dto.BoardDTO;
import com.tyuiu.backend.models.entities.Board;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValueIterableMappingStrategy = NullValueMappingStrategy.RETURN_NULL)
public interface BoardMapper {
    BoardDTO toDTO (Board board);
    @Mapping(target = "id", ignore = true)
    Board toEntity (BoardDTO boardDTO);
}

