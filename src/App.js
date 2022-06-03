import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  cambioIdPrestamo(e){
    this.setState({
      idPrestamo: e.target.value
    })
  }
  cambioIdLibro(e){
    this.setState({
      idLibro: e.target.value
    })
  }
  cambioIdUsuario(e){
    this.setState({
      idUsuario: e.target.value
    })
  }
  cambioFechaPrestamo(e){
    this.setState({
      fecPrestamo: e.target.value
    })
  }
  cambioFechaDevolucion(e){
    this.setState({
      fecDevolucion: e.target.value
    })
  }

  mostrar(cod, index){
    axios.get('http://127.0.0.1:8000/prestamos/'+cod+'/')
    .then(res=>{
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        idPrestamo: res.data.idPrestamo,
        idLibro: res.data.idLibro,
        idUsuario: res.data.idUsuario,
        fecPrestamo: res.data.fecPrestamo,
        fecDevolucion: res.data.fecDevolucion
      })
    });
  }

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      idPrestamo: this.state.idPrestamo,
      idLibro: this.state.idLibro,
      idUsuario: this.state.idUsuario,
      fecPrestamo: this.state.fecPrestamo,
      fecDevolucion: this.state.fecDevolucion
    }
    if(cod>0){//Editamos un registro
      axios.put('http://127.0.0.1:8000/prestamos/'+cod+'/',datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.prestamos[indx] = res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos: null,
          titulo: 'Nuevo',
          id:0,
          idPrestamo: 0,
          idLibro: 0,
          idUsuario: 0,
          fecPrestamo: '',
          fecDevolucion: '',
          prestamos: temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }else{//Nuevo registro
      axios.post('http://127.0.0.1:8000/prestamos/',datos)
      .then(res=>{
        this.state.prestamos.push(res.data);
        var temp = this.state.prestamos;
        this.setState({
          id:0,
          idPrestamo: 0,
          idLibro: 0,
          idUsuario: 0,
          fecPrestamo: '',
          fecDevolucion: '',
          prestamos: temp
        }).catch((error)=>{
          console.log(error.toString());
        })
      })
    }
  }

  eliminar(cod){
    let rpta = window.confirm("Desea eliminar?");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/prestamos/'+cod+'/')
      .then(res => {
        var temp = this.state.prestamos.filter((prestamo)=>prestamo.id !== cod);
        this.setState({
          prestamos: temp
        })
      })
    }
  }

  componentWillMount(){
    axios.get('http://127.0.0.1:8000/prestamos')
    .then(res => {
      this.setState({ prestamos: res.data })
    })
  }

  constructor(props) {
    super(props);
    this.state=({
      prestamos: [],
      pos: null,
      titulo: 'Nuevo',
      id:0,
      idPrestamo: 0,
      idLibro: 0,
      idUsuario: 0,
      fecPrestamo: '',
      fecDevolucion: ''
    })
  
    this.cambioIdPrestamo = this.cambioIdPrestamo.bind(this);
    this.cambioIdLibro = this.cambioIdLibro.bind(this);
    this.cambioIdUsuario = this.cambioIdUsuario.bind(this);
    this.cambioFechaPrestamo= this.cambioFechaPrestamo.bind(this);
    this.cambioFechaDevolucion = this.cambioFechaDevolucion.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);

  }
  render() {
    return (
    <div>
      <h1>Lista de Prestamos</h1>
      <table border="1" class="table table-striped">
        <thead>
          <tr>
            <th>Id Prestamo</th>
            <th>Id Libro</th>
            <th>Id Usuario</th>
            <th>Fecha Prestamo</th>
            <th>Fecha Devolucion</th>
          </tr>
        </thead>
        <tbody>
          {this.state.prestamos.map( (prestamo,index) =>{
            return (
              <tr key={prestamo.id}>
                <td>{prestamo.idPrestamo}</td>
                <td>{prestamo.idLibro}</td>
                <td>{prestamo.idUsuario}</td>
                <td>{prestamo.fecPrestamo}</td>
                <td>{prestamo.fecDevolucion}</td>
                <td>
                  <button class="btn btn-success" onClick={()=>this.mostrar(prestamo.id,index)}>Editar</button>
                  <button class="btn btn-danger" onClick={()=>this.eliminar(prestamo.id)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
      <h1>{this.state.titulo}</h1>
      <form onSubmit={this.guardar}>
      <input type="hidden" value={this.state.id}></input>
        <p>
          Ingrese Id Prestamo:
          <input type="text" value={this.state.idPrestamo} onChange={this.cambioIdPrestamo}></input>
        </p>
        <p>
          Ingrese Id Libro:
          <input type="number" value={this.state.idLibro} onChange={this.cambioIdLibro}></input>
        </p>
        <p>
          Ingrese Id usuario:
          <input type="text" value={this.state.idUsuario} onChange={this.cambioIdUsuario}></input>
        </p>
        <p>
          Fecha Prestamo:
          <input type="text" value={this.state.fecPrestamo} onChange={this.cambioFechaPrestamo}></input>
        </p>
        <p>
          Fecha Devolucion:
          <input type="text" value={this.state.fecDevolucion} onChange={this.cambioFechaDevolucion}></input>
        </p>
        <p><input type="submit"></input></p>
      </form>
    </div>
    )
  }
}
export default App;


