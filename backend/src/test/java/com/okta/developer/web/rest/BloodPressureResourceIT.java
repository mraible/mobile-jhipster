package com.okta.developer.web.rest;

import static com.okta.developer.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.okta.developer.IntegrationTest;
import com.okta.developer.domain.BloodPressure;
import com.okta.developer.repository.BloodPressureRepository;
import com.okta.developer.service.EntityManager;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link BloodPressureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class BloodPressureResourceIT {

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    private static final String ENTITY_API_URL = "/api/blood-pressures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BloodPressureRepository bloodPressureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private BloodPressure bloodPressure;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BloodPressure createEntity(EntityManager em) {
        BloodPressure bloodPressure = new BloodPressure()
            .timestamp(DEFAULT_TIMESTAMP)
            .systolic(DEFAULT_SYSTOLIC)
            .diastolic(DEFAULT_DIASTOLIC);
        return bloodPressure;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BloodPressure createUpdatedEntity(EntityManager em) {
        BloodPressure bloodPressure = new BloodPressure()
            .timestamp(UPDATED_TIMESTAMP)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);
        return bloodPressure;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(BloodPressure.class).block();
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
        bloodPressure = createEntity(em);
    }

    @Test
    void createBloodPressure() throws Exception {
        int databaseSizeBeforeCreate = bloodPressureRepository.findAll().collectList().block().size();
        // Create the BloodPressure
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeCreate + 1);
        BloodPressure testBloodPressure = bloodPressureList.get(bloodPressureList.size() - 1);
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(DEFAULT_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);
    }

    @Test
    void createBloodPressureWithExistingId() throws Exception {
        // Create the BloodPressure with an existing ID
        bloodPressure.setId(1L);

        int databaseSizeBeforeCreate = bloodPressureRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().collectList().block().size();
        // set the field null
        bloodPressure.setTimestamp(null);

        // Create the BloodPressure, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkSystolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().collectList().block().size();
        // set the field null
        bloodPressure.setSystolic(null);

        // Create the BloodPressure, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkDiastolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressureRepository.findAll().collectList().block().size();
        // set the field null
        bloodPressure.setDiastolic(null);

        // Create the BloodPressure, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllBloodPressures() {
        // Initialize the database
        bloodPressureRepository.save(bloodPressure).block();

        // Get all the bloodPressureList
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
            .value(hasItem(bloodPressure.getId().intValue()))
            .jsonPath("$.[*].timestamp")
            .value(hasItem(sameInstant(DEFAULT_TIMESTAMP)))
            .jsonPath("$.[*].systolic")
            .value(hasItem(DEFAULT_SYSTOLIC))
            .jsonPath("$.[*].diastolic")
            .value(hasItem(DEFAULT_DIASTOLIC));
    }

    @Test
    void getBloodPressure() {
        // Initialize the database
        bloodPressureRepository.save(bloodPressure).block();

        // Get the bloodPressure
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, bloodPressure.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(bloodPressure.getId().intValue()))
            .jsonPath("$.timestamp")
            .value(is(sameInstant(DEFAULT_TIMESTAMP)))
            .jsonPath("$.systolic")
            .value(is(DEFAULT_SYSTOLIC))
            .jsonPath("$.diastolic")
            .value(is(DEFAULT_DIASTOLIC));
    }

    @Test
    void getNonExistingBloodPressure() {
        // Get the bloodPressure
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewBloodPressure() throws Exception {
        // Initialize the database
        bloodPressureRepository.save(bloodPressure).block();

        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();

        // Update the bloodPressure
        BloodPressure updatedBloodPressure = bloodPressureRepository.findById(bloodPressure.getId()).block();
        updatedBloodPressure.timestamp(UPDATED_TIMESTAMP).systolic(UPDATED_SYSTOLIC).diastolic(UPDATED_DIASTOLIC);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedBloodPressure.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedBloodPressure))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
        BloodPressure testBloodPressure = bloodPressureList.get(bloodPressureList.size() - 1);
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);
    }

    @Test
    void putNonExistingBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();
        bloodPressure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, bloodPressure.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();
        bloodPressure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();
        bloodPressure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateBloodPressureWithPatch() throws Exception {
        // Initialize the database
        bloodPressureRepository.save(bloodPressure).block();

        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();

        // Update the bloodPressure using partial update
        BloodPressure partialUpdatedBloodPressure = new BloodPressure();
        partialUpdatedBloodPressure.setId(bloodPressure.getId());

        partialUpdatedBloodPressure.timestamp(UPDATED_TIMESTAMP).systolic(UPDATED_SYSTOLIC);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBloodPressure.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBloodPressure))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
        BloodPressure testBloodPressure = bloodPressureList.get(bloodPressureList.size() - 1);
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);
    }

    @Test
    void fullUpdateBloodPressureWithPatch() throws Exception {
        // Initialize the database
        bloodPressureRepository.save(bloodPressure).block();

        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();

        // Update the bloodPressure using partial update
        BloodPressure partialUpdatedBloodPressure = new BloodPressure();
        partialUpdatedBloodPressure.setId(bloodPressure.getId());

        partialUpdatedBloodPressure.timestamp(UPDATED_TIMESTAMP).systolic(UPDATED_SYSTOLIC).diastolic(UPDATED_DIASTOLIC);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBloodPressure.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBloodPressure))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
        BloodPressure testBloodPressure = bloodPressureList.get(bloodPressureList.size() - 1);
        assertThat(testBloodPressure.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodPressure.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodPressure.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);
    }

    @Test
    void patchNonExistingBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();
        bloodPressure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, bloodPressure.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();
        bloodPressure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamBloodPressure() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressureRepository.findAll().collectList().block().size();
        bloodPressure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(bloodPressure))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the BloodPressure in the database
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteBloodPressure() {
        // Initialize the database
        bloodPressureRepository.save(bloodPressure).block();

        int databaseSizeBeforeDelete = bloodPressureRepository.findAll().collectList().block().size();

        // Delete the bloodPressure
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, bloodPressure.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<BloodPressure> bloodPressureList = bloodPressureRepository.findAll().collectList().block();
        assertThat(bloodPressureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
