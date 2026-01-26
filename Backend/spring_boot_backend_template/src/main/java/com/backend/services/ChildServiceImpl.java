package com.backend.services;

import com.backend.dto.ChildRequestDTO;
import com.backend.dto.ChildResponseDTO;
import com.backend.entities.Child;
import com.backend.entities.ChildStatus;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.daos.ChildRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChildServiceImpl implements ChildService {

    private final ChildRepository repository;

    @Override
    public List<ChildResponseDTO> getAllChildren() {
        return repository.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public List<ChildResponseDTO> getChildrenByStatus(ChildStatus status) {
        return repository.findByStatus(status).stream().map(this::mapToDto).toList();
    }

    @Override
    public ChildResponseDTO getChildById(Long id) {
        return mapToDto(findChild(id));
    }

    @Override
    public ChildResponseDTO addChild(ChildRequestDTO request, String addedBy) {
        Child child = new Child();
        child.setName(request.getName());
        child.setAge(request.getAge());
        child.setGender(request.getGender());
        child.setDescription(request.getDescription());
        child.setHealthReport(request.getHealthReport());
        child.setFosterHistory(request.getFosterHistory());

        // ✅ MINIMAL: store filename only
        if (request.getPhoto() != null && !request.getPhoto().isEmpty()) {
            child.setPhoto(request.getPhoto().getOriginalFilename());
        }

        child.setAddedBy(addedBy);

        return mapToDto(repository.save(child));
    }

    @Override
    public ChildResponseDTO updateChild(Long id, ChildRequestDTO request) {
        Child child = findChild(id);

        child.setName(request.getName());
        child.setAge(request.getAge());
        child.setGender(request.getGender());
        child.setDescription(request.getDescription());
        child.setHealthReport(request.getHealthReport());
        child.setFosterHistory(request.getFosterHistory());

        if (request.getPhoto() != null && !request.getPhoto().isEmpty()) {
            child.setPhoto(request.getPhoto().getOriginalFilename());
        }

        return mapToDto(repository.save(child));
    }

    @Override
    public void deleteChild(Long id) {
        repository.delete(findChild(id));
    }

    @Override
    public ChildResponseDTO updateStatus(Long id, ChildStatus status) {
        Child child = findChild(id);
        child.setStatus(status);
        return mapToDto(repository.save(child));
    }

    private Child findChild(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with id " + id));
    }

    private ChildResponseDTO mapToDto(Child child) {
        return new ChildResponseDTO(
                child.getId(),
                child.getName(),
                child.getAge(),
                child.getGender(),
                child.getStatus(),
                child.getPhoto(),
                child.getDescription(),
                child.getHealthReport(),
                child.getFosterHistory(),
                child.getAddedBy(),
                child.getAddedAt()
        );
    }
}
