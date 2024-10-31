//Imports
import * as admin from "firebase-admin";
import * as serviceAcount from './apx-mab-1-firebase-adminsdk-e2u2n-d4fc35d9e2.json';
import * as express from 'express';
const app = express();
//Puerto
const PORT = 3000;
//FIREBASE
admin.initializeApp({
    credential : admin.credential.cert(serviceAcount as any),
    databaseURL : 'https://apx-mab-1-default-rtdb.firebaseio.com'
})
const baseDeDatos = admin.firestore();

const usersCollection = baseDeDatos.collection("users");

//SIEMPRE PONER EL MIDDLEWARE
app.use(express.json());

app.get('/', (req, res) =>{
   
    res.send('Hola mundo');
});

app.get('/users', (req, res) =>{
    const arrayUsuarios = []
    usersCollection.get().then((snap) =>{
        snap.forEach((doc) => {
            arrayUsuarios.push({id : doc.id, ...doc.data()})
        })
        res.json(arrayUsuarios);
    })
});

app.get('/users/:id', (req,res)=>{
    const arrayUsuarios = [];
    const usuarioBuscado = req.params.id;
    usersCollection.get().then((snap) =>{
        snap.forEach((doc) => {
            arrayUsuarios.push({id : doc.id, ...doc.data()})
        })
        const resultadoBusqueda = arrayUsuarios.find(elemento => elemento.id == usuarioBuscado);

        resultadoBusqueda ? res.send(resultadoBusqueda) 
                          : res.send("No se encontro al usuario con ese ID");
    })
});

app.post('/users',  (req, res) =>{
    const nuevoUser = req.body;
    usersCollection.add(nuevoUser);
    res.send('Se agrego con exito el nuevo user')
});

//LOS : son para obtener el dato y el REQ.params capta ese valor
app.put('/users/:id',  (req, res) => {
    const usuarioBuscado = req.params.id;
    const modificarUsuario = req.body;
    // Crea una referencia directa al documento dentro de la colección users usando el ID proporcionado en los params.
    const userRef = usersCollection.doc(usuarioBuscado);
    userRef.update(modificarUsuario).then(()=>{
        res.send(`Usuario con id: ${usuarioBuscado} actualizado exitosamente`)
    })
  
});
app.delete('/users/:id', (req,res) =>{
    const usuarioBuscado = req.params.id;
    const userRef = usersCollection.doc(usuarioBuscado);
    userRef.delete();
    res.send(`Usuario con id: ${usuarioBuscado} se borro exitosamente`)
});
//PRODUCTOS
const productsCollection = baseDeDatos.collection("products");

app.get('/products/', (req,res) => {
    const arrayProducts = [];
    productsCollection.get().then((snapShot)=>{
        snapShot.forEach((snap) => {
            arrayProducts.push({id: snap.id, ...snap.data()})
        })
        res.json(arrayProducts)
    })
    
});

app.get('/products/:id', (req,res) =>{
    const productoBuscado = req.params.id;
    const arrayProducts = [];

    productsCollection.get().then((snapShot)=>{
        snapShot.forEach((snap) => {
            arrayProducts.push({id: snap.id, ...snap.data()})
        })
        const resultadoBusqueda = arrayProducts.find( ( product) => product.id === productoBuscado);
        resultadoBusqueda 
                          ? res.send(resultadoBusqueda) 
                          : res.send(`No se encontro el producto con id: ${productoBuscado}`)
    })
});
app.post('/products',  (req,res) =>{
    const nuevoProducto = req.body;
    productsCollection.add(nuevoProducto);
    res.send('Se agrego con exito el nuevo producto')
});

app.put('/products/:id', (req,res) =>{
    const prodBuscado = req.params.id
    const dataModificada = req.body;
    // Crea una referencia directa al documento dentro de la colección users usando el ID proporcionado en los params.
    const prodRef = productsCollection.doc(prodBuscado);
    prodRef.update(dataModificada).then(()=>{
        res.send(`Usuario con id: ${prodBuscado} actualizado exitosamente`)
    })
});

app.delete('/products/:id', (req,res) =>{
    const prodBuscado = req.params.id
    const prodRef = productsCollection.doc(prodBuscado);
    prodRef.delete();
    res.send("Se borro con exito el producto")
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});