package com.okta.developer.repository.rowmapper;

import com.okta.developer.domain.BloodPressure;
import com.okta.developer.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link BloodPressure}, with proper type conversions.
 */
@Service
public class BloodPressureRowMapper implements BiFunction<Row, String, BloodPressure> {

    private final ColumnConverter converter;

    public BloodPressureRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link BloodPressure} stored in the database.
     */
    @Override
    public BloodPressure apply(Row row, String prefix) {
        BloodPressure entity = new BloodPressure();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setTimestamp(converter.fromRow(row, prefix + "_timestamp", ZonedDateTime.class));
        entity.setSystolic(converter.fromRow(row, prefix + "_systolic", Integer.class));
        entity.setDiastolic(converter.fromRow(row, prefix + "_diastolic", Integer.class));
        entity.setUserId(converter.fromRow(row, prefix + "_user_id", String.class));
        return entity;
    }
}
