package com.tyuiu.backend.controllers;

import com.tyuiu.backend.models.dto.ScrumDTO;
import com.tyuiu.backend.models.dto.ScrumMemberDTO;
import com.tyuiu.backend.models.entities.User;
import com.tyuiu.backend.services.ScrumMemberService;
import com.tyuiu.backend.services.ScrumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/scrum")
@RequiredArgsConstructor
@Tag(name = "Контроллер управления скрамом")
public class ScrumController {

    private final ScrumService scrumService;
    private final ScrumMemberService scrumMemberService;

    @GetMapping("/all")
    @Operation(summary = "Получение всех скрамов")
    public Flux<ScrumDTO> getAllScrums() {
        return scrumService.getAllScrums();
    }

    @GetMapping("/user")
    @Operation(summary = "Получение всех скрамов пользователя")
    public Flux<ScrumDTO> getAllScrums(@AuthenticationPrincipal User user){
        return scrumService.getAllScrums(user.getEmail());
    }

    @GetMapping("/creator")
    @Operation(summary = "Получение скарам досок создателя")
    public Flux<ScrumDTO> getCreatorScrums(@AuthenticationPrincipal User user){
        return scrumService.getScrumsByCreatorId(user.getId());
    }


    @GetMapping("/{scrumId}")
    @Operation(summary = "Получение скарама по id")
    public Mono<ScrumDTO> getScrumById(@PathVariable String scrumId){
        return scrumService.getById(scrumId);
    }

    @GetMapping("/members/{scrumId}")
    @Operation(summary = "Получение участников скрама")
    public Flux<ScrumMemberDTO> getScrumMembersByScrumId(@PathVariable String scrumId) {
        return scrumMemberService.getAllMembers(scrumId);
    }

    @PostMapping("/members/add/{scrumId}")
    @Operation(summary = "Добавление пользователей")
    public Flux<ScrumMemberDTO> addMembers(@RequestBody Flux<String> emails, @PathVariable String scrumId) {
        return scrumMemberService.addMembers(emails, scrumId);
    }

    @PostMapping("/create")
    @Operation(summary = "Создание скрама")
    public Mono<ScrumDTO> createScrum(@RequestBody ScrumDTO scrumDTO,
                                      @AuthenticationPrincipal User user) {
        return scrumService.createScrum(scrumDTO, user.getEmail());
    }

    @PutMapping("/members/kick/{scrumId}")
    @Operation(summary = "Удаление пользователя")
    public Mono<Void> addMembers(@RequestBody String email, @PathVariable String scrumId) {
        return scrumMemberService.kickMember(email, scrumId);
    }

    @DeleteMapping("/delete/{scrumId}")
    @Operation(summary = "Удаление скрама")
    public Mono<Void> deleteScrum(@PathVariable String scrumId,
                                  @AuthenticationPrincipal User user) {
        return scrumService.deleteScrum(scrumId, user.getId());
    }

}
