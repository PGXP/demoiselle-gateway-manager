package org.demoiselle.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.demoiselle.app.constants.Perfil;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"email"})})
@XmlRootElement
public class User implements Serializable {

    @Id
    @Basic(optional = false)
    @NotNull
    @Column(nullable = false)
    private UUID id;

    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 512)
    @Column(nullable = false, length = 512)
    private String email;

    @NotNull
    @Basic(optional = false)
    @Size(min = 3, max = 128)
    @Column(nullable = false, length = 128)
    private String description;

    @NotNull
    @Basic(optional = false)
    @Size(min = 8, max = 128)
    @Column(length = 128)
    private String pass;

    @Size(max = 2048)
    @Column(length = 2048)
    private String foto;

    @Column
    private Perfil perfil;

    public UUID getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonIgnore
    public String getPass() {
        return pass;
    }

    @JsonIgnore
    public void setPass(String pass) {
        this.pass = pass;
    }

    public Perfil getPerfil() {
        return perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 97 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final User other = (User) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "User{" + "id=" + id + ", description=" + description + ", email=" + email + ", pass=" + pass + ", perfil=" + perfil + '}';
    }

}
