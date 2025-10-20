package com.tyuiu.backend.services;

import com.tyuiu.backend.models.dto.BoardDTO;
import com.tyuiu.backend.models.entities.Board;
import com.tyuiu.backend.models.mappers.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import static org.springframework.data.relational.core.query.Query.query;
import static org.springframework.data.relational.core.query.Criteria.where;
@Service
@RequiredArgsConstructor
public class BoardService {
    private final R2dbcEntityTemplate template;
    private final BoardMapper boardMapper;

    public Mono<BoardDTO> addBoard(BoardDTO boardDTO){
        return template.insert(boardMapper.toEntity((boardDTO))).map(boardMapper::toDTO);
    }

    public Mono<Void> deleteBoard(String boardId){
        return template.delete(query(where("id").is(boardId)), Board.class).then();
    }
}
