import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import styles from "./Projects.module.css";

import Container from "../layout/Container";
import ProjectCard from "../projects/ProjectCard";
import LinkButton from "../layout/LinkButton";
import Message from "../layout/Message";
import Loading from "../layout/Loading";
import { BsEmojiTear } from "react-icons/bs";
import ServiceCard from "../services/ServiceCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectsMessage, setProjectsMessage] = useState("");

  const location = useLocation();
  let message = "";
  if (location.state) {
    message = location.state.message;
  }

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProjects(data);
          console.log(data);
          setRemoveLoading(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 300);
  }, []);

  function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application;json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(projects.filter((project) => project.id !== id));
        setProjectsMessage("Projeto removido com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles.projects_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar projeto" />
      </div>
      {message && <Message type="success" msg={message} />}
      {projectsMessage && <Message type="success" msg={projectsMessage} />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              name={project.name}
              key={project.id}
              id={project.id}
              budget={project.budget}
              category={project?.category?.name}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>
            Não há projetos cadastrados!{" "}
            <BsEmojiTear className={styles.emoji} />
          </p>
        )}
      </Container>
    </div>
  );
}

export default Projects;
