package com.okta.developer.repository;

import com.okta.developer.domain.Weight;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Weight entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeightRepository extends R2dbcRepository<Weight, Long>, WeightRepositoryInternal {
    Flux<Weight> findAllBy(Pageable pageable);

    @Query("SELECT * FROM weight entity WHERE entity.user_id = :id")
    Flux<Weight> findByUser(Long id);

    @Query("SELECT * FROM weight entity WHERE entity.user_id IS NULL")
    Flux<Weight> findAllWhereUserIsNull();

    // just to avoid having unambigous methods
    @Override
    Flux<Weight> findAll();

    @Override
    Mono<Weight> findById(Long id);

    @Override
    <S extends Weight> Mono<S> save(S entity);
}

interface WeightRepositoryInternal {
    <S extends Weight> Mono<S> insert(S entity);
    <S extends Weight> Mono<S> save(S entity);
    Mono<Integer> update(Weight entity);

    Flux<Weight> findAll();
    Mono<Weight> findById(Long id);
    Flux<Weight> findAllBy(Pageable pageable);
    Flux<Weight> findAllBy(Pageable pageable, Criteria criteria);
}
