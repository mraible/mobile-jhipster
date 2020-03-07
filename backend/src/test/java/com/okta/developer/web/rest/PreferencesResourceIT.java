package com.okta.developer.web.rest;

import com.okta.developer.HealthPointsApp;
import com.okta.developer.config.TestSecurityConfiguration;
import com.okta.developer.domain.Preferences;
import com.okta.developer.repository.PreferencesRepository;
import com.okta.developer.repository.search.PreferencesSearchRepository;
import com.okta.developer.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.okta.developer.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.okta.developer.domain.enumeration.Units;
/**
 * Integration tests for the {@link PreferencesResource} REST controller.
 */
@SpringBootTest(classes = {HealthPointsApp.class, TestSecurityConfiguration.class})
public class PreferencesResourceIT {

    private static final Integer DEFAULT_WEEKLY_GOAL = 10;
    private static final Integer UPDATED_WEEKLY_GOAL = 11;

    private static final Units DEFAULT_WEIGHT_UNITS = Units.KG;
    private static final Units UPDATED_WEIGHT_UNITS = Units.LB;

    @Autowired
    private PreferencesRepository preferencesRepository;

    /**
     * This repository is mocked in the com.okta.developer.repository.search test package.
     *
     * @see com.okta.developer.repository.search.PreferencesSearchRepositoryMockConfiguration
     */
    @Autowired
    private PreferencesSearchRepository mockPreferencesSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restPreferencesMockMvc;

    private Preferences preferences;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PreferencesResource preferencesResource = new PreferencesResource(preferencesRepository, mockPreferencesSearchRepository);
        this.restPreferencesMockMvc = MockMvcBuilders.standaloneSetup(preferencesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createEntity(EntityManager em) {
        Preferences preferences = new Preferences()
            .weeklyGoal(DEFAULT_WEEKLY_GOAL)
            .weightUnits(DEFAULT_WEIGHT_UNITS);
        return preferences;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createUpdatedEntity(EntityManager em) {
        Preferences preferences = new Preferences()
            .weeklyGoal(UPDATED_WEEKLY_GOAL)
            .weightUnits(UPDATED_WEIGHT_UNITS);
        return preferences;
    }

    @BeforeEach
    public void initTest() {
        preferences = createEntity(em);
    }

    @Test
    @Transactional
    public void createPreferences() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();

        // Create the Preferences
        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isCreated());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate + 1);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(DEFAULT_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(DEFAULT_WEIGHT_UNITS);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(1)).save(testPreferences);
    }

    @Test
    @Transactional
    public void createPreferencesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().size();

        // Create the Preferences with an existing ID
        preferences.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(0)).save(preferences);
    }


    @Test
    @Transactional
    public void checkWeeklyGoalIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeeklyGoal(null);

        // Create the Preferences, which fails.

        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWeightUnitsIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().size();
        // set the field null
        preferences.setWeightUnits(null);

        // Create the Preferences, which fails.

        restPreferencesMockMvc.perform(post("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get all the preferencesList
        restPreferencesMockMvc.perform(get("/api/preferences?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
            .andExpect(jsonPath("$.[*].weightUnits").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }
    
    @Test
    @Transactional
    public void getPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferences/{id}", preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(preferences.getId().intValue()))
            .andExpect(jsonPath("$.weeklyGoal").value(DEFAULT_WEEKLY_GOAL))
            .andExpect(jsonPath("$.weightUnits").value(DEFAULT_WEIGHT_UNITS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPreferences() throws Exception {
        // Get the preferences
        restPreferencesMockMvc.perform(get("/api/preferences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // Update the preferences
        Preferences updatedPreferences = preferencesRepository.findById(preferences.getId()).get();
        // Disconnect from session so that the updates on updatedPreferences are not directly saved in db
        em.detach(updatedPreferences);
        updatedPreferences
            .weeklyGoal(UPDATED_WEEKLY_GOAL)
            .weightUnits(UPDATED_WEIGHT_UNITS);

        restPreferencesMockMvc.perform(put("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPreferences)))
            .andExpect(status().isOk());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(UPDATED_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(UPDATED_WEIGHT_UNITS);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(1)).save(testPreferences);
    }

    @Test
    @Transactional
    public void updateNonExistingPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().size();

        // Create the Preferences

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPreferencesMockMvc.perform(put("/api/preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(preferences)))
            .andExpect(status().isBadRequest());

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(0)).save(preferences);
    }

    @Test
    @Transactional
    public void deletePreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);

        int databaseSizeBeforeDelete = preferencesRepository.findAll().size();

        // Delete the preferences
        restPreferencesMockMvc.perform(delete("/api/preferences/{id}", preferences.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Preferences> preferencesList = preferencesRepository.findAll();
        assertThat(preferencesList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Preferences in Elasticsearch
        verify(mockPreferencesSearchRepository, times(1)).deleteById(preferences.getId());
    }

    @Test
    @Transactional
    public void searchPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.saveAndFlush(preferences);
        when(mockPreferencesSearchRepository.search(queryStringQuery("id:" + preferences.getId())))
            .thenReturn(Collections.singletonList(preferences));
        // Search the preferences
        restPreferencesMockMvc.perform(get("/api/_search/preferences?query=id:" + preferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(preferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].weeklyGoal").value(hasItem(DEFAULT_WEEKLY_GOAL)))
            .andExpect(jsonPath("$.[*].weightUnits").value(hasItem(DEFAULT_WEIGHT_UNITS.toString())));
    }
}
