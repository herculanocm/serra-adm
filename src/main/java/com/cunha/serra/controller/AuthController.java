package com.cunha.serra.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AuthController {

	@RequestMapping("/login")
	public String loginPage(){
		System.out.println("Controller AuthController loginPage()");
		return "auth/login";
	}
}
