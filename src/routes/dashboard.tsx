import { useAuth } from "../Autenticacion/AutProvider"
import { useState, useEffect } from "react";
import { API_URL } from "../Autenticacion/constanst";
import PortalLayout from "../layout/PortalLayout";


interface Todo {
  _id: string,
  title: string,
  completed: boolean;
  idUser: string;
}

export default function Dashboard(){

  const [todos, setTodos] = useState<Todo[]>([]);
  const []= useState("");

  const auth = useAuth();

  useEffect(()=>{
    loadTodos();
  }, []);



  async function loadTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`,{
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`
        },
      });

      if(response.ok){
        const json = await response.json();
        setTodos(json);
      }else{

      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      
    }
    
  }
  return (
    <PortalLayout>
      <h1 className="uno">Perfil de {auth.getUser()?.name || ""}</h1>
     
      {todos.map((todo)=>(<div id="resultado" key={todo._id}>{todo.title}</div>))}
      <div>
      <iframe
  title="Contenido HTML"
  src="./mapa.html"
  width="100%"
  height="500px"
/>
      </div>
    </PortalLayout>
  )
}