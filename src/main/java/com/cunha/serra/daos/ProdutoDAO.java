package com.cunha.serra.daos;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import com.cunha.serra.models.Produto;


@Repository
public class ProdutoDAO {
	@PersistenceContext
	private EntityManager manager;

	public void save(Produto produto) {
		manager.persist(produto);
	}
	
	public List<Produto> lista(){
		//return manager.createNativeQuery("select * from produto").getResultList();
		return manager.createQuery("select p from produto p",Produto.class).getResultList();
	}

}
