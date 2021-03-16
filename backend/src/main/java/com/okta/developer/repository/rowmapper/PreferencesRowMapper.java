package com.okta.developer.repository.rowmapper;

import com.okta.developer.domain.Preferences;
import com.okta.developer.domain.enumeration.Units;
import com.okta.developer.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Preferences}, with proper type conversions.
 */
@Service
public class PreferencesRowMapper implements BiFunction<Row, String, Preferences> {

    private final ColumnConverter converter;

    public PreferencesRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Preferences} stored in the database.
     */
    @Override
    public Preferences apply(Row row, String prefix) {
        Preferences entity = new Preferences();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setWeeklyGoal(converter.fromRow(row, prefix + "_weekly_goal", Integer.class));
        entity.setWeightUnits(converter.fromRow(row, prefix + "_weight_units", Units.class));
        entity.setUserId(converter.fromRow(row, prefix + "_user_id", String.class));
        return entity;
    }
}
