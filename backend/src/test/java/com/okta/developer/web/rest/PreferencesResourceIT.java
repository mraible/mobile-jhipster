package com.okta.developer.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.okta.developer.IntegrationTest;
import com.okta.developer.domain.Preferences;
import com.okta.developer.domain.enumeration.Units;
import com.okta.developer.repository.PreferencesRepository;
import com.okta.developer.service.EntityManager;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link PreferencesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class PreferencesResourceIT {

    private static final Integer DEFAULT_WEEKLY_GOAL = 10;
    private static final Integer UPDATED_WEEKLY_GOAL = 11;

    private static final Units DEFAULT_WEIGHT_UNITS = Units.KG;
    private static final Units UPDATED_WEIGHT_UNITS = Units.LB;

    private static final String ENTITY_API_URL = "/api/preferences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PreferencesRepository preferencesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Preferences preferences;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createEntity(EntityManager em) {
        Preferences preferences = new Preferences().weeklyGoal(DEFAULT_WEEKLY_GOAL).weightUnits(DEFAULT_WEIGHT_UNITS);
        return preferences;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Preferences createUpdatedEntity(EntityManager em) {
        Preferences preferences = new Preferences().weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);
        return preferences;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Preferences.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void setupCsrf() {
        webTestClient = webTestClient.mutateWith(csrf());
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        preferences = createEntity(em);
    }

    @Test
    void createPreferences() throws Exception {
        int databaseSizeBeforeCreate = preferencesRepository.findAll().collectList().block().size();
        // Create the Preferences
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate + 1);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(DEFAULT_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(DEFAULT_WEIGHT_UNITS);
    }

    @Test
    void createPreferencesWithExistingId() throws Exception {
        // Create the Preferences with an existing ID
        preferences.setId(1L);

        int databaseSizeBeforeCreate = preferencesRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkWeeklyGoalIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().collectList().block().size();
        // set the field null
        preferences.setWeeklyGoal(null);

        // Create the Preferences, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkWeightUnitsIsRequired() throws Exception {
        int databaseSizeBeforeTest = preferencesRepository.findAll().collectList().block().size();
        // set the field null
        preferences.setWeightUnits(null);

        // Create the Preferences, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPreferencesAsStream() {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        List<Preferences> preferencesList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Preferences.class)
            .getResponseBody()
            .filter(preferences::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(preferencesList).isNotNull();
        assertThat(preferencesList).hasSize(1);
        Preferences testPreferences = preferencesList.get(0);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(DEFAULT_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(DEFAULT_WEIGHT_UNITS);
    }

    @Test
    void getAllPreferences() {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        // Get all the preferencesList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(preferences.getId().intValue()))
            .jsonPath("$.[*].weeklyGoal")
            .value(hasItem(DEFAULT_WEEKLY_GOAL))
            .jsonPath("$.[*].weightUnits")
            .value(hasItem(DEFAULT_WEIGHT_UNITS.toString()));
    }

    @Test
    void getPreferences() {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        // Get the preferences
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, preferences.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(preferences.getId().intValue()))
            .jsonPath("$.weeklyGoal")
            .value(is(DEFAULT_WEEKLY_GOAL))
            .jsonPath("$.weightUnits")
            .value(is(DEFAULT_WEIGHT_UNITS.toString()));
    }

    @Test
    void getNonExistingPreferences() {
        // Get the preferences
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewPreferences() throws Exception {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();

        // Update the preferences
        Preferences updatedPreferences = preferencesRepository.findById(preferences.getId()).block();
        updatedPreferences.weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPreferences.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPreferences))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(UPDATED_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(UPDATED_WEIGHT_UNITS);
    }

    @Test
    void putNonExistingPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();
        preferences.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, preferences.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();
        preferences.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();
        preferences.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePreferencesWithPatch() throws Exception {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();

        // Update the preferences using partial update
        Preferences partialUpdatedPreferences = new Preferences();
        partialUpdatedPreferences.setId(preferences.getId());

        partialUpdatedPreferences.weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPreferences.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPreferences))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(UPDATED_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(UPDATED_WEIGHT_UNITS);
    }

    @Test
    void fullUpdatePreferencesWithPatch() throws Exception {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();

        // Update the preferences using partial update
        Preferences partialUpdatedPreferences = new Preferences();
        partialUpdatedPreferences.setId(preferences.getId());

        partialUpdatedPreferences.weeklyGoal(UPDATED_WEEKLY_GOAL).weightUnits(UPDATED_WEIGHT_UNITS);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPreferences.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPreferences))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
        Preferences testPreferences = preferencesList.get(preferencesList.size() - 1);
        assertThat(testPreferences.getWeeklyGoal()).isEqualTo(UPDATED_WEEKLY_GOAL);
        assertThat(testPreferences.getWeightUnits()).isEqualTo(UPDATED_WEIGHT_UNITS);
    }

    @Test
    void patchNonExistingPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();
        preferences.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, preferences.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();
        preferences.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPreferences() throws Exception {
        int databaseSizeBeforeUpdate = preferencesRepository.findAll().collectList().block().size();
        preferences.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(preferences))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Preferences in the database
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePreferences() {
        // Initialize the database
        preferencesRepository.save(preferences).block();

        int databaseSizeBeforeDelete = preferencesRepository.findAll().collectList().block().size();

        // Delete the preferences
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, preferences.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Preferences> preferencesList = preferencesRepository.findAll().collectList().block();
        assertThat(preferencesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
