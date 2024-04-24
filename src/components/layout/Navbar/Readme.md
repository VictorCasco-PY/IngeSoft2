## Navbar

## Lo que se hizo
- Botones en navbar
- Botones dropdowns
- Navbar desde 0 usando MUI + Bootstrap
- Navbar responsive
- Logo nuevo

### NavBtn

Se tienen los tipos (usar type="_el tipo que eligas_")

- base
- dropdownItem
- default (por defecto)

_No es necesario usar Link, podes usar el atributo href con cualquiera de ellos_

ej:

```JSX
<NavBtn id="nav-usuarios" href="/users">Usuarios</NavBtn>
```

### NavDropdown

Ya esta listo para ser usado simplemente, usa NavBtn's de tipo dropdownItem
Ejemplo:

```JSX
 <NavDropdown title="Proveedores">
      <NavBtn type="dropdownItem" href="/proveedores">
        Lista de Proveedores
      </NavBtn>
      <NavBtn type="dropdownItem" href="/productos">
        Lista de Productos
      </NavBtn>
    </NavDropdown>
```

### UserDropDown

Es el dropdown con las opciones del usuario.

Las opciones Configurar Cuenta (sin funcionamiento todavía) y Cerrar Sesión están ahí

### ProveedoresDropDown
Aquí están Ver Proveedores y Ver Productos

