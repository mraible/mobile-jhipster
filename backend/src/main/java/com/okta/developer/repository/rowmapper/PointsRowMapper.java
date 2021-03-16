package com.okta.developer.repository.rowmapper;

import com.okta.developer.domain.Points;
import com.okta.developer.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.time.LocalDate;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Points}, with proper type conversions.
 */
@Service
public class PointsRowMapper implements BiFunction<Row, String, Points> {

    private final ColumnConverter converter;

    public PointsRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Points} stored in the database.
     */
    @Override
    public Points apply(Row row, String prefix) {
        Points entity = new Points();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setDate(converter.fromRow(row, prefix + "_date", LocalDate.class));
        entity.setExercise(converter.fromRow(row, prefix + "_exercise", Integer.class));
        entity.setMeals(converter.fromRow(row, prefix + "_meals", Integer.class));
        entity.setAlcohol(converter.fromRow(row, prefix + "_alcohol", Integer.class));
        entity.setNotes(converter.fromRow(row, prefix + "_notes", String.class));
        entity.setUserId(converter.fromRow(row, prefix + "_user_id", String.class));
        return entity;
    }
}
