package com.okta.developer;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.okta.developer");

        noClasses()
            .that()
                .resideInAnyPackage("com.okta.developer.service..")
            .or()
                .resideInAnyPackage("com.okta.developer.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..com.okta.developer.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
