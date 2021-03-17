package com.okta.developer.web.rest;

import com.okta.developer.domain.Weight;
import com.okta.developer.repository.WeightRepository;
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
 * REST controller for managing {@link com.okta.developer.domain.Weight}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WeightResource {

    private final Logger log = LoggerFactory.getLogger(WeightResource.class);

    private static final String ENTITY_NAME = "weight";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WeightRepository weightRepository;

    public WeightResource(WeightRepository weightRepository) {
        this.weightRepository = weightRepository;
    }

    /**
     * {@code POST  /weights} : Create a new weight.
     *
     * @param weight the weight to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new weight, or with status {@code 400 (Bad Request)} if the weight has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/weights")
    public Mono<ResponseEntity<Weight>> createWeight(@Valid @RequestBody Weight weight) throws URISyntaxException {
        log.debug("REST request to save Weight : {}", weight);
        if (weight.getId() != null) {
            throw new BadRequestAlertException("A new weight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return weightRepository
            .save(weight)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/weights/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /weights/:id} : Updates an existing weight.
     *
     * @param id the id of the weight to save.
     * @param weight the weight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weight,
     * or with status {@code 400 (Bad Request)} if the weight is not valid,
     * or with status {@code 500 (Internal Server Error)} if the weight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/weights/{id}")
    public Mono<ResponseEntity<Weight>> updateWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Weight weight
    ) throws URISyntaxException {
        log.debug("REST request to update Weight : {}, {}", id, weight);
        if (weight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, weight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return weightRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return weightRepository
                        .save(weight)
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
     * {@code PATCH  /weights/:id} : Partial updates given fields of an existing weight, field will ignore if it is null
     *
     * @param id the id of the weight to save.
     * @param weight the weight to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated weight,
     * or with status {@code 400 (Bad Request)} if the weight is not valid,
     * or with status {@code 404 (Not Found)} if the weight is not found,
     * or with status {@code 500 (Internal Server Error)} if the weight couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/weights/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<Weight>> partialUpdateWeight(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Weight weight
    ) throws URISyntaxException {
        log.debug("REST request to partial update Weight partially : {}, {}", id, weight);
        if (weight.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, weight.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return weightRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<Weight> result = weightRepository
                        .findById(weight.getId())
                        .map(
                            existingWeight -> {
                                if (weight.getTimestamp() != null) {
                                    existingWeight.setTimestamp(weight.getTimestamp());
                                }
                                if (weight.getWeight() != null) {
                                    existingWeight.setWeight(weight.getWeight());
                                }

                                return existingWeight;
                            }
                        )
                        .flatMap(weightRepository::save);

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
     * {@code GET  /weights} : get all the weights.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of weights in body.
     */
    @GetMapping("/weights")
    public Mono<ResponseEntity<List<Weight>>> getAllWeights(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of Weights");
        return weightRepository
            .count()
            .zipWith(weightRepository.findAllBy(pageable).collectList())
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
     * {@code GET  /weights/:id} : get the "id" weight.
     *
     * @param id the id of the weight to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the weight, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/weights/{id}")
    public Mono<ResponseEntity<Weight>> getWeight(@PathVariable Long id) {
        log.debug("REST request to get Weight : {}", id);
        Mono<Weight> weight = weightRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(weight);
    }

    /**
     * {@code DELETE  /weights/:id} : delete the "id" weight.
     *
     * @param id the id of the weight to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/weights/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteWeight(@PathVariable Long id) {
        log.debug("REST request to delete Weight : {}", id);
        return weightRepository
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
