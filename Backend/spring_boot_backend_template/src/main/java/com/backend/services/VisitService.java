package com.backend.services;

import com.backend.dto.*;

public interface VisitService {
    VisitResponseDTO scheduleVisit(VisitRequestDTO dto);
    void cancelVisit(Long visitId);
}
