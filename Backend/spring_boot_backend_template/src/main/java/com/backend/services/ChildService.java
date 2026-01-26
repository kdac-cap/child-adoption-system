package com.backend.services;

import com.backend.dto.ChildRequestDTO;
import com.backend.dto.ChildResponseDTO;
import com.backend.entities.ChildStatus;

import java.util.List;

public interface ChildService {

    List<ChildResponseDTO> getAllChildren();

    List<ChildResponseDTO> getChildrenByStatus(ChildStatus status);

    ChildResponseDTO getChildById(Long id);

    ChildResponseDTO addChild(ChildRequestDTO request, String addedBy);

    ChildResponseDTO updateChild(Long id, ChildRequestDTO request);

    void deleteChild(Long id);

    ChildResponseDTO updateStatus(Long id, ChildStatus status);
}
