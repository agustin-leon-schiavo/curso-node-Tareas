require('colors');
const { guardarDB, 
        leerDB 
} = require('./helpers/guardarArchivo');
const { inquirerMenu, 
        pausa, 
        leerInput,
        listadoTareasBorrar, 
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');



const main = async() => {
    
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) { // cargar las tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        // Imprimir el menú
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;

            case '2': 
                tareas.listadoCompleto();
            break;

            case '3': 
                tareas.listarCompletadas();
            break;

            case '4': 
                tareas.listarPendientes();
            break;

            case '5': 
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;

            case '6': 
            const id = await listadoTareasBorrar( tareas.listadoArr );
            if ( id !== '0') {
                const borrarOk = await confirmar('¿Está seguro?');
                if ( borrarOk ) {
                    tareas.borrarTarea( id );
                    console.log('Tarea borrada');
                    
                }        
            }
            break;


        }
        
        guardarDB( tareas.listadoArr );

        await pausa();

    } while( opt !== '0' );

       
}


main();