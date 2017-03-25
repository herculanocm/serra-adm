package com.cunha.serra.controller;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.cunha.serra.daos.ProdutoDAO;
import com.cunha.serra.models.BookType;
import com.cunha.serra.models.Produto;

@RequestMapping("/produtos")
@RestController
@Transactional
public class ProdutosController {
	
	@Autowired
	private ProdutoDAO productDAO;
	
	
	@RequestMapping(value="/save",method=RequestMethod.POST)
	public String save(@Validated @RequestBody Produto produto){
	System.out.println("Cadastrando o produto : "+produto.toString());
	productDAO.save(produto);
	return "ok";
	}
	
	@RequestMapping(value="/form",method=RequestMethod.GET)
	public ModelAndView form(){
		ModelAndView modelAndView = new ModelAndView("form");
		modelAndView.addObject("types", BookType.values());
		System.out.println("Formulario de cadastro de produto"); 
	return modelAndView;
	}
	
	
	@RequestMapping(method = RequestMethod.GET,value="/list")
	@ResponseBody
	public List<Produto> list(){
		List<Produto> lista=productDAO.lista();
		System.out.println("Listando produtos: "+ lista.size());
		return  lista;
		}

}
