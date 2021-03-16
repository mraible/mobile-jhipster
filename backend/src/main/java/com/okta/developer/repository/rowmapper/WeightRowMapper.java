package com.okta.developer.repository.rowmapper;

import com.okta.developer.domain.Weight;
import com.okta.developer.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Weight}, with proper type conversions.
 */
@Service
public class WeightRowMapper implements BiFunction<Row, String, Weight> {

    private final ColumnConverter converter;

    public WeightRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Weight} stored in the database.
     */
    @Override
    public Weight apply(Row row, String prefix) {
        Weight entity = new Weight();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setTimestamp(converter.fromRow(row, prefix + "_timestamp", ZonedDateTime.class));
        entity.setWeight(converter.fromRow(row, prefix + "_weight", Double.class));
        entity.setUserId(converter.fromRow(row, prefix + "_user_id", String.class));
        return entity;
    }
}
