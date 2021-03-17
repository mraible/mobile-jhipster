package com.okta.developer.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.okta.developer.IntegrationTest;
import com.okta.developer.domain.Points;
import com.okta.developer.repository.PointsRepository;
import com.okta.developer.service.EntityManager;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link PointsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class PointsResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_EXERCISE = 1;
    private static final Integer UPDATED_EXERCISE = 2;

    private static final Integer DEFAULT_MEALS = 1;
    private static final Integer UPDATED_MEALS = 2;

    private static final Integer DEFAULT_ALCOHOL = 1;
    private static final Integer UPDATED_ALCOHOL = 2;

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/points";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PointsRepository pointsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Points points;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Points createEntity(EntityManager em) {
        Points points = new Points()
            .date(DEFAULT_DATE)
            .exercise(DEFAULT_EXERCISE)
            .meals(DEFAULT_MEALS)
            .alcohol(DEFAULT_ALCOHOL)
            .notes(DEFAULT_NOTES);
        return points;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Points createUpdatedEntity(EntityManager em) {
        Points points = new Points()
            .date(UPDATED_DATE)
            .exercise(UPDATED_EXERCISE)
            .meals(UPDATED_MEALS)
            .alcohol(UPDATED_ALCOHOL)
            .notes(UPDATED_NOTES);
        return points;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Points.class).block();
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
        points = createEntity(em);
    }

    @Test
    void createPoints() throws Exception {
        int databaseSizeBeforeCreate = pointsRepository.findAll().collectList().block().size();
        // Create the Points
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate + 1);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(DEFAULT_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(DEFAULT_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(DEFAULT_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(DEFAULT_NOTES);
    }

    @Test
    void createPointsWithExistingId() throws Exception {
        // Create the Points with an existing ID
        points.setId(1L);

        int databaseSizeBeforeCreate = pointsRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = pointsRepository.findAll().collectList().block().size();
        // set the field null
        points.setDate(null);

        // Create the Points, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllPoints() {
        // Initialize the database
        pointsRepository.save(points).block();

        // Get all the pointsList
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
            .value(hasItem(points.getId().intValue()))
            .jsonPath("$.[*].date")
            .value(hasItem(DEFAULT_DATE.toString()))
            .jsonPath("$.[*].exercise")
            .value(hasItem(DEFAULT_EXERCISE))
            .jsonPath("$.[*].meals")
            .value(hasItem(DEFAULT_MEALS))
            .jsonPath("$.[*].alcohol")
            .value(hasItem(DEFAULT_ALCOHOL))
            .jsonPath("$.[*].notes")
            .value(hasItem(DEFAULT_NOTES));
    }

    @Test
    void getPoints() {
        // Initialize the database
        pointsRepository.save(points).block();

        // Get the points
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, points.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(points.getId().intValue()))
            .jsonPath("$.date")
            .value(is(DEFAULT_DATE.toString()))
            .jsonPath("$.exercise")
            .value(is(DEFAULT_EXERCISE))
            .jsonPath("$.meals")
            .value(is(DEFAULT_MEALS))
            .jsonPath("$.alcohol")
            .value(is(DEFAULT_ALCOHOL))
            .jsonPath("$.notes")
            .value(is(DEFAULT_NOTES));
    }

    @Test
    void getNonExistingPoints() {
        // Get the points
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewPoints() throws Exception {
        // Initialize the database
        pointsRepository.save(points).block();

        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();

        // Update the points
        Points updatedPoints = pointsRepository.findById(points.getId()).block();
        updatedPoints.date(UPDATED_DATE).exercise(UPDATED_EXERCISE).meals(UPDATED_MEALS).alcohol(UPDATED_ALCOHOL).notes(UPDATED_NOTES);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedPoints.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedPoints))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(UPDATED_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    void putNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();
        points.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, points.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePointsWithPatch() throws Exception {
        // Initialize the database
        pointsRepository.save(points).block();

        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();

        // Update the points using partial update
        Points partialUpdatedPoints = new Points();
        partialUpdatedPoints.setId(points.getId());

        partialUpdatedPoints.alcohol(UPDATED_ALCOHOL).notes(UPDATED_NOTES);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPoints.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPoints))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(DEFAULT_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(DEFAULT_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    void fullUpdatePointsWithPatch() throws Exception {
        // Initialize the database
        pointsRepository.save(points).block();

        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();

        // Update the points using partial update
        Points partialUpdatedPoints = new Points();
        partialUpdatedPoints.setId(points.getId());

        partialUpdatedPoints
            .date(UPDATED_DATE)
            .exercise(UPDATED_EXERCISE)
            .meals(UPDATED_MEALS)
            .alcohol(UPDATED_ALCOHOL)
            .notes(UPDATED_NOTES);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPoints.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPoints))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
        Points testPoints = pointsList.get(pointsList.size() - 1);
        assertThat(testPoints.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPoints.getExercise()).isEqualTo(UPDATED_EXERCISE);
        assertThat(testPoints.getMeals()).isEqualTo(UPDATED_MEALS);
        assertThat(testPoints.getAlcohol()).isEqualTo(UPDATED_ALCOHOL);
        assertThat(testPoints.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    void patchNonExistingPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();
        points.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, points.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPoints() throws Exception {
        int databaseSizeBeforeUpdate = pointsRepository.findAll().collectList().block().size();
        points.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(points))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Points in the database
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePoints() {
        // Initialize the database
        pointsRepository.save(points).block();

        int databaseSizeBeforeDelete = pointsRepository.findAll().collectList().block().size();

        // Delete the points
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, points.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Points> pointsList = pointsRepository.findAll().collectList().block();
        assertThat(pointsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
