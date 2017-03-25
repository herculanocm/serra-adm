package com.cunha.serra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
 


@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	private static String REALM="SERRA_ADMIN_REALM";
	
	@Autowired
	private UserDetailsService users;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		.csrf().disable()
		.authorizeRequests()
		.antMatchers("/").permitAll()
		.antMatchers("/public/**").permitAll()
		.antMatchers("/shopping/**").hasRole("ADMIN")
		.antMatchers(HttpMethod.GET,"/produtos/list").hasRole("ADMIN")
		.and().httpBasic().realmName(REALM).authenticationEntryPoint(getBasicAuthEntryPoint());
		
		/*
		 * .antMatchers("/login").permitAll()
		//.antMatchers("/produtos/form").hasRole("ADMIN")
		.antMatchers("/produtos/form").permitAll()
		.antMatchers("/shopping/**").hasRole("ADMIN")
		.antMatchers(HttpMethod.POST,"/produtos").permitAll()
		.antMatchers(HttpMethod.GET,"/produtos/save").permitAll()
		.antMatchers(HttpMethod.GET,"/produtos/**").permitAll()
		.antMatchers("/produtos/**").permitAll()
		.and()
		.formLogin().loginPage("/login").permitAll()
		.and()
		.logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
		@Bean
	public CustomBasicAuthenticationEntryPoint getBasicAuthEntryPoint(){
		return new CustomBasicAuthenticationEntryPoint();
	}
		 */
		
	}
	
	
	
	
	@Bean
	public CustomBasicAuthenticationEntryPoint getBasicAuthEntryPoint(){
		return new CustomBasicAuthenticationEntryPoint();
	}
	
	
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth)
			throws Exception {
		
		System.out.println("AuthenticationManagerBuilder - configure: "+auth.userDetailsService(users).toString());
		//auth.userDetailsService(users);
		//auth.userDetailsService(users).passwordEncoder(new BCryptPasswordEncoder());
		auth.inMemoryAuthentication().withUser("bill").password("abc123").roles("ADMIN");
		//auth.inMemoryAuthentication().withUser("tom").password("abc123").roles("USER");
	}
	
	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/resources/**").antMatchers(HttpMethod.OPTIONS, "/**");
	}

}
