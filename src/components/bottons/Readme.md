# Botones

![Ejemplo de botones](https://i.imgur.com/xTKkiyk.png)

## Atributos

type (opcional): **"default"** (por defecto) | **"primary"** | **"secondary"** 

outline (opcional): **"true"** | **"false"** (por defecto esta en false)

loading (opcional): **"true"** | **"false"** (por defecto esta en false)

httpAtributes (opcional): **OnClick, style, etc.** salvo ClassName, por alguna razón, no funciona

Icon (optional): Recibe un componente icono, ej
```jsx
    <Btn icon={<HiAdjustmentsHorizontal />}>
        Ajustes
    </Btn>
```



### Type
Cambia el estilo del boton, acorde al tipo

```jsx
<Btn type="primary">
  Boton de prueba
</Btn>
```

### Outline
Indica si el boton va tener o no un contorno/borde. Con marcarlo en atributos ya es suficiente
```jsx
<Btn outline>
  Boton de prueba
</Btn>
```

### Loading
Si queres que el botón muestre o no un icono de login, le pones ese atributo. Por ej, si tenes un estado *loadingState* que maneja que el boton este en modo "cargando" o espera.

_Un botón que tenga icono, al tener _**loading={true}**_, el icono desaparece y aparece el icono del loader_
```jsx
<Btn loading={loadingState}>
  Boton de prueba
</Btn>
```

### httpAtributes
Como cualquier componente o elemento html

```jsx
<Btn OnClick={()=>alert("Hola")}>
  Boton de prueba
</Btn>
```
