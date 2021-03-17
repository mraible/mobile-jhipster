package com.okta.developer.repository;

import com.okta.developer.domain.Points;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Points entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointsRepository extends R2dbcRepository<Points, Long>, PointsRepositoryInternal {
    Flux<Points> findAllBy(Pageable pageable);

    @Query("SELECT * FROM points entity WHERE entity.user_id = :id")
    Flux<Points> findByUser(Long id);

    @Query("SELECT * FROM points entity WHERE entity.user_id IS NULL")
    Flux<Points> findAllWhereUserIsNull();

    // just to avoid having unambigous methods
    @Override
    Flux<Points> findAll();

    @Override
    Mono<Points> findById(Long id);

    @Override
    <S extends Points> Mono<S> save(S entity);
}

interface PointsRepositoryInternal {
    <S extends Points> Mono<S> insert(S entity);
    <S extends Points> Mono<S> save(S entity);
    Mono<Integer> update(Points entity);

    Flux<Points> findAll();
    Mono<Points> findById(Long id);
    Flux<Points> findAllBy(Pageable pageable);
    Flux<Points> findAllBy(Pageable pageable, Criteria criteria);
}
