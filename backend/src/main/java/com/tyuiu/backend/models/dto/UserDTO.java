package com.tyuiu.backend.models.dto;

import com.tyuiu.backend.models.enums.Role;

import java.util.List;

public class UserDTO {
    private String id;

    private String email;
    private String fullName;
    private String password;
    private List<Role> roles;
}
