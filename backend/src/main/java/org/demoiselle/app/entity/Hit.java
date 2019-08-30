/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.demoiselle.app.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author 70744416353
 */
@Entity
@Table(catalog = "gateway", schema = "public")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Hit.findAll", query = "SELECT h FROM Hit h"),
    @NamedQuery(name = "Hit.findById", query = "SELECT h FROM Hit h WHERE h.id = :id"),
    @NamedQuery(name = "Hit.findByOrigem", query = "SELECT h FROM Hit h WHERE h.origem = :origem"),
    @NamedQuery(name = "Hit.findByCaminho", query = "SELECT h FROM Hit h WHERE h.caminho = :caminho"),
    @NamedQuery(name = "Hit.findByData", query = "SELECT h FROM Hit h WHERE h.data = :data")})
public class Hit implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(nullable = false)
    private Long id;
    @Lob
    private Object usuario;
    @Size(max = 512)
    @Column(length = 512)
    private String origem;
    @Size(max = 512)
    @Column(length = 512)
    private String caminho;
    @Temporal(TemporalType.TIMESTAMP)
    private Date data;

    public Hit() {
    }

    public Hit(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Object getUsuario() {
        return usuario;
    }

    public void setUsuario(Object usuario) {
        this.usuario = usuario;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getCaminho() {
        return caminho;
    }

    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Hit)) {
            return false;
        }
        Hit other = (Hit) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "org.demoiselle.app.entity.Hit[ id=" + id + " ]";
    }
    
}
