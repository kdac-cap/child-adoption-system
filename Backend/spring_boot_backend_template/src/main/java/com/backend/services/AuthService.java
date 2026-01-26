package com.backend.services;

import com.backend.dto.*;

import java.util.Map;

public interface AuthService {

    ApiResponse register(RegisterRequestDTO dto);

    ApiResponse registerChildWelfare(ChildWelfareRegisterRequestDTO dto);

    Map<String, Object> login(LoginRequestDTO dto);
}
