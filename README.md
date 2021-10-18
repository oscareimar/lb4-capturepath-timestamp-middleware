# Loopback 4 - Captura de path y establecimiento de timestamps mediante middleware

Esta aplicacion esta desarrollada para la creacion de API REST de una tabla User, ademas cuenta con dos caracteristicas los cuales se describen a continuacion:
- Se obtienen todos los path de los request y se muestran en consola
- Se establece los campos createAt y updateAt en todos los modelos existentes y futuras

Estas caracteristicas estan establecidas con ayuda de un middleware que se encuentra en el archivo `src/sequence.ts`, en la funcion **handle**, mismo que recibe como parametro un objeto de tipo **context**, donde basicamente es la obtencion del **request y response** que se conocen en **expressJs**. De esta manera se puede establecer las acciones requeridas antes que ingrese al controlador y alterar la respuesta en el **req.body** para actualizar dichos campos

## Instalacion de Dependencias

Se instalan las dependencias que la aplicacion requiere que estan configuradas en el archivo `package.json`, con el siguiente comando

```sh
npm install
```

Para instalar solo las dependencias resueltas en `package-lock.json`:

```sh
npm ci
```

## Otros requisitos

Se debe tener un servicio de MongoDB para la Base de datos y personalizar los parametros de conexion en el archivo: `src/datasources/mongo.datasource.ts`

```sh
const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: '',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'DB01',
  useNewUrlParser: true
};
```

## Ejecutar la Aplicacion

```sh
npm start
```

También puede ejecutar node. para omitir el paso de compilación.

Abre http://127.0.0.1:3000 en tu navegador.

## Funcion Handle

La siguiente funcion se encarga de obtener el tipo de metodo del request y de acuerdo a este se establece los campos correspondientes **(timestamps)**, ademas se muestra por consola el PATH de todos los **requests** de la API

```sh
async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      //estableciendo los campos createdAt y updatedAt de acuerdo al metodo
      const date = this.getTimestamps();
        if(request.method === 'POST') args[0].createdAt = date;
        if(request.method === 'PUT') args[1].updatedAt = date;
      
      //mostrando el path de los request
      const msg = `METHOD: ${request.method}, PATH: ${request.originalUrl}`
      console.log(msg);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
```
