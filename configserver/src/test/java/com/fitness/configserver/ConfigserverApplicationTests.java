package com.fitness.configserver;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ConfigserverApplicationTests {

	@Test
	void applicationClassExists() {
		assertThat(ConfigserverApplication.class).isNotNull();
	}

	@Test
	void mainMethodExists() throws NoSuchMethodException {
		assertThat(ConfigserverApplication.class.getMethod("main", String[].class)).isNotNull();
	}
}
