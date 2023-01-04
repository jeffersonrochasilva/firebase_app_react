import { db, auth } from "./firebaseconection";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import "./app.css";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [posts, setposts] = useState([]);
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("dados registrados no banco");
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("dados registrados com sucesso");
        setAutor("");
        setTitulo("");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function getFirebase() {
    const postRef = doc(db, "posts", "12345");
    await getDoc(postRef)
      .then((response) => {
        console.log(response.data().autor);
        console.log(response.data().titulo);
      })
      .catch((E) => {
        console.log(E);
      });
  }

  async function buscarPosts() {
    const postsRef = collection(db, "posts");

    await getDocs(postsRef)
      .then((response) => {
        let lista = [];
        response.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setposts(lista);
        console.log(posts, "response");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then((item) => {
        console.log(item);
        setTitulo("");
        setAutor("");
        setIdPost("");
      })
      .catch((item) => {
        console.log(item);
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    async function loadingPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setposts(listaPost);
      });
    }
    loadingPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function novoUsuario() {
    console.log(email, senha);
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        setEmail("");
        setSenha("");
      })
      .catch((e) => {
        if (e.cade === "auth/weak-password") {
          alert("Senha muito fraca");
        } else if (e.code === "auth/email-already-in-use") {
          alert("Email já existe");
        }
        console.log("ERROR ");
      });
  }
  async function logarNovoUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("usuario logado");
        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);
        setEmail("");
        setSenha("");
      })
      .catch(() => {
        console.log("erro ao fazer o login");
      });
  }

  async function sairdaconta() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }
  //teste@gmail.com 123456
  return (
    <div className="App">
      <h1>react + firebase</h1>

      {user && (
        <div>
          <strong>Seja bem vindo(a) (Você está logado)</strong>
          <br />
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
          </span>
          <button onClick={sairdaconta}>Sair da conta</button>
        </div>
      )}
      <div className="container">
        <h2>Usuários</h2>
        <br />
        <label>Email</label>
        <input
          placeholder="Digite seu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>
      <br />
      <button onClick={novoUsuario}>Cadastrar</button>
      <br />
      <button onClick={logarNovoUsuario}>Fazer login</button>
      <br />
      <br />

      <hr />
      <div className="container">
        <h2>Postes</h2>
        <br />
        <label>ID do post</label>
        <input
          placeholder="Digite o ID do Post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <label>Titulo</label>
        <textarea
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          type="text"
          placeholder="Digite o titulo"
        />
        <label>Autor</label>
        <input
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          type="text"
          placeholder="Autor do post"
        />
        <br />
        <button onClick={handleAdd}>Cadastrar</button>
        <br />
        <button onClick={buscarPosts}>Buscar post</button>
        <br />
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((item) => {
            return (
              <li key={item.id}>
                <strong>{item.id}</strong>
                <br />
                <span>Titulo: {item.titulo}</span>
                <br />
                <span>Autor: {item.autor}</span>
                <br />
                <button onClick={() => excluirPost(item.id)}>excluir</button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
