package com.okta.developer.web.rest;

import com.okta.developer.domain.BloodPressure;
import com.okta.developer.repository.BloodPressureRepository;
import com.okta.developer.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.okta.developer.domain.BloodPressure}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BloodPressureResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressureResource.class);

    private static final String ENTITY_NAME = "bloodPressure";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BloodPressureRepository bloodPressureRepository;

    public BloodPressureResource(BloodPressureRepository bloodPressureRepository) {
        this.bloodPressureRepository = bloodPressureRepository;
    }

    /**
     * {@code POST  /blood-pressures} : Create a new bloodPressure.
     *
     * @param bloodPressure the bloodPressure to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bloodPressure, or with status {@code 400 (Bad Request)} if the bloodPressure has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/blood-pressures")
    public Mono<ResponseEntity<BloodPressure>> createBloodPressure(@Valid @RequestBody BloodPressure bloodPressure)
        throws URISyntaxException {
        log.debug("REST request to save BloodPressure : {}", bloodPressure);
        if (bloodPressure.getId() != null) {
            throw new BadRequestAlertException("A new bloodPressure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return bloodPressureRepository
            .save(bloodPressure)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/blood-pressures/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /blood-pressures/:id} : Updates an existing bloodPressure.
     *
     * @param id the id of the bloodPressure to save.
     * @param bloodPressure the bloodPressure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloodPressure,
     * or with status {@code 400 (Bad Request)} if the bloodPressure is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bloodPressure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/blood-pressures/{id}")
    public Mono<ResponseEntity<BloodPressure>> updateBloodPressure(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BloodPressure bloodPressure
    ) throws URISyntaxException {
        log.debug("REST request to update BloodPressure : {}, {}", id, bloodPressure);
        if (bloodPressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloodPressure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return bloodPressureRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return bloodPressureRepository
                        .save(bloodPressure)
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            result ->
                                ResponseEntity
                                    .ok()
                                    .headers(
                                        HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
                                    )
                                    .body(result)
                        );
                }
            );
    }

    /**
     * {@code PATCH  /blood-pressures/:id} : Partial updates given fields of an existing bloodPressure, field will ignore if it is null
     *
     * @param id the id of the bloodPressure to save.
     * @param bloodPressure the bloodPressure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bloodPressure,
     * or with status {@code 400 (Bad Request)} if the bloodPressure is not valid,
     * or with status {@code 404 (Not Found)} if the bloodPressure is not found,
     * or with status {@code 500 (Internal Server Error)} if the bloodPressure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/blood-pressures/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<BloodPressure>> partialUpdateBloodPressure(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BloodPressure bloodPressure
    ) throws URISyntaxException {
        log.debug("REST request to partial update BloodPressure partially : {}, {}", id, bloodPressure);
        if (bloodPressure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bloodPressure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return bloodPressureRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<BloodPressure> result = bloodPressureRepository
                        .findById(bloodPressure.getId())
                        .map(
                            existingBloodPressure -> {
                                if (bloodPressure.getTimestamp() != null) {
                                    existingBloodPressure.setTimestamp(bloodPressure.getTimestamp());
                                }
                                if (bloodPressure.getSystolic() != null) {
                                    existingBloodPressure.setSystolic(bloodPressure.getSystolic());
                                }
                                if (bloodPressure.getDiastolic() != null) {
                                    existingBloodPressure.setDiastolic(bloodPressure.getDiastolic());
                                }

                                return existingBloodPressure;
                            }
                        )
                        .flatMap(bloodPressureRepository::save);

                    return result
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            res ->
                                ResponseEntity
                                    .ok()
                                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                                    .body(res)
                        );
                }
            );
    }

    /**
     * {@code GET  /blood-pressures} : get all the bloodPressures.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bloodPressures in body.
     */
    @GetMapping("/blood-pressures")
    public Mono<ResponseEntity<List<BloodPressure>>> getAllBloodPressures(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of BloodPressures");
        return bloodPressureRepository
            .count()
            .zipWith(bloodPressureRepository.findAllBy(pageable).collectList())
            .map(
                countWithEntities -> {
                    return ResponseEntity
                        .ok()
                        .headers(
                            PaginationUtil.generatePaginationHttpHeaders(
                                UriComponentsBuilder.fromHttpRequest(request),
                                new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                            )
                        )
                        .body(countWithEntities.getT2());
                }
            );
    }

    /**
     * {@code GET  /blood-pressures/:id} : get the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bloodPressure, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/blood-pressures/{id}")
    public Mono<ResponseEntity<BloodPressure>> getBloodPressure(@PathVariable Long id) {
        log.debug("REST request to get BloodPressure : {}", id);
        Mono<BloodPressure> bloodPressure = bloodPressureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bloodPressure);
    }

    /**
     * {@code DELETE  /blood-pressures/:id} : delete the "id" bloodPressure.
     *
     * @param id the id of the bloodPressure to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/blood-pressures/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteBloodPressure(@PathVariable Long id) {
        log.debug("REST request to delete BloodPressure : {}", id);
        return bloodPressureRepository
            .deleteById(id)
            .map(
                result ->
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
            );
    }
}
