import React, { useState, createContext, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap, applyNodeChanges, useReactFlow, addEdge, useEdgesState, ReactFlowProvider, MarkerType, applyEdgeChanges } from "reactflow";
export const MindMapContext = createContext();

const MindMapProvider = (props) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [activeNodes, setActiveNodes] = useState("");
  const [adjustPosition, setAdjustPosition] = useState(0);
  const [activeNodesPosition, setActiveNodesPosition] = useState(0);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [rootPos, setRootPos] = useState(0);
  const [addPos, setAddPos] = useState(200);
  const [initialChanges, setInitialChanges] = useState();
  const getReactFlowInstance = (value) => {
    setReactFlowInstance(value);
  };

  const onAddNode = (reactFlowInstance, posAdd) => {
    console.log("nodes bbang", nodes);
    // console.log("first node", nodes);
    if (localStorage.getItem("nodes") !== null) {
      setNodes(JSON.parse(localStorage.getItem("nodes")));
      // console.log(nodes)
    }
    if (localStorage.getItem("edges") !== null) {
      setEdges(JSON.parse(localStorage.getItem("edges")));
    }

    let id = "1";
    let newNode = {};
    // if (nodes.length === 0) {
    if (localStorage.getItem("nodes") === null) {
      newNode = {
        id: "1",
        type: "textUpdater",
        position: { x: 300, y: 100 },
        data: { value: "", style: { color: "rgba(0, 0, 0, 0.88)", fontWeight: "normal" } },
        style: { backgroundColor: "rgb(223, 249, 255)", border: "1px solid rgb(102, 198, 255)", borderRadius: 24 },
      };
    } else {
      // let newId = parseInt(nodes[nodes.length - 1].id) + 1;
      let newId = parseInt(JSON.parse(localStorage.getItem("nodes")).length) + 1;
      let idActiveNodes = localStorage.getItem("active nodes");
      let activeNode = JSON.parse(localStorage.getItem("nodes")).find((obj) => obj.id === idActiveNodes);
      // console.log(activeNode.position.x)
      // console.log(activeNode.position.y)
      let positionX = 200;
      if (posAdd === "left") {
        positionX = -300;
      } else if (posAdd === "right") {
        positionX = 200 + adjustPosition;
      }
      // console.log(newId)
      newNode = {
        id: `${newId}`,
        type: "textUpdater",
        position: { x: activeNode.position.x + positionX, y: activeNode.position.y },
        data: { value: "", style: { color: "rgba(0, 0, 0, 0.88)", fontWeight: "normal" } },
        style: { backgroundColor: "rgb(223, 249, 255)", border: "1px solid rgb(102, 198, 255)", borderRadius: 24, color: "red" },
      };
      id = newId;
    }
    reactFlowInstance.addNodes(newNode);
    setNodes((nds) => nds.concat(newNode));
    if (JSON.parse(localStorage.getItem("nodes")).length !== 0) {
      const newEdges = {
        id: `${id}`,
        source: localStorage.getItem("active nodes"),
        target: `${id}`,
        style: { stroke: "rgb(0, 162, 255)", strokeWidth: "6" },
        type: "floating",
      };
      setEdges((eds) => eds.concat(newEdges));
      reactFlowInstance.addEdges(newEdges);
      // console.log(edges)
    }

    // console.log("nodes flow", nodes);
  };

  //! --------------------------------------------------
  //!                   HANDLE CHANGES
  //! --------------------------------------------------

  const nodesChange = (changes) => {
    console.log("jalan 2");
    setInitialChanges(changes);
    console.log(changes);
    if (localStorage.getItem("dataConvert") !== null) {
      setRootPos(JSON.parse(localStorage.getItem("dataConvert")).root[0].position.x);
    } else {
      setRootPos(0);
    }
    setNodes(JSON.parse(localStorage.getItem("nodes")));
    setNodes((nds) => applyNodeChanges(changes, nds));
    setActiveNodes(changes[0].id);
    const findNode = nodes.find((obj) => obj.id == changes[0].id);
    setActiveNodesPosition(findNode.position.x);
    setAdjustPosition(findNode.width - 142);
    // console.log("pos", findNode.position.x);
    localStorage.setItem("active nodes", changes[0].id);
    localStorage.setItem("nodes", JSON.stringify(nodes));
    console.log(nodes);
  };

  const nodesChange2 = () => {
    console.log("jalan 3");
    // setNodes(JSON.parse(localStorage.getItem("nodes")));
    // setNodes((nds) => applyNodeChanges(initialChanges, nds));
    console.log("not", nodes);
  };

  const edgesChange = (changes) => {
    // console.log(changes);
    setEdges(JSON.parse(localStorage.getItem("edges")));
    setEdges((edg) => applyEdgeChanges(changes, edg));
    localStorage.setItem("edges", JSON.stringify(edges));
  };

  //! --------------------------------------------------
  //!                 SIDE EFFECT
  //! --------------------------------------------------
  // useEffect(() => {
  //   console.log("effect");
  //   if (localStorage.getItem("nodes") !== null) {
  //     reactFlowInstance.addNodes(JSON.parse(localStorage.getItem("nodes")));
  //     console.log("effect", nodes);
  //   }
  //   if (localStorage.getItem("edges") !== null) {
  //     reactFlowInstance.addEdges(JSON.parse(localStorage.getItem("edges")));
  //     console.log("effect", edges);
  //   }
  // }, []);

  return <MindMapContext.Provider value={{ nodes, edges, getReactFlowInstance, onAddNode, nodesChange, edgesChange, activeNodesPosition, rootPos, setNodes, nodesChange2 }}>{props.children}</MindMapContext.Provider>;
};

export default MindMapProvider;
