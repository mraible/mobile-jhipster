package com.okta.developer.web.rest;

import static com.okta.developer.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.okta.developer.IntegrationTest;
import com.okta.developer.domain.Weight;
import com.okta.developer.repository.WeightRepository;
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
 * Integration tests for the {@link WeightResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class WeightResourceIT {

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    private static final String ENTITY_API_URL = "/api/weights";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WeightRepository weightRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Weight weight;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Weight createEntity(EntityManager em) {
        Weight weight = new Weight().timestamp(DEFAULT_TIMESTAMP).weight(DEFAULT_WEIGHT);
        return weight;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Weight createUpdatedEntity(EntityManager em) {
        Weight weight = new Weight().timestamp(UPDATED_TIMESTAMP).weight(UPDATED_WEIGHT);
        return weight;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Weight.class).block();
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
        weight = createEntity(em);
    }

    @Test
    void createWeight() throws Exception {
        int databaseSizeBeforeCreate = weightRepository.findAll().collectList().block().size();
        // Create the Weight
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeCreate + 1);
        Weight testWeight = weightList.get(weightList.size() - 1);
        assertThat(testWeight.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
    }

    @Test
    void createWeightWithExistingId() throws Exception {
        // Create the Weight with an existing ID
        weight.setId(1L);

        int databaseSizeBeforeCreate = weightRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = weightRepository.findAll().collectList().block().size();
        // set the field null
        weight.setTimestamp(null);

        // Create the Weight, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkWeightIsRequired() throws Exception {
        int databaseSizeBeforeTest = weightRepository.findAll().collectList().block().size();
        // set the field null
        weight.setWeight(null);

        // Create the Weight, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllWeights() {
        // Initialize the database
        weightRepository.save(weight).block();

        // Get all the weightList
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
            .value(hasItem(weight.getId().intValue()))
            .jsonPath("$.[*].timestamp")
            .value(hasItem(sameInstant(DEFAULT_TIMESTAMP)))
            .jsonPath("$.[*].weight")
            .value(hasItem(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    void getWeight() {
        // Initialize the database
        weightRepository.save(weight).block();

        // Get the weight
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, weight.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(weight.getId().intValue()))
            .jsonPath("$.timestamp")
            .value(is(sameInstant(DEFAULT_TIMESTAMP)))
            .jsonPath("$.weight")
            .value(is(DEFAULT_WEIGHT.doubleValue()));
    }

    @Test
    void getNonExistingWeight() {
        // Get the weight
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewWeight() throws Exception {
        // Initialize the database
        weightRepository.save(weight).block();

        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();

        // Update the weight
        Weight updatedWeight = weightRepository.findById(weight.getId()).block();
        updatedWeight.timestamp(UPDATED_TIMESTAMP).weight(UPDATED_WEIGHT);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedWeight.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedWeight))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
        Weight testWeight = weightList.get(weightList.size() - 1);
        assertThat(testWeight.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
    }

    @Test
    void putNonExistingWeight() throws Exception {
        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();
        weight.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, weight.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchWeight() throws Exception {
        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();
        weight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamWeight() throws Exception {
        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();
        weight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateWeightWithPatch() throws Exception {
        // Initialize the database
        weightRepository.save(weight).block();

        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();

        // Update the weight using partial update
        Weight partialUpdatedWeight = new Weight();
        partialUpdatedWeight.setId(weight.getId());

        partialUpdatedWeight.timestamp(UPDATED_TIMESTAMP);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedWeight.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedWeight))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
        Weight testWeight = weightList.get(weightList.size() - 1);
        assertThat(testWeight.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testWeight.getWeight()).isEqualTo(DEFAULT_WEIGHT);
    }

    @Test
    void fullUpdateWeightWithPatch() throws Exception {
        // Initialize the database
        weightRepository.save(weight).block();

        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();

        // Update the weight using partial update
        Weight partialUpdatedWeight = new Weight();
        partialUpdatedWeight.setId(weight.getId());

        partialUpdatedWeight.timestamp(UPDATED_TIMESTAMP).weight(UPDATED_WEIGHT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedWeight.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedWeight))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
        Weight testWeight = weightList.get(weightList.size() - 1);
        assertThat(testWeight.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testWeight.getWeight()).isEqualTo(UPDATED_WEIGHT);
    }

    @Test
    void patchNonExistingWeight() throws Exception {
        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();
        weight.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, weight.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchWeight() throws Exception {
        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();
        weight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamWeight() throws Exception {
        int databaseSizeBeforeUpdate = weightRepository.findAll().collectList().block().size();
        weight.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(weight))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Weight in the database
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteWeight() {
        // Initialize the database
        weightRepository.save(weight).block();

        int databaseSizeBeforeDelete = weightRepository.findAll().collectList().block().size();

        // Delete the weight
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, weight.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Weight> weightList = weightRepository.findAll().collectList().block();
        assertThat(weightList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
