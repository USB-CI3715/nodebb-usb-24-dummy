# UserGuide (By Team-Dummy)

**USB OπNIONS** es una plataforma diseñada con el fin de ofrecer a la comunidad uesebista un espacio para la comunicación estudiantil, estableciendo un lugar para Anuncios, Discusiones Generales, Denuncias y Quejas, y Noticias. Además, se busca brindar a los estudiantes espacios particulares para cada materia con el fin de que puedan esteblecerse foros de Preguntas y Respuestas entre el curso y el profesor de la misma.

## Índice
- [Instrucciones de Despliegue](#instrucciones-de-despliegue)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación de **USB OπNIONS**](#instalación-de-usb-opnions)
- [Cómo Usar **USB OπNIONS**](#cómo-usar-usb-opnions)
  - [Usuario con rol `Teachers`](#usuario-con-rol-teachers)
  - [Creación de Materias](#creación-de-materias)
  - [Utilización de las Categorías de las Materias](#utilización-de-las-categorías-de-las-materias)

## Instrucciones de Despliegue
### Prerrequisitos
* Manten tu sistema actualizado
   ```shell
   sudo apt update; sudo apt upgrade -y
   ```
* Instala Node.js en su versión LTS
   * Primero instalamos `nvm`
      ```shell
      curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
      ```
   * Instala Node
      ```shell
      sudo apt-get install -y nodejs
      ```
   * Verifica versiones instaladas
     
      *Idealmente v18.x o v20.x para NODE*
      ```shell
      node -v
      ```
      *Idealmente 9.x o superior para NPM*
      ```shell
      npm -v
      ```
* Instala GitHub
   ```shell
   sudo apt install git -y
   ```
   Verifica la version instalada con `git -v`.
* Instala Redis-Server
   ```shell
   sudo apt-get install redis
   ```
   * Inicia el servidor de Redis
      ```shell
      redis-server
      ```
      NOTA: En caso de tener problemas con el servidor de Redis debido a puerto en uso, se tienen dos opciones.
      * (Opción 1) Cambiar el puerto por defecto en la configuración
         ```shell
         sudo nano /etc/redis/redis.conf
         ```
         * Busca la linea que dice `port 6379` y cambiala por `port 6380` por ejemplo o cualquier otro puerto que sepas que este disponible.
         * Luego de cambiar el puerto, reinicia Redis
            ```shell
            sudo systemctl restart redis
            ```
         * Verifica en que puerto esta ejecutandose Redis
            ```shell
            sudo netstat -tuln | grep redis
            ```
      * (Opción 2) Dile directamente a Redis en que puerto debe correr para la sección actual, donde dice `<port>` coloca el numero de puerto preferido y disponible, como por ejemplo `6380`.
         ```shell
         redis-server --port <port>
         ```
     
### Instalación de **USB OπNIONS**
1. Clonar el repositorio 
   ```shell
   git clone https://github.com/USB-CI3715/nodebb-usb-24-dummy.git
   ```
2. Estando en la raíz del proyecto, realiza el siguiente comando
    ```shell
   ./nodebb install
    ```
   Este instalará las dependencias del proyecto y, posteriormente, solicitará dirigirse a
   ```
   http://localhost:4567/
   ```
   Para continuar la instalación. Una vez allí, debe ingresar:
      - Nombre de usuario administrador
      - Clave para el usuario administrador. Esta debe ser una contraseña que incluya caracteres alfanumérico, como por ejemplo `admin1234!` 
      - Seleccionar la Base de Datos para el proyecto. Asegúrese de seleccionar `redis` como base de datos.
   
   **El resto de los campos solicitados deben dejarse sin modificación a menos que haya cambiado el puerto de redis.**
4. Iniciar Sesión con su cuenta de administrador. Una vez hecho esto se desplegará la aplicación, mostrando la siguiente vista:

   ![imagen](imagen.png)

## Cómo Usar **USB OπNIONS**

### Usuario con rol `Teachers`
La aplicación permite el registro de usuarios con rol de Profesor. En este registro se incluyen los campos `Nombre Completo` y la casilla de marcar como profesor.

 <img src="imagen_2.png" alt="Registro" align="center"> 

En concreto, este rol permite:
   - Crear y gestionar una materia. En detalle:
      - Invitar a estudiantes al curso.
      - Aceptar y rechazar solicitudes de aquellos estudiantes que quieran registrarse en la materia.
      - Completa personalización de la materia.
      - Eliminación de la materia.
      - Ampliar la cantidad de categorias que pueden verse en el curso. Por defecto, al crear una materia solo se podrán ver los post realizados en la categoría asociada al curso (para más información, leer [Utilización de las Categorías de las Materias](#utilización-de-las-categorías-de-las-materias)).

>[!IMPORTANT]
> - Se asume que cualquier usuario que se registre y **NO** marque la casilla `Profesor` es un estudiante.
> - Todo usuario registrado tiene habilitado el mostrado de su nombre completo como configuración por defecto.
> - A nivel de Adminitrador, los usuarios `Teachers` se encuentran en el grupo correspondiente `Teachers`

### Creación de Materias
* La creación de materias se realiza mediante la siguiente vista modal, para la cual es necesario el rellenado de los campos `Course ID`, `Course Name` y `Trimester`.

  Los demás campo tienen como valores por defecto el año actual y la primera sección. Sin embargo de ser necesario se puede hacer la selección manual de los mismos.
![imagen](imagen_3.png)

* Para el campo `Trimester` se tiene un desplegable con las siguientes opciones correspondientes al sistema trimestral ofrecido por la USB.
![imagen](imagen_4.png)

* Para el campo `Year` se tiene un desplegable de los años disponibles, tomando el actual y mostrando los 9 próximos.
![imagen](imagen_5.png)

* Para el campo `Section` se tiene un desplegable con 10 sección disponibles.
![imagen](imagen_6.png)

Una vez hecho esto, se crea la materia con el nombre mostrado en la imagen siguiente, donde cabe aclarar que el nombre del Profesor, a pesar de ser mostrado en el titulo, **NO** forma parte del nombre de la materia. Este solo es mostrado con fines estéticos.
![imagen](imagen_7.png)

>[!NOTE]
> Esta funcionalidad genera un espacio de comunicación entre profesor y estudiante mediante una categoría.
>
> Para más información leer el posterior inciso. 

### Utilización de las Categorías de las Materias
Cuando una materia es creada, esta genera una categoría que posee el mismo nombre del curso creado. Para visualizarla debemos dirigirnos al apartado "Categorias" ubicado en la barra lateral izquierda.
![imagen](imagen_8.png)

Es gracias a esta categoría que los profesores y estudiantes pueden entablar discusiones mediante tópicos relacionados a la materia. 
![imagen](imagen_9.png)

Acá se muestra un ejemplo de la interacción entre un estudiante y su profesor.
![imagen](imagen_10.png)

Cada post realizado en este espacio es desplegado en la materia correspondiente, como un historial en que los usuarios inscritos en la misma pueden consultar.
![imagen](imagen_11.png)