package com.okta.developer.repository;

import com.okta.developer.domain.BloodPressure;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the BloodPressure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloodPressureRepository extends R2dbcRepository<BloodPressure, Long>, BloodPressureRepositoryInternal {
    Flux<BloodPressure> findAllBy(Pageable pageable);

    @Query("SELECT * FROM blood_pressure entity WHERE entity.user_id = :id")
    Flux<BloodPressure> findByUser(Long id);

    @Query("SELECT * FROM blood_pressure entity WHERE entity.user_id IS NULL")
    Flux<BloodPressure> findAllWhereUserIsNull();

    // just to avoid having unambigous methods
    @Override
    Flux<BloodPressure> findAll();

    @Override
    Mono<BloodPressure> findById(Long id);

    @Override
    <S extends BloodPressure> Mono<S> save(S entity);
}

interface BloodPressureRepositoryInternal {
    <S extends BloodPressure> Mono<S> insert(S entity);
    <S extends BloodPressure> Mono<S> save(S entity);
    Mono<Integer> update(BloodPressure entity);

    Flux<BloodPressure> findAll();
    Mono<BloodPressure> findById(Long id);
    Flux<BloodPressure> findAllBy(Pageable pageable);
    Flux<BloodPressure> findAllBy(Pageable pageable, Criteria criteria);
}
