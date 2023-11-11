package com.lostpetfinder;

import com.lostpetfinder.dao.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.lostpetfinder.entity.Role;

@SpringBootApplication
public class LostPetFinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(LostPetFinderApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(RoleRepository roleRepo) {
		return (args) -> {
			Role roleS = new Role();
			roleS.setName("ROLE_SHELTER");
			roleRepo.save(roleS);

			Role roleR = new Role();
			roleR.setName("ROLE_REGISTERED");
			roleRepo.save(roleR);
		};
	}

}
