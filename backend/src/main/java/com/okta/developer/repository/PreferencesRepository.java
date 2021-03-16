package com.okta.developer.repository;

import com.okta.developer.domain.Preferences;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Preferences entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PreferencesRepository extends R2dbcRepository<Preferences, Long>, PreferencesRepositoryInternal {
    @Query("SELECT * FROM preferences entity WHERE entity.user_id = :id")
    Flux<Preferences> findByUser(Long id);

    @Query("SELECT * FROM preferences entity WHERE entity.user_id IS NULL")
    Flux<Preferences> findAllWhereUserIsNull();

    // just to avoid having unambigous methods
    @Override
    Flux<Preferences> findAll();

    @Override
    Mono<Preferences> findById(Long id);

    @Override
    <S extends Preferences> Mono<S> save(S entity);
}

interface PreferencesRepositoryInternal {
    <S extends Preferences> Mono<S> insert(S entity);
    <S extends Preferences> Mono<S> save(S entity);
    Mono<Integer> update(Preferences entity);

    Flux<Preferences> findAll();
    Mono<Preferences> findById(Long id);
    Flux<Preferences> findAllBy(Pageable pageable);
    Flux<Preferences> findAllBy(Pageable pageable, Criteria criteria);
}
